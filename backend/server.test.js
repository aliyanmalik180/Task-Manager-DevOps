const test = require("node:test");
const assert = require("node:assert/strict");

test("health route is defined in the API", async () => {
  // Lightweight CI smoke test that does not require MongoDB.
  const fs = require("node:fs");
  const source = fs.readFileSync(require.resolve("./server.js"), "utf8");
  assert.match(source, /app\.get\(["']\/health["']/);
  assert.match(source, /app\.get\(["']\/api\/tasks["']/);
});
