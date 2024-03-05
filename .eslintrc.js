module.exports = {
    extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    env: {
        node: true,
        es6: true, // 支持全局的 es6 语法Set
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2021, // 支持 es6 语法
        sourceType: "module",
    },
    plugins: ["@typescript-eslint", "import"],
    rules: {
        "import/extensions": ["error", "always", { js: "always" }],
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-explicit-any": "off",
        // "no-unused-vars": "warn", // 此规则与@typescript-eslint/no-unused-vars冲突
        "no-console": "error",
        "no-ex-assign": "error",
        complexity: ["warn", 15],
        // "no-undef": "error",
        "no-fallthrough": "error",
        "no-shadow": "warn",
        "no-invalid-this": "error",
        "no-duplicate-case": "error",
        "no-cond-assign": "error",
        "no-const-assign": "error",
        "no-var": "warn",
        "for-direction": "error",
        "no-fallthrough": "error",
        "no-constant-condition": "error",
    },
};
