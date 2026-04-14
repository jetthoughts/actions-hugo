import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

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
    ignores: ['lib/', 'node_modules/']
  }
);
