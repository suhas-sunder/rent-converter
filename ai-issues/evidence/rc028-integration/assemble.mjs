// Reproduce sequential Git merges without touching HEAD, branches, the normal
// index, or application files. Only unreferenced commit/tree/blob objects and
// this report are written. Run from the repository root with Node.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const directory = path.resolve('ai-issues/evidence/rc028-integration');
fs.mkdirSync(directory, { recursive: true });
const tempIndex = path.join(directory, '.temporary-assembly-index');
assert.ok(!fs.existsSync(tempIndex), 'Refuse to overwrite an existing assembly index');
const git = (args, input, env) => {
  const result = spawnSync('git', args, { encoding: 'utf8', input, env: { ...process.env, ...env }, maxBuffer: 16 * 1024 * 1024 });
  if (result.error) throw result.error;
  return result;
};
const must = (args, input, env) => {
  const r = git(args, input, env);
  assert.equal(r.status, 0, `git ${args.join(' ')}: ${r.stderr}`);
  return r.stdout.trim();
};
const refs = {
  urgent: 'b69768dc8c8c66342786ba9f39eb958676637b80',
  w01: 'e2a62955a58d30be90a646fd99a253ca2b30bde9',
  w02: '68bfad21aa48fb1425ac1a3ef695a37efc910d7c',
  w03: '5af2d234cd9a06b938c01271c2a6b740afd150e5',
  w04: '2483d5fbde07f5ec0ab74596e252dfa5075e9123',
  security: 'd6906eff00cc3efdbf1f833580a2fd96e8b9c53a',
};
const packageAt = ref => JSON.parse(must(['show', `${ref}:package.json`]));
const testsOf = pkg => {
  assert.ok(pkg.scripts.test.startsWith('node --test '));
  const tests = pkg.scripts.test.slice('node --test '.length).trim().split(/\s+/);
  assert.equal(new Set(tests).size, tests.length, 'A branch registers a test more than once');
  return tests;
};
const packages = Object.fromEntries(Object.entries(refs).map(([id, ref]) => [id, packageAt(ref)]));
const expectedTests = [...new Set(Object.values(packages).flatMap(testsOf))].sort();
const report = { checkedAtUtc: new Date().toISOString(), refs, workingHead: must(['rev-parse', 'HEAD']), mergeSteps: [], expectedTests };
let current = refs.urgent;
try {
  for (const [id, ref] of Object.entries(refs).slice(1)) {
    const merge = git(['merge-tree', '--write-tree', '--messages', '--name-only', current, ref]);
    assert.ok([0, 1].includes(merge.status), merge.stderr);
    const lines = merge.stdout.trimEnd().split('\n');
    let tree = lines[0];
    assert.match(tree, /^[a-f0-9]{40}$/);
    const blank = lines.indexOf('', 1);
    const conflicts = merge.status === 1 ? lines.slice(1, blank < 0 ? undefined : blank) : [];
    const step = { package: id, incoming: ref, parents: [current, ref], mergeExitCode: merge.status, conflicts, rawMergeOutput: merge.stdout.trim(), resolution: 'automatic Git three-way merge' };
    if (merge.status === 1) {
      assert.deepEqual(conflicts, ['package.json'], 'Only the known test-registration conflict may be resolved automatically');
      const ours = packageAt(current), theirs = packageAt(ref);
      const union = [...new Set([...testsOf(ours), ...testsOf(theirs)])].sort();
      const compareOurs = structuredClone(ours), compareTheirs = structuredClone(theirs);
      delete compareOurs.scripts.test; delete compareTheirs.scripts.test;
      assert.deepEqual(compareOurs, compareTheirs, 'Non-test package metadata differs; require manual review');
      ours.scripts.test = 'node --test ' + union.join(' ');
      const blob = must(['hash-object', '-w', '--stdin'], JSON.stringify(ours, null, 2) + '\n');
      const env = { GIT_INDEX_FILE: tempIndex };
      must(['read-tree', tree], undefined, env);
      must(['update-index', '--add', '--cacheinfo', `100644,${blob},package.json`], undefined, env);
      tree = must(['write-tree'], undefined, env);
      step.resolution = `Union of ${union.length} unique sorted test paths; all other package fields equal before resolution`;
    }
    current = must(['commit-tree', tree, '-p', current, '-p', ref], `Temporary independent ${id} assembly proof; no branch updated\n`);
    step.resultTree = tree;
    step.syntheticCommit = current;
    report.mergeSteps.push(step);
  }
  report.finalTree = must(['rev-parse', `${current}^{tree}`]);
  const finalPackage = packageAt(current);
  assert.deepEqual(testsOf(finalPackage).sort(), expectedTests);
  const workingPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert.deepEqual(workingPackage, finalPackage, 'Working application package differs from independently assembled package');
  report.packageFieldsMatch = true;
  const productionPath = p => /^(app|public)\//.test(p)
    || (p.startsWith('scripts/') && !p.startsWith('scripts/browser-qa/'))
    || ['package.json', 'package-lock.json', 'netlify.toml', 'react-router.config.ts', 'vite.config.ts', 'tsconfig.json'].includes(p);
  const entries = must(['ls-tree', '-r', current]).split('\n').map(line => {
    const match = /^(\d+) blob ([a-f0-9]{40})\t(.+)$/.exec(line);
    return match ? { mode: match[1], blob: match[2], path: match[3] } : null;
  }).filter(e => e && productionPath(e.path));
  const mismatches = [];
  for (const entry of entries) {
    if (!fs.existsSync(entry.path)) { mismatches.push({ path: entry.path, reason: 'missing working file' }); continue; }
    // --path applies repository attributes just as git add would, ignoring
    // harmless Windows line-ending differences without ignoring source changes.
    const workingBlob = must(['hash-object', `--path=${entry.path}`, entry.path]);
    if (workingBlob !== entry.blob) mismatches.push({ path: entry.path, expected: entry.blob, actual: workingBlob });
  }
  const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(directory, e.name)) : [path.join(directory, e.name).replaceAll('\\', '/')]);
  const expectedPaths = new Set(entries.map(e => e.path));
  for (const p of ['app', 'public', 'scripts'].flatMap(walk).filter(productionPath)) if (!expectedPaths.has(p)) mismatches.push({ path: p, reason: 'extra working production file' });
  report.checkedProductionFiles = entries.length;
  report.mismatches = mismatches;
  report.sourceMatches = mismatches.length === 0;
  report.finalRegisteredTests = testsOf(finalPackage);
  report.note = 'Application/public/build-config and application scripts compared; browser QA harness and documentation deliberately excluded. File hashes use Git attributes. Synthetic commits are unreferenced and no release/main branch or normal index was changed.';
  fs.writeFileSync(path.join(directory, 'assembly-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ finalTree: report.finalTree, comparedFiles: entries.length, tests: expectedTests.length, conflicts: report.mergeSteps.filter(s => s.conflicts.length).map(s => ({ package: s.package, paths: s.conflicts })), mismatches }, null, 2));
  assert.deepEqual(mismatches, [], 'Assembled production source does not match acceptance worktree');
} finally {
  if (fs.existsSync(tempIndex)) fs.unlinkSync(tempIndex);
}
