# North Road East — Building DNA Reference

Source: extracted from Bailey Partnership's marketing renders (one daytime, one dusk) and the four construction floor plans.
Purpose: authoritative style guide for every downstream AI prompt and ComfyUI keyframe. Match these specs and the cinematic version reads as the *real* building.

## 1. Massing summary

- 4 storeys, linear east-west block, ~32m long
- Ground floor recedes slightly; floors 1-3 face the street as the main facade
- Two stepback moves: a slight setback on the third floor (creating flat-roof terraces on the west end) and a stepped massing on the east end where a tower-like volume reads taller
- Ground-floor entrance set within the dark brick base, recessed door
- Boundary stone wall (~1.8m high) on the west side at street level
- Rear/yard side: external **curved spiral fire-escape** at the east end (NOT visible from the street)

## 2. Material palette (reading off the marketing renders)

### Cladding panels — the building's hero material
Composite/aluminium rainscreen panels, three colours used in graphic colour-block composition:

| Material | Description | Approximate hex |
|---|---|---|
| Salmon-pink panel | Warm dusty pink, slight grey undertone, matt finish | `#C2867E` (day) / cooler in shadow |
| White panel | Off-white with cool grey undertone, matt finish | `#E8E5DD` |
| Charcoal panel | Deep cool grey, near-black, matt finish | `#3D3F42` |

Panels are arranged in **vertical bands** that segment the long facade into ~5 visual zones, which prevents the building reading as monotonous. Edge-to-edge alignment, no gaps; flush rainscreen detail.

### Brick base
Dark stretcher-bond brickwork wraps the entire ground floor including the entrance recess.
Colour: `#3A3936` (dark grey-charcoal, slightly warmer than the panel charcoal).

### Stone boundary wall
Random rubble local Devonian stone (likely Plymouth limestone or grey slate aggregate) at the west boundary, capped with a darker coping stone.
Colour: warm mid-grey, mixed `#7C7268` to `#5B5550` reads.

### Windows
- Aluminium frame, anthracite/black finish (`#2A2A2A`)
- Vertical slot proportion (portrait), ~2:1 ratio
- Regular grid placement, 4 windows per unit on south elevation
- Some larger windows on the third-floor stepback area (probably the Type-3 living/dining units)
- Recessed reveals — frames sit ~50mm back from the cladding face

### Other elements
- Coping/parapet: dark anthracite metal trim
- Soffit at recessed entrance: charcoal aluminium
- Entrance door: glazed with anthracite frame
- Pavement: standard UK grey concrete slabs
- Street: tarmac with painted parking line

## 3. Compositional reading (left to right, street-facing)

The graphic colour-block facade has these zones:

1. **Stone boundary wall** — west bookend, ground level only
2. **White zone** — full-height white panel volume, three storeys, slight stepback at top
3. **Pink central column** — narrower vertical zone of salmon-pink panels, runs full height
4. **White zone** — wider panel field, with the pink continuing in a vertical strip
5. **Charcoal tower volume** — the tallest-reading element on the right side, steps slightly forward
6. **Pink lower box** — east bookend, smaller and lower than the rest

This composition is the building's signature. **Do not let AI generation flatten it into a uniform box.** Every prompt should emphasise "graphic colour-block facade with vertical material bands" or it'll regress to monotonous student-housing AI default.

## 4. Lighting reads (from the dusk marketing render)

The dusk render uses a deliberate luxury-property treatment we should match for our golden-hour and blue-hour keyframes:

- **Sky:** deep magenta-violet at zenith grading to warm orange near horizon
- **Window light pattern:** ~30% of windows lit (warm 2700-3000K LEDs), arranged irregularly so it reads as occupied not staged
- **Entrance:** warm pink-red interior glow visible through glass — internal accent lighting
- **Stone wall:** uplit warmly from below (small ground-recessed lights at the base)
- **Ground-floor commons:** visibly lit, warm tone bleeding out onto pavement
- **Specular highlights:** subtle on the cladding panels — they catch the residual sky colour, pink panels read more violet, white panels pick up sky pink

For **full night** (further than dusk) we'd push the sky deeper, increase the lit-window count slightly, and introduce a subtle moon/streetlight rim on the panel edges.

For **golden hour** (earlier than dusk) the sky becomes warm orange-gold, the salmon-pink panels glow saturated, and shadow direction is low-angle from west.

## 5. Camera grammar (what the marketing renders use, and what we'll use)

The two marketing renders use the same camera setup:
- Slightly elevated viewpoint (~2m above ground, eye-level of someone tall on the opposite pavement)
- 35mm equivalent focal length
- Three-quarter view from the west side of the street, looking east-northeast
- Building takes up ~80% of frame width
- Sky and foreground each take ~15% of vertical
- Cars and pedestrians at 1/8 scale for human reference

For our cinematic version we'll **start** from this same hero composition (so it's recognisable / matches the developer's marketing) and then deviate to angles they couldn't capture in still frames.

## 6. What the AI will get wrong if we don't fight it

Based on common Nano Banana Pro / Flux failure modes for student accommodation generation, expect to actively prompt against:

- **Generic balconies** — this building has none on the street facade. Add "no balconies" to negative.
- **Symmetrical facade** — student housing AI defaults to mirrored composition. Our building is asymmetric. Stress "asymmetric colour-block massing" and reference the marketing renders.
- **Generic UK terrace context** — AI will surround the building with Victorian terraces if not directed. Plymouth context is mixed but we should provide actual streetview reference.
- **Wrong window proportions** — AI tends to make windows squarer/wider than the actual portrait slots.
- **Glass curtain walls** — AI defaults student housing to glass-heavy. Ours is panel-heavy with recessed punched windows. Stress "punched window openings, no curtain walling".

## 7. Authoritative prompt fragment (paste into every shot prompt)

```
A four-storey modern student accommodation building, asymmetric graphic colour-block facade composed of vertical bands of salmon-pink, off-white, and charcoal-grey rainscreen cladding panels. Dark grey brick base at ground floor. Anthracite-framed portrait-orientation slot windows, recessed reveals. Stone-clad boundary wall at the west end. Punched window openings, NO curtain walling, NO balconies. Plymouth UK setting, residential street context.
```

Use this verbatim as the building description in every prompt; only the camera/lighting/scene wrapper changes per shot.

---

*This doc is the source of truth. If any prompt or generation contradicts this, the prompt is wrong.*
