import {
  makeOperation,
  cacheExchange,
  createClient,
  dedupExchange,
  errorExchange,
  fetchExchange,
  Client,
} from '@urql/core';
import { authExchange } from '@urql/exchange-auth';
import { Exome } from 'exome';

import { API_URL, AUTH_URL } from '../constants/api';

let cachedClient: Client | null = null;

interface APIAuthResponse {
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

  public get client(): Client {
    if (cachedClient) {
      return cachedClient;
    }

    cachedClient = createClient({
      url: API_URL,
      fetchOptions: {
        headers: {
          'x-hasura-role': 'anonymous',
        },
      },
      suspense: true,
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
              // @TODO: User refresh jwt token endpoint
              // const result = await fetch(
              //   `${AUTH_URL}/auth/token/refresh`,
              //   {
              //     credentials: 'include',
              //   },
              // ).then<APIAuthResponse>((data) => data.json());

              // if (result.jwt_token) {
              //   // store.login(result);

              //   // return the new tokens
              //   return {
              //     token: result.jwt_token,
              //   };
              // }

              this.logout();

              return null;
            }

            return authState;
          },
        }),
        fetchExchange,
      ],
    });

    return cachedClient;
  }

  public async login(email: string, password: string) {
    const response = await fetch(
      `${AUTH_URL}/login`,
      {
        method: 'post',
        // credentials: 'include',
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
  }

  public async signup(email: string, password: string, name: string) {
    const response = await fetch(
      `${AUTH_URL}/signup`,
      {
        method: 'post',
        // credentials: 'include',
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
  }

  public logout() {
    this.token = null;
    this.user = null;
    this.expiresAt = null;
    this.isLoggedIn = false;
  }
}
