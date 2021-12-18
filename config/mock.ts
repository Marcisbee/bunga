/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse } from 'graphql';
import { spyOn, restoreAll } from 'nanospy';

import { API_URL, AUTH_URL } from '../src/constants/api';

type MockFetchHandler = (url: RequestInfo, config?: RequestInit) => Promise<Response | void>;

export function mockAPI<
  Input extends Record<string, any> = Record<string, any>,
  Output extends Record<string, any> = Record<string, any>,
>(
  type: 'query' | 'mutation',
  name: string,
  response: (data: Input) => Output | undefined,
): MockFetchHandler {
  return async (url, config) => {
    if (url !== API_URL) {
      return;
    }

    const payload: Record<'query' | 'mutation' | 'variables', any> = JSON.parse(config!.body as any);
    const schema = payload?.[type];

    if (!schema) {
      return;
    }

    const ast = parse(schema);

    if (!ast) {
      return;
    }

    if (ast.definitions[0].kind !== 'OperationDefinition') {
      return;
    }

    if (ast.definitions[0].name?.value !== name) {
      return;
    }

    const data = response(payload.variables as Input);

    if (!data) {
      return;
    }

    return {
      ok: true,
      json: async () => ({
        data,
      }),
    } as Response;
  };
}

export function mockAuth<
  Input extends Record<string, any> = Record<string, any>,
  Output extends Record<string, any> = Record<string, any>,
>(
  type: 'get' | 'post',
  endpoint: string,
  response: (data: Input) => Output | undefined,
): MockFetchHandler {
  return async (url, config) => {
    if (url !== `${AUTH_URL}${endpoint}` && config?.method !== type) {
      return;
    }

    const payload: Record<string, any> = JSON.parse(config!.body as any);

    const data = response(payload as Input);

    if (!data) {
      return;
    }

    return {
      ok: true,
      json: async () => data,
    } as Response;
  };
}

export function mockFetch(...handlers: MockFetchHandler[]) {
  spyOn(global, 'fetch', async (url, config) => {
    for (const handler of handlers) {
      const output = await handler(url, config);

      if (output) {
        return output;
      }
    }

    return {
      ok: false,
    } as Response;
  });
}

export const mockFetchRestore = restoreAll;
