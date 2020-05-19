module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        <%_ if(typescript) { _%>
        "plugin:@typescript-eslint/eslint-recommended"
        <%_ } _%>
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    <%_ if(typescript) { _%>
        "parser": "@typescript-eslint/parser",
    <%_ } _%>
    "parserOptions": {
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    <%_ if(typescript) { _%>
        "plugins": [
            "@typescript-eslint"
        ],
    <%_ } _%>
    "rules": {
        //代码检查
        //警告
        "no-empty-function":1,
        "no-script-url":1,
        "no-unused-vars":1,
        "no-undefined":1,

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
