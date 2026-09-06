import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const outputFile = resolve("dist/client/index.html");
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("static", `${process.pid}-${Date.now()}`);

const { default: worker } = await import(workerUrl.href);

const response = await worker.fetch(
  new Request("http://localhost/", {
    headers: { accept: "text/html" },
  }),
  {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  },
  {
    waitUntil() {},
    passThroughOnException() {},
  },
);

if (!response.ok) {
  throw new Error(`Static render failed with status ${response.status}`);
}

const html = await response.text();

if (!/<html\b/i.test(html) || !/Asteroids Supply/i.test(html)) {
  throw new Error("Static render did not produce the expected page HTML");
}

await mkdir(dirname(outputFile), { recursive: true });
await writeFile(outputFile, html);

console.log(`Rendered ${outputFile}`);
