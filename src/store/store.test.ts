import { Exome } from 'exome';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import {
  mockFetch,
  mockAPI,
  mockAuth,
  mockFetchRestore,
} from '../../config/mock';

import { store as defaultStore, Store } from './store';
import { APIAuthResponse } from './user.store';

const test = suite('Store');

test.after.each(mockFetchRestore);

test('exports `store` as instance of Exome', () => {
  assert.instance(defaultStore, Store);
  assert.instance(defaultStore, Exome);
});

test('default value of store', () => {
  const expected = {
    user: {
      isLoggedIn: false,
      token: null,
      expiresAt: null,
      user: null,
      client: {
        url: 'https://api.bunga.design/v1/graphql',
        fetchOptions: {
          headers: {
            'x-hasura-role': 'anonymous',
          },
        },
        suspense: false,
        requestPolicy: 'cache-first',
        preferGetMethod: false,
        maskTypename: false,
      },
    },
    projectsDetails: {},
    projects: {},
  };

  const store = new Store();

  assert.snapshot(
    JSON.stringify(store, null, 2),
    JSON.stringify(expected, null, 2),
  );
});

test('sets active project', async () => {
  mockFetch(
    mockAuth<{ email: string, password: string }, APIAuthResponse>('get', '/v1/login', (data) => {
      if (data.email !== 'test@test.test' && data.password !== 'test') {
        return;
      }

      return {
        jwt_token: 'token|blah',
        user: {
          id: 'id000',
          email: 'test@test.test',
          name: 'Tester',
          role: 'user',
        },
        jwt_expires_in: 3600,
      };
    }),
    mockAPI<{ id: string }, { projects_by_pk: any }>('query', 'GetProjectById', (data) => {
      if (data.id !== 'id123') {
        return;
      }

      return {
        projects_by_pk: {
          id: 'id123',
          image: null,
          title: 'Test Project',
          content: {},
          created_at: '2021-12-17T13:23:17.274612+00:00',
          updated_at: '2021-12-17T13:36:02.115706+00:00',
          __typename: 'projects',
        },
      };
    }),
  );

  const store = new Store();

  await store.user.login('test@test.test', 'test');

  const project = await store.getProjectById('id123');

  assert.equal(Object.keys(store.projects), ['id123']);
  assert.ok(store.activeProject);
  assert.ok(project);
  assert.equal(store.activeProject, project);
  assert.equal(store.activeProject, store.projects.id123);
});

test.run();
