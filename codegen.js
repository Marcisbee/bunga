module.exports = {
  schema: './graphql.schema.json',
  documents: ['./src/**/*.gql'],
  overwrite: true,
  generates: {
    './src/graphql/index.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typed-document-node',
      ],
      config: {
        skipTypename: true,
        onlyOperationTypes: true,
        preResolveTypes: true,
      },
    },
  },
};
