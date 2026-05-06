# Shot Inventory & Generation Gap Analysis

We now have 9 developer marketing renders + 4 cleaned floor plans = 13 reference assets. This document maps them to the cinematic sequence, identifies what's missing, and turns the project from "generate everything" into "animate what we have."

## The 9 anchor renders (catalogued)

Suggested filenames once Brandon saves them to `reference/marketing-renders/`:

| # | Suggested filename | Description | Useful as |
|---|---|---|---|
| R01 | `01-panel-detail-golden.png` | Tight crop, panels lit by warm afternoon sun, sharp detail | Texture insert / Act 3 detail beat |
| R02 | `02-dusk-front-angled.png` | Dusk view, alternate angle showing eastern volume + entrance | Mid-dusk anchor |
| R03 | `03-drone-aerial-northwest.png` | Drone shot from NW showing rooftop terrace + Plymouth context | Act 2 establishing |
| R04 | `04-golden-hour-streetfront.png` | Front facade golden hour, parked car, full street | Hero golden hour |
| R05 | `05-overcast-streetfront.png` | Same hero angle, soft overcast light | Intermediate lighting |
| R06 | `06-drone-aerial-southeast.png` | Drone from SE showing spiral stair + rear context | Act 2 reveal angle |
| R07 | `07-night-streetfront.png` | Front facade full night, streetlamp, lit interior glow | Hero night |
| R08 | `08-dusk-pedestrians.png` | Dusk hero with three pedestrians foreground | Lifestyle anchor |
| R09 | `09-spiral-stair-night.png` | Spiral fire-escape lit dramatically against purple dusk sky | Act 3 money shot |

Plus 4 cleaned floor plans (FP01-FP04) for Act 1.

## What's actually missing (the small gap)

Reviewing the cinematic three-act plan against the inventory, only these frames still need to be generated/animated:

### Gap 1 — Floor plan animated extrusion (Act 1)
**Need:** A short sequence that shows the floor plan transforming into the 3D building.
**How to build it:** Use **ComfyUI + Flux** with multi-image conditioning (cleaned floor plan + R03 drone aerial as targets) to generate ~4 intermediate frames showing the plan extruding into massing. Then **Wan 2.2 image-to-video** interpolates the smooth transition.
**Or simpler:** Use **Kling 2.5's keyframe-to-keyframe** mode with FP01 as start frame and R03 as end frame, prompt "architectural floor plan extruding upward into 3D building with materials filling in." Free tier.

### Gap 2 — Camera orbit between street view and rear/spiral-stair view (Act 3)
**Need:** A motion sequence that pans from R02 (dusk front) around the corner to R09 (spiral stair lit at night).
**How to build it:** **Kling 2.5 keyframe mode** — R02 as start frame, R09 as end frame, prompt "smooth cinematic camera orbit around the building corner, moving from front facade to rear elevation, dusk transitioning to deeper night."

### Gap 3 — Time-lapse between lighting states (Act 3)
**Need:** Smooth transition from R04 (golden hour) → R02 (dusk) → R07 (night) at the same camera angle.
**How to build it:** Same camera framing exists in R04, R05, R02, R07 — already a time-lapse if we crossfade them. **DaVinci Resolve cross-dissolve transitions** between the four images plus subtle Ken Burns zoom-in handles this without any AI generation. No video model needed.

### Optional Gap 4 — Drone descent flythrough
**Need:** Cinematic descent from R03 / R06 aerial down to R04 street level.
**How to build it:** **Kling 2.5 keyframe mode** — R03 as start frame, R04 as end frame, prompt "cinematic drone descent from aerial view to street-level architectural composition, smooth deceleration."

## Effort comparison

**Old plan:** 8 fresh Nano Banana Pro generations + 5 Wan 2.2 animations + edit = ~5-7 hours
**New plan:** 0-2 Nano Banana Pro generations + 3 Kling 2.5 keyframe animations + 1 DaVinci crossfade sequence + edit = ~2-3 hours

We just halved the work and quadrupled the accuracy by leveraging what the developer already paid for.

## What this means for ComfyUI / local GPU

In the original plan, ComfyUI was central for relighting. With these 9 anchors covering every lighting state we need, **ComfyUI's role shrinks to optional polish work** — colour matching across the keyframes if Kling's output has hue drift, or upscaling. That frees Brandon's GPU time for the genuinely novel frames in Gap 1 (floor plan extrusion) where local control matters.

## Risks / things to verify when files are on disk

- Confirm the four hero-angle renders (R02, R04, R05, R07, R08) are all from the *exact* same camera position. If they are, the time-lapse crossfade in Gap 3 just works. If they're slightly different, we'll need a homography warp in DaVinci or to regenerate one to match.
- Confirm the dusk and night renders use the same window-light pattern. If the lit-window pattern shifts between renders, the time-lapse will look wrong (windows popping in/out). If it does shift, we either masking-fix in Photoshop or accept that the eye won't catch it at video speed.

These are 5-minute checks once the files are saved.
