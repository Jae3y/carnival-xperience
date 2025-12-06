import eslintConfigNext from 'eslint-config-next';

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  ...eslintConfigNext,
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'node_modules/**', 'supabase/.temp/**'],
  },
];

export default config;
