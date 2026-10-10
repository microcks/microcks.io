const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const indexPath = path.join(__dirname, "..", "public", "index.json");
const entries = JSON.parse(fs.readFileSync(indexPath, "utf8"));

assert.ok(Array.isArray(entries), "Search index must be a JSON array");

const indexedPaths = new Set(
  entries.map((entry) => new URL(entry.url).pathname.replace(/\/+$/, "")),
);
const requiredPaths = [
  "/blog/microcks-1.10.0-release",
  "/documentation/tutorials/getting-started-tests",
];
const missingPaths = requiredPaths.filter((url) => !indexedPaths.has(url));

assert.deepEqual(
  missingPaths,
  [],
  `Search index is missing representative URLs: ${missingPaths.join(", ")}`,
);

console.log(
  `Search index is valid and contains ${entries.length} entries, including Blog and Documentation URLs.`,
);
