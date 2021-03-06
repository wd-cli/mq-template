module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
     "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        //代码检查
        //警告
        "no-empty-function":1,
        "no-script-url":1,
        "no-unused-vars":1,
        "no-undefined":1,
        "no-undef": 1,

        //错误
        "no-restricted-globals":2,
        "no-use-before-define":2,
        "no-void":2,
        "no-caller":2,
        "no-alert":2,
        "no-eval":2,
        "no-debugger": 2,
        "no-console":2,
        "no-delete-var": 2,
        "no-constant-condition":2
    }
}
