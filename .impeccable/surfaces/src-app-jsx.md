---
version: 1
slug: "src-app-jsx"
primary_target: "src/App.jsx"
related_targets: []
---

# App shell and tools

Scope: the whole app (shell + all eight tools). Mode: Operate.

Audience/job: active OGame players, desktop first, one quick answer mid-session, often pasted back into the game or Discord.
Constraints: keep every tool, formula, FR/EN parity and the informal voice. The user's main blocker is readability; the old UI felt cramped, hid the result at the bottom, buried inputs in help text and asked for the universe on every view.

## Direction contract

THESIS: Each tool hands down its verdict as a report: a dated, ruled document whose verdict is the first thing read and the thing pasted back into chat. It refuses the neon HUD card stack of the old UI and the generic SaaS dashboard.

OWN-WORLD: A night-blue telex desk. The ground is #0d1320, desk sheets step through #141b2a/#1a2234/#222b40, and the report sheet lies one step lighter on #172034 with a #1e2a42 head. The ink is a warm #ece8dd. One brass signal ink (#e0a43c) marks the verdict, the focus and the current tool. Every other hue is data, coloured by meaning: resource inks (metal, crystal, deut) on trade tiles, the amount field and the received lines, with each amount set in its resource ink; moonbreak odds in ok from 95%, loss under 50% and brass in between; seven status inks drawn as text, a 55% border and a 14% tint, never without an icon and a word. The heatmap ramp runs from night blue to sand. Rules are 1px; tables are ruled, with tabular mono numerals; status marks are rectangular stamps. Radius is 3px at most, with no glow, gradient or glass, and there is a single theme. Faces are Atkinson Hyperlegible Next and Mono.

STORY: The player sets the universe once in the index, opens a tool, adjusts compact inputs, reads the verdict without scrolling, and copies it.

FIRST VIEWPORT: A 248px index rail on the left holds the brand, the global universe and two groups of tools (calculators, universe data). The main area starts with a report header strip: tool name as h1, universe and timestamp at the right. Below it, the settings column (5/12) sits left and the report sheet (7/12, sticky) right, with the verdict set at 40px in brass mono.

FORM: Combat report / spy-report ledger, #1 on the ordered list (pick card), seed key 1a2270ec.

Signature interaction: when a figure changes, it re-inks: a brass underline sweeps across it once (clip-path, 450ms ease-out). Reduced motion turns it off.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
