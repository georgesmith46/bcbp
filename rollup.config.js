import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";

export default {
  input: "./src/index.js",
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
  plugins: [
    babel({ exclude: "node_modules/**", babelHelpers: "runtime" }),
    resolve(),
    commonjs(),
  ],
};
