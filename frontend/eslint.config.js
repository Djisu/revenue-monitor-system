import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 🔁 Ignore all .js files
  {
    ignores: ["**/*.js"],
  },

  // ✅ Lint config for TypeScript/JSX files
  {
    files: ["**/*.{mjs,cjs,ts,tsx,jsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },
    plugins: {
      js,
    },
    extends: ["js/recommended"],
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // ✅ TypeScript recommended rules
  tseslint.configs.recommended,

  // ✅ React plugin config
  pluginReact.configs.flat.recommended,

  // 🚨 Overrides AFTER presets
  {
    files: ["**/*.{ts,tsx,jsx}"],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off", // ✅ Disable prop-types for TS/JSX files
    },
  },
]);
