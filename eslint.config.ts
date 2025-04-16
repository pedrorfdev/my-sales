import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: ['node_modules', 'dist', 'build', '*.js'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
    },
    rules: {
      'no-console': 'warn',
      // Regras recomendadas
      ...eslintPluginTs.configs.recommended.rules,
    },
  },
  ...compat.extends('prettier'),
];
