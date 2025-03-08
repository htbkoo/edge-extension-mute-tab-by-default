import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import onlyWarn from "eslint-plugin-only-warn";

export default tseslint.config(
  // reference: https://typescript-eslint.io/getting-started#step-2-configuration
  eslint.configs.recommended,
  tseslint.configs.recommended,
  // reference: https://typescript-eslint.io/troubleshooting/faqs/general#how-do-i-turn-on-a-typescript-eslint-rule
  {
    env: {
      // reference: https://stackoverflow.com/a/50513752/10734272
      webextensions: true,
    },
    ignores: ["dist", "build", "publish"],
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "only-warn": onlyWarn,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
);
