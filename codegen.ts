import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:3000/shop-api',
  documents: 'src/app/graphql/*.ts',
  generates: {
    'src/gql/': {
      preset: 'client',
      config: {
        scalars: {
          Money: 'number',
          DateTime: 'string',
          JSON: 'Record<string, any>',
          Upload: 'File',
        },
        namingConvention: {
          enumValues: 'keep',
        },
      },
    },
  },
};

export default config;
