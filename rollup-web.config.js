import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "./build/web/app.js",
  output: {
    file: "./build/web/public/bundle.js",
    format: "cjs"
  },
  plugins: [nodeResolve({ preferBuiltins: true }), commonjs(), json()]
};
