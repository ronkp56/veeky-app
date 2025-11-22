// eslint.config.mjs
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // 1) Ignore paths (replaces .eslintignore)
  { ignores: ['node_modules', '.expo', 'dist', 'build', 'android', 'ios'] },

  // 2) Treat config files as Node env (allows `module`, `require`, etc.)
  {
    files: ['babel.config.js', 'metro.config.js', 'jest.config.js', '**/*.config.js'],
    languageOptions: { globals: { ...globals.node } }
  },

  // 3) Base JS recommended rules
  js.configs.recommended,

  // 4) TypeScript recommended (no type-aware rules; use `npm run typecheck` for that)
  ...tseslint.configs.recommended,

  // 5) TS/JS unused vars: warn, and allow `_`-prefixed unuseds
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }
      ],
      // make sure ESLint's core rule doesn't double-report alongside the TS rule
      'no-unused-vars': 'off'
    }
  },

  // 6) React Hooks rules
  {
    files: ['**/*.{tsx,jsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  },

  // 7) Turn off formatting-related lint rules (Prettier owns formatting)
  eslintConfigPrettier
);
