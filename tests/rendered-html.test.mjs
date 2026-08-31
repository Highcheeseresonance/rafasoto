import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
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
}

test("server-renders Asteroids Supply", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Asteroids Supply<\/title>/i);
  assert.match(html, /Asteroids Supply/);
  assert.match(html, /PLAY/);
  assert.match(html, /THE COLLECTION/);
  assert.match(html, /Insert coin\. Behave normally\./);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("source contains collection and drop logic", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Sunriot/);
  assert.match(page, /Duskpop/);
  assert.match(page, /Sunphony/);
  assert.match(page, /Miguel Payá/);
  assert.match(page, /Brainglow/);
  assert.match(page, /Guillem Martín/);
  assert.match(page, /Moonjuice/);
  assert.match(page, /hero-desktop\.jpg/);
  assert.match(page, /hero-mobile\.jpeg/);
  assert.match(page, /AsteroidsGame/);
  assert.match(page, /ProductGallery/);
  assert.match(page, /galleryFor\("sunphony"/);
  assert.match(page, /galleryFor\("brainglow"/);
  assert.match(page, /gallery-count/);
  assert.match(page, /splash-cover/);
  assert.match(page, /hamburger-button/);
  assert.match(page, /play to get the t-shirts/);
  assert.match(page, /gameWords = products\.map/);
  assert.match(page, /WordDisplay/);
  assert.match(page, /added\. Keep playing/);
  assert.match(page, /canvasRef/);
  assert.match(page, /onUnlock\(asteroid\.word\.id\)/);
  assert.match(page, /logo-as-blanco\.png/);
  assert.match(layout, /unlock access/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
