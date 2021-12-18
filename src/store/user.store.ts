import {
  makeOperation,
  cacheExchange,
  createClient,
  dedupExchange,
  errorExchange,
  fetchExchange,
} from '@urql/core';
import { authExchange } from '@urql/exchange-auth';
import { Exome } from 'exome';
import jwtDecode from 'jwt-decode';

import { API_URL, AUTH_URL } from '../constants/api';

export interface APIAuthResponse {
  jwt_expires_in: number;
  jwt_token: string;
  user: {
    id: string;
    role: 'admin' | 'user';
    email: string;
    name: string;
  };
}

export class UserStore extends Exome {
  public isLoggedIn = false;

  public token: string | null = null;

  public expiresAt: Date | null = null;

  public user: APIAuthResponse['user'] | null = null;

  constructor() {
    super();

    this.loadToken();
  }

  public client = createClient({
    url: API_URL,
    fetchOptions: {
      headers: {
        'x-hasura-role': 'anonymous',
      },
    },
    suspense: false,
    exchanges: [
      dedupExchange,
      cacheExchange,
      errorExchange({
        onError: (error) => {
          const isAuthError = error.graphQLErrors.some((e) => e.extensions?.code === 'FORBIDDEN' || e.extensions?.code === 'invalid-jwt');

          if (isAuthError) {
            this.logout();
          }
        },
      }),
      authExchange<{ token: string | null }>({
        addAuthToOperation: ({ authState, operation }) => {
          if (!authState || !authState.token) {
            return operation;
          }

          const fetchOptions = typeof operation.context.fetchOptions === 'function'
            ? operation.context.fetchOptions()
            : operation.context.fetchOptions || {};

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete fetchOptions!.headers!['x-hasura-role'];

          return makeOperation(operation.kind, operation, {
            ...operation.context,
            fetchOptions: {
              ...fetchOptions,
              headers: {
                ...fetchOptions.headers,
                Authorization: `Bearer ${authState.token}`,
              },
            },
          });
        },
        willAuthError: ({ authState }) => {
          if (!authState || !this.expiresAt) {
            return true;
          }

          return this.expiresAt < new Date();
        },
        getAuth: async ({ authState }) => {
          if (!authState && this.isLoggedIn && this.expiresAt! >= new Date()) {
            return {
              token: this.token,
            };
          }

          if ((!authState || !this.expiresAt || this.expiresAt < new Date()) && this.isLoggedIn) {
            try {
              await this.refresh();
            } catch (e) {
              // do nothing
            }

            if (this.token) {
              return {
                token: this.token,
              };
            }

            this.logout();

            return null;
          }

          return authState;
        },
      }),
      fetchExchange,
    ],
  });

  public async refresh() {
    const response = await fetch(
      `${AUTH_URL}/v1/refresh`,
      {
        method: 'post',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Refresh failed');
    }

    const data: APIAuthResponse = await response.json();

    if (!data?.jwt_token) {
      throw new Error('Refresh failed');
    }

    this.token = data.jwt_token;
    this.user = data.user;
    this.expiresAt = new Date(Date.now() + data.jwt_expires_in * 1000);
    this.isLoggedIn = true;

    this.saveToken();
  }

  public async login(email: string, password: string) {
    const response = await fetch(
      `${AUTH_URL}/v1/login`,
      {
        method: 'post',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data: APIAuthResponse = await response.json();

    if (!data?.jwt_token) {
      throw new Error('Login failed');
    }

    this.token = data.jwt_token;
    this.user = data.user;
    this.expiresAt = new Date(Date.now() + data.jwt_expires_in * 1000);
    this.isLoggedIn = true;

    this.saveToken();
  }

  public async signup(email: string, password: string, name: string) {
    const response = await fetch(
      `${AUTH_URL}/v1/signup`,
      {
        method: 'post',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    const data: APIAuthResponse = await response.json();

    if (!data?.jwt_token) {
      throw new Error('Signup failed');
    }

    this.token = data.jwt_token;
    this.user = data.user;
    this.expiresAt = new Date(Date.now() + data.jwt_expires_in * 1000);
    this.isLoggedIn = true;

    this.saveToken();
  }

  public logout() {
    this.token = null;
    this.user = null;
    this.expiresAt = null;
    this.isLoggedIn = false;

    // @TODO: Remove refresh cookie
    this.removeToken();
  }

  private loadToken() {
    let cachedToken: string | null = null;

    try {
      cachedToken = window.localStorage.getItem('token');
    } catch (e) {
      // do nothing
    }

    if (!cachedToken) {
      return;
    }

    try {
      const data: Record<string, never> = jwtDecode(cachedToken);

      if (data && typeof data !== 'object') {
        return;
      }

      const claims: Record<string, string> = data['https://hasura.io/jwt/claims'];

      if (claims && typeof claims !== 'object') {
        return;
      }

      const id = claims?.['x-hasura-user-id'];
      const name = claims?.['x-hasura-display-name'];
      const email = claims?.['x-hasura-email'];
      const role = claims?.['x-hasura-default-role'] as never;

      if (typeof data.exp !== 'number' || !email || !role) {
        return;
      }

      this.token = cachedToken;
      this.user = {
        id,
        name,
        email,
        role,
      };
      this.expiresAt = new Date(data.exp * 1000);
      this.isLoggedIn = true;
    } catch (e) {
      // do nothing
    }
  }

  private saveToken() {
    if (!this.token) {
      return;
    }

    try {
      window.localStorage.setItem('token', this.token);
    } catch (e) {
      // do nothing
    }
  }

  private removeToken() {
    try {
      window.localStorage.removeItem('token');
    } catch (e) {
      // do nothing
    }
  }
}
