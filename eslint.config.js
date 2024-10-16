// @ts-check
import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import promise from 'eslint-plugin-promise';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import solid from 'eslint-plugin-solid/configs/typescript';
import tseslint from 'typescript-eslint';
import path from 'node:path';
import tsParser from '@typescript-eslint/parser';

export default tseslint.config(
  prettier,
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    ignores: ['**/styled-system/'],
  },
  {
    files: ['**/*.tsx', '**/*.ts'],
    extends: [solid],
    plugins: {
      'simple-import-sort': simpleImportSort,
      promise,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: path.resolve(
          import.meta.dirname,
          'packages',
          'client',
          'tsconfig.json'
        ),
        tsconfigRootDir: path.resolve(
          import.meta.dirname,
          'packages',
          'client'
        ),
      },
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'solid/jsx-no-undef': 'off',
      'no-unused-vars': 'off',
    },
  }
);
