import ts from "rollup-plugin-ts";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";

export default {
  input: "./src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "umd",
      name: "bcbp",
    },
    {
      file: pkg.module,
      format: "es",
    },
  ],
  plugins: [ts({ transpiler: "babel" }), resolve(), commonjs()],
};
