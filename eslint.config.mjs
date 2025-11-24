import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;

// import next from '@next/eslint-plugin-next';
// import typescriptParser from '@typescript-eslint/parser';
// import prettierPlugin from 'eslint-plugin-prettier';
// import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';

// export default [
//   {
//     files: ['**/*.ts', '**/*.tsx'],
//     languageOptions: {
//       parser: @typescript-eslint/parser eslint-plugin-prettiertypescriptParser,
//       parserOptions: {
//         ecmaFeatures: { jsx: true },
//         sourceType: 'module',
//       },
//     },
//     plugins: {
//       '@next/next': next,
//       '@typescript-eslint': typescriptEslintPlugin,
//       prettier: prettierPlugin,
//     },
//     rules: {
//       '@next/next/no-html-link-for-pages': 'error',
//       'prettier/prettier': 'error',
//       '@typescript-eslint/no-explicit-any': 'error',
//     },
//   },
// ];
