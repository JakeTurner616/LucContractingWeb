import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const useShell = process.platform === "win32";

const processes = [
  {
    name: "site",
    args: ["run", "dev:site"],
  },
  {
    name: "cms",
    args: ["run", "cms"],
  },
];

const running = new Set();
let shuttingDown = false;

const stopAll = (code = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of running) {
    if (!child.killed) {
      child.kill();
    }
  }

  setTimeout(() => process.exit(code), 250);
};

for (const processConfig of processes) {
  const child = spawn(npmCommand, processConfig.args, {
    cwd: process.cwd(),
    env: process.env,
    shell: useShell,
    stdio: "inherit",
  });

  running.add(child);

  child.on("exit", (code, signal) => {
    running.delete(child);

    if (shuttingDown) return;

    if (code && code !== 0) {
      console.error(`${processConfig.name} exited with code ${code}`);
      stopAll(code);
      return;
    }

    if (signal) {
      console.error(`${processConfig.name} stopped by ${signal}`);
      stopAll(1);
    }
  });
}

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));
