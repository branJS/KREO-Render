# Nano Banana Pro — Prompt Pack for North Road East

8 prepared prompts, each ready to paste into Gemini (gemini.google.com) once the floor plans and marketing renders are uploaded as conditioning.

## How to use this pack

1. Open Gemini. Confirm Nano Banana Pro / "Imagen" model is active (paid features may rate-limit on free; if so, switch to standard image gen and re-prompt with extra detail).
2. Upload all 6 reference files at once (4 cleaned floor plans + 2 marketing renders).
3. Paste the relevant prompt below. Generate. Iterate 2-3 times per shot, keeping the seed of the best variant for consistency across shots.
4. Save winners into `renders/keyframes/` named by shot number.

The **building description fragment** below is constant — every shot prompt embeds it. Edit it once if we discover something is wrong, and it propagates.

---

## Building description fragment (constant)

```
A four-storey modern student accommodation building. Asymmetric graphic colour-block facade composed of vertical bands of salmon-pink, off-white, and charcoal-grey rainscreen cladding panels. Dark grey brick base at ground floor. Anthracite-framed portrait-orientation slot windows with recessed reveals. Stone-clad boundary wall at the west end. Punched window openings only — NO curtain walling, NO balconies. Match the colour palette and panel composition exactly as shown in the uploaded reference renders.
```

---

## Shot 1 — Hero day (matches marketing render exactly)

```
[BUILDING DESCRIPTION FRAGMENT]

Camera: three-quarter view from the opposite west pavement looking east-northeast at the building. Eye-level of an adult standing on the pavement, approximately 35mm equivalent focal length. Building fills 80% of frame width.

Lighting: clear midday Plymouth UK weather. Soft directional sunlight from upper left, gentle ambient fill, slight overhead overcast haze. No harsh shadows.

Setting: residential UK street, dark tarmac road, grey concrete pavement, parked cars at 1/8 scale (one silver SUV, one dark hatchback). Telephone wires faintly visible above. Trees on the left side framing the boundary stone wall.

Style: photoreal architectural visualisation, sharp focus throughout, deep depth of field. Aspect ratio 16:9.

Match the uploaded daytime marketing render's framing as closely as possible — this is our anchor shot.
```

---

## Shot 2 — Hero golden hour (same camera, warm low sun)

```
[BUILDING DESCRIPTION FRAGMENT]

Camera: identical position and framing to Shot 1 — three-quarter view from the opposite west pavement looking east-northeast, 35mm equivalent.

Lighting: golden hour, sun approximately 10 degrees above horizon coming from the west (behind camera-left). Warm 3200K sunlight raking across the facade from left, casting long soft shadows toward the east. Salmon-pink panels glow saturated and warm; white panels pick up the gold cast; charcoal panels read with subtle warm rim light. Sky transitions from warm gold near horizon to soft cyan-blue at zenith.

Setting: same street, same vehicles. One pedestrian visible on far pavement.

Style: photoreal cinematic architectural film still, shallow-medium depth of field with focus on the building, slight golden lens flare top-left. Aspect ratio 16:9.
```

---

## Shot 3 — Hero blue hour (matches dusk marketing render)

```
[BUILDING DESCRIPTION FRAGMENT]

Camera: identical position and framing to Shots 1 and 2 — three-quarter view from the opposite west pavement looking east-northeast, 35mm equivalent.

Lighting: late blue hour. Sky deep magenta-violet at zenith grading to warm orange-pink at horizon. ~30% of windows softly lit warm 2700K — irregular pattern, occupied not staged. Entrance lobby glows warm pink-red through glass doors. Stone boundary wall uplit warmly from concealed ground lights at its base. Subtle specular highlights on cladding picking up the residual sky colour.

Setting: same street. Group of three pedestrians chatting on the foreground pavement (one in a light dress, one in a sleeveless top, one in shorts and t-shirt — casual conversation pose). One parked dark SUV with brake lights glowing. One distant moving car with headlight glare.

Style: photoreal luxury property dusk render, cinematic, deep saturation. Aspect ratio 16:9.

Match the uploaded dusk marketing render's lighting and atmosphere closely — this is our second anchor shot.
```

---

## Shot 4 — Hero full night (deeper than dusk, more lit windows)

```
[BUILDING DESCRIPTION FRAGMENT]

Camera: identical position and framing to Shots 1-3 — three-quarter view from the opposite west pavement looking east-northeast, 35mm equivalent.

Lighting: full night, ~1 hour after sunset. Sky deep navy-indigo, no horizon glow. ~50% of windows lit warm 2700K — denser irregular pattern reading as a fully-occupied building on a weeknight evening. Entrance lobby visible glowing warm. Stone wall uplighting clearly visible against the dark sky. Subtle moonlight or streetlight rim catching the top edge of the charcoal panels. One streetlamp visible casting warm sodium pool on the pavement.

Setting: same street, quiet — only one parked dark SUV, no pedestrians. Lit road surface from streetlamp.

Style: photoreal cinematic architectural film still, shallow depth of field with focus on the building, mild atmospheric haze near streetlamps. Aspect ratio 16:9.
```

---

## Shot 5 — 3/4 corner reveal (camera moves east to show east elevation)

```
[BUILDING DESCRIPTION FRAGMENT]

Camera: three-quarter angle from the south-east corner of the street, looking west-northwest at the east end of the building. Camera approximately 4m above ground (slight drone elevation). 28mm wide-angle equivalent focal length to capture both south facade and east return wall in one frame.

Lighting: golden hour transitioning to blue hour, sky in deep gradient. Same lighting language as Shot 2 transitioning toward Shot 3.

Setting: shows the eastern end of the building including the corner where the colour-block massing terminates. The pink lower box bookend on the east side is clearly visible. Foreground includes the corner pavement.

Style: photoreal cinematic. Aspect ratio 16:9.

NOTE: this shot is the bridge into the rear/spiral-stair reveal. It establishes the corner before we orbit around.
```

---

## Shot 6 — Rear spiral fire-escape feature (the surprise reveal)

```
[BUILDING DESCRIPTION FRAGMENT]

Camera: rear/yard side of the building, looking south-west at the east end. Camera approximately 2m above ground, ~4m back from the building. 35mm equivalent focal length. Building takes up 70% of frame width; the curved external spiral fire-escape staircase at the east end is the focal subject — fully visible spiralling from ground to roof level. The staircase is steel construction, painted dark anthracite, with metal mesh treads and a curved handrail.

Lighting: blue hour. Sky deep purple. Concealed up-lighting at the base of the spiral stair illuminates the underside of the curving treads warmly, creating dramatic spiral shadow rhythm on the wall behind. Selected windows lit warm.

Setting: rear yard / service area, plain pavement, refuse storage area visible to one side (with neat poly tank arrangement). Quiet, no people.

Style: photoreal cinematic, dramatic, slight wide-angle perspective emphasising the spiral curve. Aspect ratio 16:9.

NOTE: this is the "wait, there's more" moment of the portfolio film. The marketing renders never showed this side — that's our edge.
```

---

## Shot 7 — Drone high-angle establishing

```
[BUILDING DESCRIPTION FRAGMENT]

Camera: aerial drone view, approximately 25m above ground, 30 degrees down-tilt, 24mm wide-angle equivalent. Looking south-east. Frame shows the entire building from above with its full linear east-west extent, the third-floor stepback creating a visible flat-roof terrace on the west, and the spiral staircase visible as a small curved feature on the east end.

Lighting: clear morning, sun from east-south-east, low warm angle creating clear shadow on the north pavement.

Setting: shows the building in its block — surrounding Plymouth fabric of mixed terraced housing visible to the north and south, the road running east-west in front, the rear yard / parking area with cars to the north, surrounding rooftops creating a textured backdrop.

Style: photoreal architectural drone photography, sharp focus throughout, deep depth of field. Aspect ratio 16:9.

NOTE: this is the establishing shot — likely the opening frame of the cinematic film.
```

---

## Shot 8 — Panel composition macro detail

```
[BUILDING DESCRIPTION FRAGMENT]

Camera: tight crop on the central facade where pink, white, and charcoal panels meet. Frame shows approximately 2 storeys vertically and 4 panel widths horizontally. 50mm equivalent focal length, perpendicular to the facade. Sharp focus on panel edges and joint details.

Lighting: golden hour raking light from the left, low angle, casting micro-shadows that emphasise the panel rainscreen joints and the recessed window reveals.

Setting: pure facade detail — minimal sky visible at top edge, no street furniture in frame.

Style: photoreal architectural detail photography, sharp, slight contrast bias to emphasise panel joints. Aspect ratio 16:9.

NOTE: this is the texture insert shot for the cinematic film — used between wide angles to add intimate scale.
```

---

## Iteration discipline

For each shot:
1. Generate **3 variants** at the first prompt
2. Pick the closest match to the building DNA reference
3. Use the winning variant's seed + minor prompt edit for the next shot in the same lighting family — gives consistency
4. If a variant strays from the colour-block composition, re-prompt with stronger negative (e.g. "NOT symmetrical, NOT uniform facade")
5. Save every winning frame as `shot-XX-{descriptor}-{seed}.png` in `renders/keyframes/`

## Source-of-truth check

If any generation contradicts `BUILDING_DNA.md`, reject and re-prompt. Accuracy beats speed at this stage — these become the conditioning images for the video keyframes, and any drift here propagates through the whole pipeline.
