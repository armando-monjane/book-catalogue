module.exports = {
    root: true,
    env: {
        node: true,
        es2021: true,
    },
    extends: [
        "eslint:recommended",
        "airbnb-base",
        "airbnb-typescript/base",
        "plugin:prettier/recommended",
        "@typescript-eslint/parser",
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
    },
    rules: {
        "no-console": [
            "error",
            {
                allow: ["warn", "error"],
            },
        ],
        "multiline-ternary": 0,
        "no-unused-vars": "off",
        "no-shadow": 0,
        "@typescript-eslint/no-unused-vars": "error",
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                js: "never",
                ts: "never",
            },
        ],
        "max-len": [
            "warn",
            {
                code: 80,
                tabWidth: 2,
                comments: 80,
                ignoreComments: false,
                ignoreTrailingComments: true,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
            },
        ],
    },
    plugins: ["@typescript-eslint"],
};
