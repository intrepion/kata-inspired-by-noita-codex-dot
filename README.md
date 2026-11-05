# Ember Below

An original browser experiment inspired by Noita's simulated-material action roguelite. Descend through a seeded cave, levitate, aim wands, fight enemies and alter terrain. Sand falls; water and oil flow; fire spreads to wood and oil and is quenched by water. Spark ignites wood; bombs destroy terrain and can hurt their caster; frost freezes water into meltable ice. Acid dissolves rock into flammable gas; lava burns, melts ice and turns water into steam and rock. Digging and bouncing spells add more ways to interact with terrain. Each wand has four spell slots and its own mana, regeneration, cast delay and deck recharge. Starting wands draw in order; found wands shuffle their slots each recharge. Power and Bounce modify the next projectile; Double draws two subsequent projectiles, so their order and mana costs matter. An exhausted deck must recharge before it can be drawn again. Explore seeded switchback chambers, alternate shafts and side pockets to collect spells, replacement wands, water refills and dropped gold. Enemies occupy several depths. Terrain remains destructible, so spells can open shortcuts. Between depths a sanctuary lets you exchange owned spells, buy more with gold and choose one perk. Mana refills, levitation recharges on the ground, and death ends the run. Cross three generated depths, defeat the guardian, and enter the final portal to win. All artwork is code-drawn and original.

## Play locally

Run `python3 -m http.server 8000 --bind 127.0.0.1` and visit http://127.0.0.1:8000/. Move with A/D or arrows, levitate with W/up/space, aim and hold the mouse to cast, and switch wands with 1/2. Press F near an item to collect it or near a portal to descend; Q sprays limited water toward the pointer; R restarts after death or victory. Wand editing, a spell shop, and one perk choice are available in the paused sanctuary between depths. Leaving the sanctuary is final for that visit. Each portal restores up to 35 health and refills mana and levitation. Test with `npm test` (Node 20+).

[← Kata Arcade](https://intrepion.github.io/)

## Scope

This is an early prototype, **not a complete reproduction of Noita**. It has three small fixed-size procedural caves with a repeated switchback structure, two wand slots with simplified deck casting, seven spells and modifiers, a small spell reserve, a water flask, a simple shop and three perks, two basic enemy types and a stationary guardian. It lacks Noita's extensive biomes, large spell and wand pools, diverse potions, more extensive material chemistry, enemy variety, audio, and many other mechanics. Multicast and modifiers are simplified, and mana failure leaves the entire attempted cast in the deck. Wand replacement converts the old wand's spells into reserve rather than preserving the wand as an item; the shop has unlimited stock and gold pickups do not expire. Not every pixel or object is physically simulated. Canvas 2D is used because the source game's physics and presentation are two-dimensional.

## Research

[Nolla Games' official press kit](https://noitagame.com/press/) describes Noita's simulated pixels, procedural world, spells and permanent death. The [official release notes](https://www.noitagame.com/release_notes/) illustrate its broad spell, perk and material systems.

The [Noita developer log](https://devlog.noitagame.com/page/2) describes acid producing flammable gas and lava interactions that inspired these simplified reactions.

## Arcade gameplay screenshots

`arcade/manifest.json` owns the two reviewed gameplay screenshots shown on Kata Arcade. These are local HTTP captures of the static game, not screenshots of an asserted live deployment. Original browser PNGs and capture records live in `arcade/capture-evidence/`; JPEGs are compressed copies without retouching. Each record identifies the source commit, SHA-256 of every served gameplay input (`index.html`, `game.js`, `style.css`), actual capture time, browser version, viewport and public interactions.

To refresh on macOS: commit gameplay changes first, run `npm ci`, `npx playwright install chromium`, and `npm run capture:arcade`. Playwright is pinned to 1.61.0. The script serves only the static deployment inputs on localhost, starts a clean browser, fixes Date for the seeded cave and uses ordinary clicks, keys and mouse casts. Real-time animation means pixel-identical reruns are not promised. It preserves PNG pixels and uses macOS `sips` for JPEG encoding. Visually inspect both images before committing the generated manifest, records and assets. Update the capture filename date for a new review series.

`npm test` fails for missing images, broken evidence or hashes, and changed gameplay inputs, so later game changes require fresh reviewed captures. The existing deployment workflow runs these tests, stages only game inputs and `arcade/`, and publishes them together. After deployment, compare live manifest and asset hashes before refreshing the Arcade snapshot. A successful upload alone does not verify the live site.
