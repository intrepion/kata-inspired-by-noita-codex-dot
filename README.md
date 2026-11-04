# Ember Below

An original browser experiment inspired by Noita's simulated-material action roguelite. Descend through a seeded cave, levitate, aim wands, fight enemies and alter terrain. Sand falls; water and oil flow; fire spreads to wood and oil and is quenched by water. Spark ignites wood; bombs destroy terrain; frost freezes water. Each wand has four ordered slots: Power and Double modify the next projectile. Explore to collect spells, replacement wands, water refills and dropped gold. Between depths a sanctuary lets you exchange owned spells, buy more with gold and choose one perk. Mana refills, levitation recharges on the ground, and death ends the run. Cross three generated depths, defeat the guardian, and enter the final portal to win. All artwork is code-drawn and original.

## Play locally

Run `python3 -m http.server 8000 --bind 127.0.0.1` and visit http://127.0.0.1:8000/. Move with A/D or arrows, levitate with W/up/space, aim and hold the mouse to cast, and switch wands with 1/2. Press F near an item to collect it or near a portal to descend; Q sprays limited water toward the pointer; R restarts after death or victory. Wand editing, a spell shop, and one perk choice are available in the paused sanctuary between depths. Leaving the sanctuary is final for that visit. Each portal restores up to 35 health and refills mana and levitation. Test with `npm test` (Node 20+).

[← Kata Arcade](https://intrepion.github.io/)

## Scope

This is an early prototype, **not a complete reproduction of Noita**. It has three small variations of a fixed-size procedural cave, two wand slots, five spells and modifiers, a small spell reserve, a water flask, a simple shop and three perks, two basic enemy types and a stationary guardian. It lacks Noita's extensive biomes, large spell and wand pools, diverse potions, detailed material chemistry, enemy variety, audio, and many other mechanics. Wand replacement converts the old wand's spells into reserve rather than preserving the wand as an item; the shop has unlimited stock and gold pickups do not expire. Not every pixel or object is physically simulated. Canvas 2D is used because the source game's physics and presentation are two-dimensional.

## Research

[Nolla Games' official press kit](https://noitagame.com/press/) describes Noita's simulated pixels, procedural world, spells and permanent death. The [official release notes](https://www.noitagame.com/release_notes/) illustrate its broad spell, perk and material systems.
