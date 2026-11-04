import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,ts}'],
    languageOptions: { globals: globals.browser },
    plugins: {
      js,
    },
    extends: ['js/recommended', tseslint.configs.recommended],
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'error',
    },
  },
  eslintConfigPrettier,
]);
