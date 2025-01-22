import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
  {
    ignores: [
      "dist/", // Ignore the `dist` directory
      "**/webpack*.cjs", // Ignore files like `webpack.config.cjs` or `webpack.prod.cjs`

    ],
  },
];