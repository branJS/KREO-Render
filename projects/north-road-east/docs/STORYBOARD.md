# North Road East — Cinematic Storyboard (Portfolio Piece v1)

**Target deliverable:** 28-second hero film, two cuts: 16:9 hero (for KREO website + LinkedIn) and 9:16 vertical (for Instagram Reels / TikTok).

**Narrative:** Drawing → Building → Cinematic — three acts that prove KREO can take any developer's existing assets and turn them into a magazine-quality property reel.

**Music brief:** Single track, slow build, peaks at the spiral-stair reveal, 28-second arrangement. Cinematic ambient with a soft piano lead. Source from Artlist or Epidemic Sound (both have free demo tracks usable for portfolio purposes; otherwise Pixabay royalty-free).

---

## ACT 1 — THE DRAWING (0:00 – 0:07)

### Shot 1.1 — Cold open on the floor plan (0:00 – 0:02)
**Frame:** Tight crop on FP01 (Ground Floor Plan), specifically zooming in on the spiral staircase symbol on the east end. Black background fills the rest of the frame.
**Motion:** Slow zoom out, revealing the full ground floor plan over 2 seconds.
**Audio:** Music starts from silence, soft piano single notes.
**Why this opens:** Architects' drawings are inherently mysterious to non-architect viewers. Starting on a detail signals "this is technical, real, not AI-imagined."

### Shot 1.2 — Plan extrudes into 3D (0:02 – 0:05)
**Frame:** Floor plan begins to extrude upward, walls rising from the lines, materials filling in. Building gradually appears as if assembling itself from the plan.
**Motion:** Camera tilts up as building rises, camera angle shifts toward the angle of R03 (drone aerial).
**Audio:** Piano joined by ambient pad swelling.
**How built:** Kling 2.5 keyframe mode — start frame FP01, end frame R03. Prompt: "Architectural floor plan extruding into 3D building, walls and materials emerging, smooth time-lapse construction." This is **Gap 1 from the shot inventory**.

### Shot 1.3 — Building fully assembled, drone aerial (0:05 – 0:07)
**Frame:** R03 — the drone aerial showing the building in its full Plymouth context, surrounded by Victorian terraces.
**Motion:** Slow Ken Burns zoom-in (very subtle, ~5% zoom over 2 seconds) toward the building.
**Audio:** Music continues building, low brass/bass enters.
**How built:** Static R03 with DaVinci Ken Burns transform. No generation needed.

---

## ACT 2 — THE BUILDING (0:07 – 0:14)

### Shot 2.1 — Drone descent to street level (0:07 – 0:11)
**Frame:** Begins at R03 / R06 (drone aerial) and descends smoothly to R04 (golden hour street view).
**Motion:** Cinematic drone descent, slowing as it approaches street level. Camera transitions from looking down to looking at the building head-on.
**Audio:** Music continues, hint of percussion entering.
**How built:** Kling 2.5 keyframe mode — start frame R03, end frame R04. Prompt: "Cinematic drone descent from aerial view to street-level architectural composition, smooth deceleration, golden hour lighting." This is **Optional Gap 4** but I'd include it — it's a high-impact transition.

### Shot 2.2 — Hero golden hour (0:11 – 0:14)
**Frame:** R04 (golden hour street front).
**Motion:** Subtle Ken Burns push-in, ~3% zoom, slight pan right.
**Audio:** Music swells. Light traffic ambience added subtly underneath.
**How built:** Static R04 with DaVinci transform. No generation needed.
**Why this beat:** This is the developer's "approved" view. Establishes recognisability before we deviate.

---

## ACT 3 — THE CINEMATIC (0:14 – 0:28)

### Shot 3.1 — Time-lapse: golden → dusk → night, same angle (0:14 – 0:19)
**Frame:** Same camera position as R04. Sky and lighting transition through R04 → R05 (overcast as a soft middle if needed) → R02 (dusk) → R07 (night).
**Motion:** Static framing; only the lighting changes. Slight Ken Burns push-in continues from Shot 2.2.
**Audio:** Music drops to ambient, building tension. Slight wind ambience.
**How built:** DaVinci cross-dissolve between R04 → R02 → R07 (skip R05 unless we need a soft middle). Each crossfade ~1.5 seconds. Critical: confirm same camera position across these renders before edit. **Gap 3 from inventory** — no AI needed.

### Shot 3.2 — Camera orbit to rear (0:19 – 0:23)
**Frame:** Begins at R02 (dusk front). Camera orbits around the corner of the building toward the rear elevation. Ends at R09 (spiral staircase lit at night).
**Motion:** Cinematic orbit, ~90 degrees of camera rotation around the corner. Sky simultaneously deepens from dusk to night.
**Audio:** Music swells back, percussion returns, moment of anticipation.
**How built:** Kling 2.5 keyframe mode — start frame R02, end frame R09. Prompt: "Smooth cinematic camera orbit around the corner of a modern student accommodation building, dusk transitioning to night, sky deepening from purple to indigo." This is **Gap 2 from inventory**.

### Shot 3.3 — Spiral stair hero hold (0:23 – 0:26)
**Frame:** R09 — the spiral fire-escape fully lit at night.
**Motion:** Static hero shot, very subtle lens-breathe (1% zoom in/out) for life.
**Audio:** Music peaks. Subtle metallic ambient (faint creak of metal stairs in wind, very quiet).
**How built:** Static R09. No generation needed.
**Why this is the climax:** The marketing renders never showed this side. The spiral stair is the building's signature engineering element. This is the "wait, there was more all along" moment that makes the film memorable.

### Shot 3.4 — Pull back to hero context (0:26 – 0:28)
**Frame:** Cut to drone aerial at night. Pull back to show the entire building lit, surrounding terrace homes also lit (warm window glows scattered across Plymouth night).
**Motion:** Pull-back over 2 seconds.
**Audio:** Music resolves on a held chord. Gentle fade.
**How built:** Hybrid — start from R09, end at a generated night-aerial frame OR cross-dissolve to R03 + colour-graded to night via DaVinci. The simpler path: cross-dissolve from R09 to a Photoshopped night-version of R03 (push exposure down, add window glows). Ken Burns zoom out. **Could be a small Nano Banana Pro generation** if the colour-graded approach looks cheap.

### End frame — KREO logo + caption (0:28 – freeze)
**Frame:** Black with KREO yellow logo. Caption: *"Your building. Cinematic. In 24 hours. — kreo.studio"*
**Audio:** Final piano note resolves, then silence.

---

## What this proves to a prospective client

A developer watching this 28 seconds learns:
- **0:00-0:07** — KREO can work directly from architectural drawings (no special files needed)
- **0:07-0:14** — KREO produces cinema-quality views matching the developer's existing marketing standards
- **0:14-0:19** — KREO can show the building across multiple lighting conditions (huge value for marketing year-round)
- **0:19-0:26** — KREO captures angles the developer's static renders missed (the spiral stair is a perfect example — every building has a feature their original ArchViz studio under-emphasised)
- **0:26-0:28** — KREO understands cinematic narrative, not just rendering

The unspoken pitch: *if KREO can do this in 24 hours from existing assets, imagine what they'd do for a building still in design.*

---

## Production checklist (in order)

1. ✅ Building DNA documented
2. ✅ Shot inventory mapped
3. ✅ Storyboard locked
4. ⬜ Files saved to disk (Brandon)
5. ⬜ Verify hero-angle camera consistency across R02/R04/R05/R07
6. ⬜ Generate Gap 1 (floor plan extrusion) via Kling 2.5
7. ⬜ Generate Gap 2 (corner orbit) via Kling 2.5
8. ⬜ Generate Gap 4 (drone descent) via Kling 2.5
9. ⬜ Optional: Generate Shot 3.4 final pullback if cross-dissolve looks cheap
10. ⬜ Source music track (Artlist / Epidemic / Pixabay)
11. ⬜ Source ambient audio elements (Freesound / Pixabay)
12. ⬜ Assemble in DaVinci Resolve
13. ⬜ Colour grade across all shots for visual consistency
14. ⬜ Audio mix
15. ⬜ Export 16:9 hero
16. ⬜ Re-cut and export 9:16 vertical
17. ⬜ Watermark with KREO branding
18. ⬜ Publish

Total estimated production time once files are on disk: **2-3 hours active work**, plus rendering wait time on Kling generations (typically 30-60 seconds each for free tier).
