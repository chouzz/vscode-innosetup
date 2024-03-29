module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        '@typescript-eslint/eslint-plugin-tslint',
        'eslint-plugin-import',
    ],
    env: {
        node: true,
    },
    rules: {
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/semi': 'error',
        curly: 'error',
        'eol-last': 'error',
        'import/no-default-export': 'error',
        'no-var': 'error',
        'prefer-const': 'error',
        quotes: 'off',
        '@typescript-eslint/quotes': ['error', 'single'],
    },
    ignorePatterns: ['*.d.ts'],
};
