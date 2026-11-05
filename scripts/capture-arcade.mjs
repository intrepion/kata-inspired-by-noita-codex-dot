import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const inputs = {};
for (const name of ['index.html', 'game.js', 'style.css']) {
 const bytes = await readFile(name);
 const committed = execFileSync('git', ['show', `HEAD:${name}`]);
 if (!bytes.equals(committed)) throw new Error(`Commit gameplay input changes before capture: ${name}`);
 inputs[name] = hash(bytes);
}
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
const server = createServer(async (req, res) => {
 const name = req.url === '/' ? 'index.html' : req.url.slice(1);
 if (!(name in inputs)) {res.writeHead(404).end(); return;}
 res.setHeader('Content-Type', name.endsWith('.html') ? 'text/html' : name.endsWith('.css') ? 'text/css' : 'text/javascript');
 res.end(await readFile(name));
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch();
try {
 const viewport = {width:1200,height:900};
 const page = await browser.newPage({viewport, deviceScaleFactor:1,locale:'en-US',timezoneId:'UTC'});
 const errors=[]; page.on('pageerror', e=>errors.push(e.message));
 await page.clock.setFixedTime(new Date('2026-11-05T05:00:00Z'));
 await page.goto(baseUrl);
 await page.getByRole('button', {name:'BEGIN DESCENT'}).click();
 await page.locator('#overlay').waitFor({state:'hidden'});
 const box = await page.locator('#game').boundingBox();
 const aim = (x,y)=>page.mouse.move(box.x+x*box.width,box.y+y*box.height);
 const steps = ['Open the local static artifact over HTTP with a clean browser context at 1200×900, en-US, UTC.', 'Fix Date to 2026-11-05T05:00:00Z for the public game’s time-based cave seed; animation remains real-time.', 'Click BEGIN DESCENT.'];
 await page.keyboard.down('d'); await page.waitForTimeout(2200); await page.keyboard.up('d');
 await aim(.75,.20); await page.mouse.down(); await page.waitForTimeout(350);
 steps.push('Hold D for 2200 ms to walk through the upper passage; aim right and hold the mouse to cast for 350 ms.');
 const screenshots=[];
 await mkdir('arcade/capture-evidence',{recursive:true}); await mkdir('arcade/screenshots',{recursive:true});
 async function capture(number, alt) {
  if(errors.length) throw new Error(errors.join('\n'));
  const stem=`review-20261105-0${number}`;
  const sourcePath=`arcade/capture-evidence/${stem}.png`, path=`arcade/screenshots/${stem}.jpg`;
  const png=await page.screenshot({path:sourcePath});
  execFileSync('sips',['-s','format','jpeg','-s','formatOptions','88',sourcePath,'--out',path]);
  const capturedAt=new Date().toISOString().replace(/\.\d{3}Z$/,'Z');
  const captureRecordPath=`arcade/capture-evidence/${stem}.json`;
  const record={sourceCommit,inputs,capturedAt,baseUrl,tool:{name:'Playwright',version:require('playwright/package.json').version},browser:{name:'Chromium',version:browser.version()},viewport,deviceScaleFactor:1,steps:[...steps],imageConversion:'macOS sips JPEG quality 88; no crop, compositing or retouching.'};
  const raw=JSON.stringify(record,null,2)+'\n'; await writeFile(captureRecordPath,raw);
  screenshots.push({path,sha256:hash(await readFile(path)),alt,provenance:{kind:'local_gameplay_capture',sourcePath,sourceSha256:hash(png),captureCommit:sourceCommit,inputHashes:inputs,capturedAt,captureRecordPath,captureRecordSha256:hash(raw)}});
 }
 await capture(1,'Ember Below: casting a wand through the upper passage of a layered cave, with enemies, pickups and liquid chambers below.');
 await page.mouse.up(); await page.keyboard.down('d'); await page.waitForTimeout(1800); await page.keyboard.up('d');
 await page.keyboard.press('2'); await aim(.68,.38); await page.mouse.down(); await page.waitForTimeout(250); await page.mouse.up();
 await page.waitForTimeout(500);
 steps.push('Release the mouse, hold D for another 1800 ms toward the first descent, then select wand 2 and cast toward the lower-right for 250 ms; wait 500 ms.');
 await capture(2,'Ember Below: the second wand equipped while descending toward the first enemy encounter and water chamber.');
 await writeFile('arcade/manifest.json',JSON.stringify({schemaVersion:3,gameId:'kata-inspired-by-noita-codex-dot',playUrl:'https://intrepion.github.io/kata-inspired-by-noita-codex-dot/',screenshots},null,2)+'\n');
 console.log(`Captured ${screenshots.length} gameplay images from ${sourceCommit}`);
} finally {await browser.close(); server.close();}
