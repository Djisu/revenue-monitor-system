module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
      project: './tsconfig.json',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    plugins: [
      'react',
      'react-hooks',
      '@typescript-eslint',
      'jsx-a11y',
      'prettier',
    ],
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    rules: {
      // Customize rules below as needed
      'prettier/prettier': 'warn',
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        parserOptions: {
          project: './tsconfig.json',
        },
      },
    ],
  };
  