import { spawn } from "node:child_process";
import { createServer } from "node:net";

const host = "127.0.0.1";

function getFreePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once("error", reject);
    probe.listen(0, host, () => {
      const address = probe.address();
      if (!address || typeof address === "string") {
        probe.close(() => reject(new Error("Unable to allocate a preview port.")));
        return;
      }
      probe.close(() => resolve(address.port));
    });
  });
}

function waitForServer(origin, child) {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const poll = async () => {
      if (child.exitCode !== null) {
        reject(new Error(`Static preview exited with code ${child.exitCode}.`));
        return;
      }
      try {
        const response = await fetch(origin, { redirect: "manual" });
        if (response.status === 200) {
          resolve();
          return;
        }
      } catch {
        // The preview process may still be binding its socket.
      }
      if (Date.now() - started > 15_000) {
        reject(new Error(`Timed out waiting for ${origin}.`));
        return;
      }
      setTimeout(poll, 100);
    };
    void poll();
  });
}

const port = await getFreePort();
const origin = `http://${host}:${port}`;
const preview = spawn(process.execPath, ["scripts/static-server.mjs"], {
  cwd: process.cwd(),
  env: { ...process.env, HOST: host, PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"],
  windowsHide: true,
});

let previewError = "";
preview.stderr.on("data", (chunk) => {
  previewError += chunk.toString();
});

try {
  await waitForServer(origin, preview);
  const audit = spawn(process.execPath, ["scripts/release-audit.mjs"], {
    cwd: process.cwd(),
    env: { ...process.env, AUDIT_ORIGIN: origin },
    stdio: "inherit",
    windowsHide: true,
  });
  const exitCode = await new Promise((resolve) => {
    audit.once("exit", (code) => resolve(code ?? 1));
  });
  process.exitCode = exitCode;
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  if (previewError) console.error(previewError);
  process.exitCode = 1;
} finally {
  preview.kill();
}
