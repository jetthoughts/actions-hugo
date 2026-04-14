import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import jest from 'eslint-plugin-jest';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2019
      }
    }
  },
  {
    files: ['__tests__/**/*.ts'],
    ...jest.configs['flat/recommended']
  },
  {
    ignores: ['lib/', 'node_modules/', 'jest.config.js']
  }
);
