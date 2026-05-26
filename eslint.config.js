import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginPrettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist/**', 'scratch/**'] },
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'module', globals: { ...globals.browser } },
  },
  {
    files: [
      'bin/**/*.js',
      'scripts/**/*.js',
      'rollup.config.js',
      'vitest.config.js',
      'eslint.config.js',
    ],
    languageOptions: { globals: { ...globals.node } },
  },
  pluginJs.configs.recommended,
  pluginPrettier,
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
    },
  },
];
