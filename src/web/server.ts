import express from "express";
import path from "path";
import url from "url";

import { StartServerOptions } from "./server.type";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const startServer = (options?: StartServerOptions) => {
  const port = options?.port || 3000;
  const app = express();

  app.use("/nyte-graf", express.static(path.join(__dirname, "public")));

  app.listen(port, () => {
    console.log(`NyteGraf web server running at: http://localhost:${port}/nyte-graf`);
  });
};
