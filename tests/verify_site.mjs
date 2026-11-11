import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const htmlPath = path.join(rootDir, "index.html");
const cssPath = path.join(rootDir, "style.css");

assert.ok(fs.existsSync(htmlPath), "index.html must exist");
assert.ok(fs.existsSync(cssPath), "style.css must exist");

const html = fs.readFileSync(htmlPath, "utf8");
assert.match(html, /<!DOCTYPE html>/i, "index.html must declare HTML5 doctype");
assert.match(html, /<\/html>/i, "index.html must close root <html> element");

const refs = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)]
  .map((m) => m[1])
  .filter((ref) => !ref.startsWith("http://") && !ref.startsWith("https://") && !ref.startsWith("#"));

for (const ref of refs) {
  const rel = decodeURIComponent(ref.split(/[?#]/)[0]);
  const target = path.resolve(rootDir, rel);
  assert.ok(fs.existsSync(target), `Missing local reference: ${ref}`);
}

console.log(`Verified DravidProject HTML, CSS, and ${refs.length} local reference(s).`);
