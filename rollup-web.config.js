import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import path from "path";
import escapeStringRegexp from "escape-string-regexp";
import replace from "@rollup/plugin-replace";

const reduxToolkitESM = new RegExp(
  `${escapeStringRegexp(
    path.join("node_modules", "@reduxjs", "toolkit", "dist", "redux-toolkit.esm.js")
  )}$`,
  "ig"
);

export default {
  input: "./build/dist/web/app.js",
  output: {
    file: "./build/dist/web/public/bundle.js",
    format: "cjs"
  },
  plugins: [
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": JSON.stringify("development")
    }),
    nodeResolve({ browser: true, preferBuiltins: true }),
    commonjs(),
    json()
  ],
  onwarn: (warning, defaultHandler) => {
    let shouldHandle = true;

    if (warning.code === "THIS_IS_UNDEFINED") {
      if (warning.id.match(reduxToolkitESM)) {
        shouldHandle = false;
      }
    }

    if (shouldHandle) {
      defaultHandler(warning);
    }
  },
  external: ["canvas"]
};
