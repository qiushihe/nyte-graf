import chokidar from "chokidar";
import debounce from "lodash/fp/debounce";
import path from "path";
import shell from "shelljs";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const startWatcher = () => {
  let watcherBuilding = false;
  let hasPendingChanges = false;

  const runBuild = () => {
    if (watcherBuilding) {
      console.log(`[Watcher] Currently building; Waiting for build process to finish ...`);
      hasPendingChanges = true;
    } else {
      console.log(`[Watcher] Starting build process ...`);
      watcherBuilding = true;

      shell.exec("npm run build", { async: true }).on("exit", (code) => {
        console.log(`[Watcher] Build process exit code: ${code}`);
        watcherBuilding = false;

        if (hasPendingChanges) {
          console.log(`[Watcher] Has pending changes; Building again ...`);
          hasPendingChanges = false;
          runBuild();
        } else {
          console.log(`[Watcher] No more pending changes; Waiting ...`);
        }
      });
    }
  };

  const debouncedRunBuild = debounce(1000)(runBuild);

  let watcherReady = false;

  const watcher = chokidar.watch("./src", {
    cwd: path.join(__dirname, ".."),
    persistent: true,
    ignored: undefined
  });

  watcher.on("all", (evt, path) => {
    if (watcherReady) {
      console.log(`[Watcher] Event: ${evt}; Path: ${path}`);
      debouncedRunBuild();
    }
  });

  watcher.on("ready", () => {
    watcherReady = true;
    console.log("[Watcher] Ready");
  });
};

startWatcher();
