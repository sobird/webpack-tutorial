/**
 * "off" or 0 - turn the rule off
 * "warn" or 1 - turn the rule on as a warning (doesn't affect exit code)
 * "error" or 2 - turn the rule on as an error (exit code will be 1)
 * 
 * @see https://typescript-eslint.io/play
 */

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    // 'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    // 'indent': ['error', 2],
    '@typescript-eslint/indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    '@typescript-eslint/semi': 'error',
    'no-unused-vars': ['warn'],
    'no-multi-spaces': 'error',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/space-before-blocks': 'error',
    '@typescript-eslint/comma-spacing': ['error', { 'before': false, 'after': true }],
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/keyword-spacing': 'error',
    '@typescript-eslint/key-spacing': 'error',
    '@typescript-eslint/func-call-spacing': 'error',
    '@typescript-eslint/block-spacing': 'error'
  },
};
