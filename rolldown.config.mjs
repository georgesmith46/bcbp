import { defineConfig } from "rolldown";

export default defineConfig([
  {
    input: "./src/index.ts",
    output: [
      {
        dir: "dist",
        entryFileNames: "index.umd.js",
        format: "umd",
        name: "bcbp",
      },
      {
        dir: "dist",
        entryFileNames: "index.esm.js",
        format: "es",
      },
    ],
  }
]);
