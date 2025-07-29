// orval.config.ts
import type { Options } from 'orval';

const config: Record<string, Options> = {
  // Pet 태그만 필터링해서 생성
  pet: {
    input: {
      target: 'https://petstore.swagger.io/v2/swagger.json',
      filters: { tags: ['pet'] } // 🎯 pet 태그만 필터링
    },
    output: {
      target: './src/api/clients/pet.ts',
      schemas: './src/api/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/fetcher.ts',
          name: 'customFetcher',
        },
      },
    },
  },

  // Store 태그만 필터링해서 생성
  store: {
    input: {
      target: 'https://petstore.swagger.io/v2/swagger.json',
      filters: { tags: ['store'] } // 🎯 store 태그만 필터링
    },
    output: {
      target: './src/api/clients/store.ts',
      schemas: './src/api/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/fetcher.ts',
          name: 'customFetcher',
        },
      },
    },
  },

  // User 태그만 필터링해서 생성
  user: {
    input: {
      target: 'https://petstore.swagger.io/v2/swagger.json',
      filters: { tags: ['user'] } // 🎯 user 태그만 필터링
    },
    output: {
      target: './src/api/clients/user.ts',
      schemas: './src/api/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/fetcher.ts',
          name: 'customFetcher',
        },
      },
    },
  },

  // 전체 API (필터링 없음) - 백업용
  petstore: {
    input: {
      target: 'https://petstore.swagger.io/v2/swagger.json',
    },
    output: {
      target: './src/api/petstore.ts',
      schemas: './src/api/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/fetcher.ts',
          name: 'customFetcher',
        },
      },
    },
  },

};

export default config;
