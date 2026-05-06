# KREO — North Road East Render Project — Agent Handover (v2)

**Last updated:** 2026-05-05, mid-render
**User:** Brandon Allen (IoN / KREO) — ionstudiosx@gmail.com
**Workspace:** `C:\Users\Brandon\Documents\KREO-Render\projects\north-road-east\`

---

## Project in one sentence

Brandon's making a public **portfolio piece** for KREO — a 28-second cinematic film of the student accommodation building he lives in (74 North Road East, Plymouth), generated locally on his GPU via ComfyUI + Wan 2.2, designed to beat TechHalla's pure-AI workflow on authenticity (because the building, the drawings, and the photographer all live there).

## Strategic angle (do not lose)

**Three-act reveal: Drawing → Reality → Cinematic.**
- Act 1: Bailey Partnership construction drawing extrudes into 3D
- Act 2: Real building (developer's official marketing renders + drone aerials)
- Act 3: AI-cinematic with day → golden hour → night transition + drone orbit + spiral-stair reveal

Caption hook: *"I live in this building. Here's how I'd sell it for £8,000."*

Pitch that lands: takes any developer's existing assets, turns them into magazine-quality property reels for ~£500 in 24 hours. Pre-construction visualisation is the highest-margin ArchViz segment (£3k–£15k traditional pricing). KREO undercuts that AND beats AI-generated competitors on authenticity.

## What's already built

**All in `KREO-Render\projects\north-road-east\`:**

| Path | Contents |
|---|---|
| `floor-plans/cleaned/` | 4 cleaned construction plans (ground + 3 upper floors) |
| `reference/marketing-renders/` | 11 developer renders, named R01–R11 (panel detail, drone NW, drone wider, hero front in golden/overcast/dusk-pink/dusk-blue/night, dusk-with-pedestrians, spiral-stair-night, alt-angle day, alt-angle dusk) |
| `docs/BUILDING_DNA.md` | Authoritative colour/material/composition reference — every prompt embeds its building description fragment |
| `docs/SHOT_INVENTORY.md` | Maps existing renders to shot beats; identifies the small generation gaps |
| `docs/STORYBOARD.md` | Full 28-second three-act sequence, shot-by-shot with timing/audio/motion notes |
| `docs/NANO_BANANA_PROMPTS.md` | Pre-written prompts (less relevant now since we pivoted to local Wan, but the building description fragment remains the source of truth) |
| `docs/CONTEXT_NOTES.md` | Plymouth context, sun-path data, address confirmation |
| `renders/animations/` | First-shot output destination |

## The pipeline (locked, tested, working)

| Stage | Tool | Status |
|---|---|---|
| Floor plan + photo cleanup | User-supplied developer renders | ✅ Done |
| 3D massing render | Skipped — developer's marketing renders cover all needed lighting/angles | ✅ Done |
| Day/golden/night keyframes | Skipped — R04, R05, R02, R08, R07 are all the same camera position with different lighting → free time-lapse via DaVinci crossfade | ✅ Identified |
| Animated shots | **Wan 2.2 via ComfyUI in Pinokio** | 🟡 In progress |
| Polish + edit | DaVinci Resolve free + Freesound/Pixabay audio | ⬜ Not started |

## Current technical state

**ComfyUI runtime:** Pinokio at `F:\pinokio\api\comfy.git\`
- Auto-loads on Pinokio "Start"
- Web UI at default port — accessible via the "Comfy" tab in Pinokio

**Models installed:**
- ✅ Wan 2.2 14B i2v (high+low noise fp8 scaled) + lightx2v 4-step LoRAs — used for first test
- ✅ Wan 2.2 ti2v 5B fp16 (unified text+image-to-video) — primary production model
- ✅ Wan 2.2 VAE (`wan2.2_vae.safetensors`)
- ✅ umt5_xxl text encoder (fp8 e4m3fn scaled)
- Earlier wan_2.1_vae also present (used by 14B workflow, leave it)

**Hardware ground truth:**
- NVIDIA RTX 5060, 12GB VRAM
- 80GB system RAM
- 14B at 832x480x121 frames = ~25 min/render with heavy offloading
- 5B at 1280x704x121 frames = OFFLOADS 4.3GB (too slow, gets interrupted)
- 5B at 832x480x121 frames = **fits cleanly in 12GB, no offloading** ← this is the production setting

## Where we left off (mid-action)

**A render is currently generating** — Brandon just hit Run on the 5B workflow at corrected 832×480 settings.

**Workflow:** "video_wan2_2_5B_t2v" tab in ComfyUI
**Template used:** "Wan 2.2 5B Video Generation"
**Configuration:**
- Diffusion model: wan2.2_ti2v_5B_fp16.safetensors (Use From Library)
- Load Image node: enabled via Ctrl+B (i2v mode)
- start_image: R03-drone-NW-golden.jpg
- Resolution: 832×480 (corrected from default 1280×704)
- Length: 121 frames (5 sec @ 24fps)
- Steps: 20, sampler uni_pc, cfg 5.0
- Positive prompt:
> Smooth cinematic drone descending toward a modern four-storey student accommodation building. The camera slowly lowers altitude, gently moving forward, revealing the salmon-pink, off-white, and charcoal cladding panels of the facade. Golden hour, warm sunlight, surrounding Plymouth terraced rooftops visible. Photoreal architectural film, smooth aerial motion, no shake.
- Negative prompt: Chinese standard Wan negative (untouched, leave as-is)

**Lessons learned this session:**
- Two earlier 5B attempts at 1280×704 took ~9 min each before being interrupted (too slow)
- Reducing resolution to 832×480 fixed the offload thrashing
- 14B test (Shot 2.2 — R04 push-in golden hour) generated successfully and Brandon called it "really good." Output sits at `F:\pinokio\api\comfy.git\app\output\video\Wan2.2_i2v_00001_.mp4` — needs to be copied to `KREO-Render\projects\north-road-east\renders\animations\shot-2.2-R04-pushin-take1.mp4` (Brandon hasn't done this yet — kept getting blocked by other priorities).

## Next steps (in order)

**Immediate (waiting for current render):**
1. When current render finishes, Brandon will say so. Save it to `renders/animations/shot-2.1-R03-drone-descent-take1.mp4`. Review it together — should be 4–6 min generation time at 832×480 on 5B.
2. ALSO copy/save the earlier 14B output (`Wan2.2_i2v_00001_.mp4`) which is still in the Pinokio output folder — never moved to project folder.

**After Shot 2.1 is in the can:**
3. **Shot 3.2 — corner orbit (Gap 2):** R08-dusk-blue-pedestrians as start, R09-spiral-stair-night as end. Switch to "Wan 2.2 5B Fun Inpaint" template (it supports start AND end frame conditioning). Prompt for "smooth cinematic camera orbit around the corner of the building, dusk transitioning to night." This is the climactic shot of the film.
4. **Shot 1.2 — floor plan extrusion (Gap 1):** Trickiest shot. Floor plan PNG as start, R03 drone aerial as target. Wan 2.2 5B may not handle this abstract transformation well — if it fails, fall back to a creative DaVinci edit using just zoom + dissolve between the floor plan and R03.

**Then assemble in DaVinci Resolve:**
5. Cross-dissolve R04→R02→R07 for the time-lapse beat in Act 3
6. Add Ken Burns zooms to static frames
7. Source ambient audio (Freesound + Pixabay royalty-free music)
8. Color grade for visual consistency
9. Export 16:9 hero + 9:16 vertical cut
10. Watermark with KREO branding

## Voice / collaboration approach

Brandon engages as a strategic peer. He likes:
- Honest opinions (with reasoning), not "here are options"
- Strategic framing first, then tactics
- Prose over bullet-list-heavy responses
- Specific timing, locations, file paths
- Being told *why* a choice beats alternatives

He is NOT looking for AI caveats. He moves fast. Don't slow him down with redundant clarifying questions when context already gives the answer.

## Critical pitfalls to avoid

- **Do NOT redo work that's already done.** The 9 marketing renders cover most lighting/angles — don't re-generate static frames.
- **Do NOT push 5B above 832×480.** It will offload and become unusable.
- **Do NOT lose the three-act narrative.** Drawing → Reality → Cinematic is the storytelling moat.
- **Brandon lives in the building.** That's the structural moat — uncopyable authenticity. Reinforce this in every output framing.

## Open task list

Run `TaskList` early in the new conversation. Most setup work is complete; the meaningful pending tasks are the actual generation runs (Tasks 18, 21, etc.) and final assembly (Tasks 7, 8, 9).

---

**Resume cleanly with:** *"Read `KREO-Render\projects\north-road-east\HANDOVER.md` and let's continue."*
