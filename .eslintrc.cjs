/** @type {import('eslint').Linter.BaseConfig} */
module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  settings: {
    'import/resolver': {
      typescript: true,
    },
  },
  reportUnusedDisableDirectives: true,
  rules: {
    // default export ではなく named export を使う
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',

    // ESM 非対応。tsc でチェックできているので無効化
    'import/extensions': 'off',

    // typescript-eslint のルールの方が正確
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
  },
  overrides: [
    {
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      files: ['**/*.cjs'],
    },
    {
      // テストファイルでは devDependencies からの import を許可
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true },
        ],
      },
      files: ['**/*.test.*'],
    },
  ],
};
