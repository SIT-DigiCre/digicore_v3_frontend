import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import tsESLint from 'typescript-eslint';

const eslintConfig = defineConfig([
  // 先頭のconfigオブジェクトでignoresのみを指定することでglobal ignoreになる
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  eslintConfigPrettier,
  ...tsESLint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      import: importPlugin,
    },
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "no-console": [
        "error",
        {
          allow: ["warn", "error"],
        },
      ],
      "import/order": [
        "error",
        {
          "groups": [
            "builtin",
            "external",
            "parent",
            "sibling",
            "index",
            "object",
            "type"
          ],
          "pathGroups": [
            {
              "pattern": "{react,react-dom/**,react-router-dom,next,next/**}",
              "group": "builtin",
              "position": "before"
            },
          ],
          "pathGroupsExcludedImportTypes": ["builtin"],
          "alphabetize": {
            "order": "asc"
          },
          "newlines-between": "always"
        }
      ]
    },
  },
]);

export default eslintConfig;
