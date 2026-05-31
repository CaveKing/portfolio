// Push the working tree to a GitHub repo using the Git Data API (no git binary).
// Secrets are read from env only — nothing is written to disk or committed.
//
// Usage:
//   $env:GITHUB_TOKEN="..."; $env:GITHUB_REPO="owner/name"; node scripts/push-to-github.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || "main";
const MESSAGE =
  process.env.GIT_MESSAGE || "พอร์ทหุ้น (Portfolio): Next.js + Firebase app with realtime market page";

if (!TOKEN || !REPO) {
  console.error("Set GITHUB_TOKEN and GITHUB_REPO env vars.");
  process.exit(1);
}

const ROOT = process.cwd();
const EXCLUDE_DIRS = new Set([
  "node_modules", ".next", ".git", ".vercel", "coverage", "out", ".idea", ".vscode",
]);
const EXCLUDE_FILES = new Set([".env", ".env.local", ".server.log", "next-env.d.ts"]);

function isExcluded(rel) {
  const parts = rel.split(/[\\/]/);
  if (parts.some((p) => EXCLUDE_DIRS.has(p))) return true;
  const base = parts[parts.length - 1];
  if (EXCLUDE_FILES.has(base)) return true;
  if (base.endsWith(".tsbuildinfo")) return true;
  if (/\.env\..*local$/.test(base)) return true;
  return false;
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = relative(ROOT, full);
    if (isExcluded(rel)) continue;
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(rel.split(sep).join("/"));
  }
  return acc;
}

async function api(path, method = "GET", body) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "portinvest-pusher",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status} ${json.message || text}`);
  }
  return json;
}

async function pool(items, size, worker) {
  const results = [];
  let i = 0;
  async function run() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, run));
  return results;
}

const files = walk(ROOT);
console.log(`Collected ${files.length} files. Creating blobs...`);

const blobs = await pool(files, 6, async (path) => {
  const content = readFileSync(path).toString("base64");
  const blob = await api(`/repos/${REPO}/git/blobs`, "POST", { content, encoding: "base64" });
  return { path, mode: "100644", type: "blob", sha: blob.sha };
});

let parentSha = null;
try {
  const ref = await api(`/repos/${REPO}/git/ref/heads/${BRANCH}`);
  parentSha = ref.object.sha;
  console.log(`Existing branch ${BRANCH} @ ${parentSha.slice(0, 7)} (will be replaced)`);
} catch {
  console.log(`No existing ${BRANCH} branch — creating it.`);
}

console.log("Creating tree + commit...");
const tree = await api(`/repos/${REPO}/git/trees`, "POST", { tree: blobs });
const commit = await api(`/repos/${REPO}/git/commits`, "POST", {
  message: MESSAGE,
  tree: tree.sha,
  parents: parentSha ? [parentSha] : [],
});

if (parentSha) {
  await api(`/repos/${REPO}/git/refs/heads/${BRANCH}`, "PATCH", { sha: commit.sha, force: true });
} else {
  await api(`/repos/${REPO}/git/refs`, "POST", { ref: `refs/heads/${BRANCH}`, sha: commit.sha });
}

console.log(`Pushed ${files.length} files -> https://github.com/${REPO}/tree/${BRANCH} (commit ${commit.sha.slice(0, 7)})`);
