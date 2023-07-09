import { startServer } from "./web/server";

const main = async () => {
  startServer({ port: 3333 });
};

// Export an empty object ...
export {};
// ... so we can use top-level await.
await main();
