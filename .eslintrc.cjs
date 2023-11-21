module.exports = {
  root: true,
  extends: [
    'sobird/typescript-react.cjs',
  ],
  rules: {
    'import/no-import-module-exports': ['error', {
      exceptions: ['**/*'],
    }],
    'arrow-body-style': ["error", "always"]
  }
};
