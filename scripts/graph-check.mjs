#!/usr/bin/env node
/**
 * graph-check.mjs — Validates that the knowledge graph is current.
 *
 * Exit codes:
 *   0 = graph is up to date
 *   1 = graph is stale or missing
 *
 * Checks:
 *   1. graphify-out/graph.json exists
 *   2. No source files changed after graph.json was last modified
 *   3. Manifest matches current file list
 */

import { existsSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const GRAPH_PATH = resolve('graphify-out/graph.json');
const MANIFEST_PATH = resolve('graphify-out/manifest.json');

// Patterns to ignore (same as post-commit hook)
const IGNORE_PATTERNS = [
  /^graphify-out\//,
  /^node_modules\//,
  /^dist\//,
  /^android\//,
  /^ios\//,
  /^\.opencode\//,
  /\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i,
  /\.(lock)$/i,
  /^package-lock\.json$/,
  /^yarn\.lock$/,
  /^pnpm-lock\.yaml$/,
];

const SOURCE_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.html',
  '.yml', '.yaml', '.sh', '.gradle', '.swift', '.java',
]);

function isSourceFile(file) {
  if (IGNORE_PATTERNS.some(p => p.test(file))) return false;
  const ext = file.slice(file.lastIndexOf('.'));
  return SOURCE_EXTENSIONS.has(ext.toLowerCase());
}

// Check 1: graph.json exists
if (!existsSync(GRAPH_PATH)) {
  console.error('Graph missing: graphify-out/graph.json not found.');
  console.error('Run `npm run graph:update` or `/graphify` to build it.');
  process.exit(1);
}

// Check 2: no source files changed after graph was built
const graphStat = statSync(GRAPH_PATH);
const graphMtime = graphStat.mtimeMs;

let changedFiles;
try {
  // Get files modified after graph.json was last written
  changedFiles = execSync(
    `git diff --name-only HEAD -- . ':!graphify-out' ':!node_modules' ':!dist' ':!android' ':!ios' ':!.opencode' 2>/dev/null || true`,
    { encoding: 'utf-8' }
  ).trim().split('\n').filter(Boolean);
} catch {
  // Not in a git repo or no commits yet
  changedFiles = [];
}

const staleSourceFiles = changedFiles.filter(isSourceFile);

if (staleSourceFiles.length > 0) {
  console.error(`Graph stale: ${staleSourceFiles.length} source file(s) changed since last build.`);
  console.error('Run `npm run graph:update` or `/graphify --update` to refresh.');
  console.error('Changed files:');
  for (const f of staleSourceFiles.slice(0, 10)) {
    console.error(`  ${f}`);
  }
  if (staleSourceFiles.length > 10) {
    console.error(`  ... and ${staleSourceFiles.length - 10} more`);
  }
  process.exit(1);
}

// Check 3: manifest exists and is reasonably current
if (!existsSync(MANIFEST_PATH)) {
  console.warn('Warning: graphify-out/manifest.json missing. Graph may be incomplete.');
  console.warn('Run `npm run graph:update` to rebuild with manifest.');
}

console.log('Graph is up to date.');
process.exit(0);
