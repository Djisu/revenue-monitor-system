import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Core JavaScript rules
  js.configs.recommended,

  // TypeScript ESLint rules
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      // Use react recommended rules
      ...pluginReact.configs.recommended.rules,

      // Optional: customize rules here
      "react/react-in-jsx-scope": "off", // if using React 17+
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // File ignore patterns (replaces .eslintignore)
  {
    ignores: ["dist/", "node_modules/", "**/*.test.*"],
  },
]);
// End of file
