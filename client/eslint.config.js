import createConfig from "@acs-dubai/eslint-config/create-config";
import pluginQuery from "@tanstack/eslint-plugin-query";
import tailwind from "eslint-plugin-tailwindcss";

export default createConfig(
  {
    react: true,
    ignores: ["**/app/routeTree.gen.ts"],
  },
  {
    plugins: {
      "@tanstack/query": pluginQuery,
      "tailwindcss": tailwind,
    },
    rules: {
      "antfu/top-level-function": "off",
      "@tanstack/query/exhaustive-deps": "error",
    },
  },
  ...tailwind.configs["flat/recommended"],
);
