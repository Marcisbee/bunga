module.exports = {
  schema: [
    {
      'https://api.bunga.design/v1/graphql': {
        headers: {
          'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
        },
      },
    },
  ],
  overwrite: true,
  generates: {
    './graphql.schema.json': {
      plugins: [
        'introspection',
      ],
    },
  },
};
