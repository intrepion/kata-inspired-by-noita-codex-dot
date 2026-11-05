import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
test('Arcade includes at least two genuine, intact gameplay captures', async () => {
 const manifest=JSON.parse(await readFile('arcade/manifest.json'));
 assert.equal(manifest.schemaVersion,3);
 assert.equal(manifest.gameId,'kata-inspired-by-noita-codex-dot');
 assert.equal(manifest.playUrl,`https://intrepion.github.io/${manifest.gameId}/`);
 assert.ok(manifest.screenshots.length>=2,'Capture and review gameplay before publishing.');
 assert.equal(new Set(manifest.screenshots.map(i=>i.path)).size,manifest.screenshots.length);
 for(const image of manifest.screenshots){
  assert.match(image.path,/^arcade\/screenshots\/[a-z0-9-]+\.jpg$/);
  assert.ok(image.alt.trim());
  const jpg=await readFile(image.path); assert.equal(hash(jpg),image.sha256); assert.equal(jpg.subarray(0,2).toString('hex'),'ffd8');
  const p=image.provenance; assert.equal(p.kind,'local_gameplay_capture');
  assert.match(p.captureCommit,/^[a-f0-9]{40}$/);
  assert.match(p.sourcePath,/^arcade\/capture-evidence\/[a-z0-9-]+\.png$/);
  const png=await readFile(p.sourcePath); assert.equal(hash(png),p.sourceSha256); assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.match(p.captureRecordPath,/^arcade\/capture-evidence\/[a-z0-9-]+\.json$/);
  const raw=await readFile(p.captureRecordPath); assert.equal(hash(raw),p.captureRecordSha256);
  const record=JSON.parse(raw); assert.equal(record.sourceCommit,p.captureCommit); assert.deepEqual(record.inputs,p.inputHashes); assert.equal(record.capturedAt,p.capturedAt);
  assert.match(p.capturedAt,/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/); assert.ok(Number.isFinite(Date.parse(p.capturedAt)));
  assert.match(record.baseUrl,/^http:\/\/127\.0\.0\.1:\d+\/$/);
  assert.equal(record.tool.name,'Playwright'); assert.equal(record.tool.version,'1.61.0');
  assert.ok(record.browser.version); assert.ok(record.steps.length>=4);
  assert.deepEqual(Object.keys(p.inputHashes).sort(),['game.js','index.html','style.css']);
  for(const [path,digest] of Object.entries(p.inputHashes)) assert.equal(hash(await readFile(path)),digest,`${path} changed: recapture and visually review screenshots`);
 }
});
