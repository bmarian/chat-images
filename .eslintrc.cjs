module.exports = {
  extends: [
    'eslint:recommended',
    'google',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    'max-len': 'off',
    'linebreak-style': 'off',
    'semi': ['error', 'never']
  },
  root: true
}
