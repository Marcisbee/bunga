import { Exome } from 'exome';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { store as defaultStore, Store } from './store';

const test = suite('Store');

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

// test('sets active project', () => {
//   const store = new Store();

//   const project = store.setActiveProject('id_123');

//   assert.equal(Object.keys(store.projects), ['id_123']);
//   assert.ok(store.activeProject);
//   assert.equal(store.activeProject, project);
//   assert.equal(store.activeProject, store.projects.id_123);
// });

test.run();
