import { defineConfig } from "rolldown";
import { dts } from "rolldown-plugin-dts";

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
  },
  {
    input: "./src/index.ts",
    output: { dir: "dist", entryFileNames: "index.esm.d.ts", format: "es" },
    plugins: [dts()],
  },
]);
