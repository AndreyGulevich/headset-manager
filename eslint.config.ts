import js from '@eslint/js';
import tseslint from 'typescript-eslint';

const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'config/**/*.ts', 'vite.config.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      'coverage/',
    ],
  },
];

export default config;
