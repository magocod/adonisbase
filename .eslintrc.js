module.exports = {
    root: true,
    env: {
        node: true
    },
    parserOptions: {
        "ecmaVersion": 2017
    },
    extends: [
        'eslint:recommended',
    ],
    rules: {
        '@typescript-eslint/camelcase': 'off', 
        'indent': ['error', 2],
        'quotes': [2, 'single'],
    }
}
