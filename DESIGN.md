---
name: OGame Tools
description: A fan-made OGame toolbox where every tool hands down its verdict as a ruled report on a graphite desk.
colors:
  ground: "#111418"
  sheet: "#181c22"
  sheet-2: "#1f242c"
  sheet-3: "#262c35"
  rule: "#2c333d"
  rule-strong: "#404956"
  ink: "#ece8dd"
  ink-bright: "#fffaf0"
  ink-2: "#b9bcc2"
  ink-3: "#8f96a0"
  signal: "#e0a43c"
  signal-soft: "rgba(224, 164, 60, 0.14)"
  signal-ink: "#1b1407"
  loss: "#ec8a6f"
  loss-soft: "rgba(236, 138, 111, 0.12)"
  ok: "#8fcb98"
  metal: "#c6cfd9"
  crystal: "#74c6ee"
  deut: "#5fd6a4"
  heat-0: "#1d2228"
  heat-1: "#343a42"
  heat-2: "#555b62"
  heat-3: "#81848a"
  heat-4: "#b4b3b0"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.08em"
  figure:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
rounded:
  cell: "1px"
  stamp: "2px"
  sheet: "3px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  sheet: "22px"
  xl: "24px"
  group: "28px"
  column: "32px"
  desk: "40px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.sheet}"
    padding: "8px 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.ink-bright}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.sheet}"
    padding: "8px 16px"
    height: "40px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.sheet}"
    padding: "4px 10px"
    height: "32px"
  button-quiet-hover:
    backgroundColor: "{colors.sheet-2}"
    textColor: "{colors.ink}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.sheet}"
    padding: "6px 12px"
    height: "36px"
  chip-active:
    backgroundColor: "{colors.sheet-3}"
    textColor: "{colors.ink}"
  field:
    backgroundColor: "{colors.sheet-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "0 14px"
    height: "52px"
  mini-field:
    backgroundColor: "{colors.sheet-2}"
    textColor: "{colors.ink}"
    typography: "{typography.figure}"
    rounded: "{rounded.sheet}"
    padding: "8px 10px"
    height: "40px"
  report-sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "22px"
  report-head:
    backgroundColor: "{colors.sheet-2}"
    typography: "{typography.title}"
    padding: "12px 22px"
  verdict-figure:
    textColor: "{colors.signal}"
    typography: "{typography.display}"
  status-stamp:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.stamp}"
    padding: "1px 6px"
  tool-stamp:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.figure}"
    rounded: "{rounded.stamp}"
    padding: "3px 10px"
  index-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    padding: "9px 10px 9px 14px"
  index-link-active:
    backgroundColor: "{colors.sheet-2}"
    textColor: "{colors.signal}"
  heatmap-cell:
    rounded: "{rounded.cell}"
    width: "12px"
    height: "18px"
---

# Design System: OGame Tools

## Overview

**Creative North Star: "Rapport de combat"**

Every tool hands down its verdict as a report: a dated, ruled document on a graphite telex desk at night. The lineage is the combat and espionage reports OGame players have pasted into forums and Discord since 2002. The verdict is the first thing read and the thing copied back into chat, so the whole system is arranged to make one figure unmistakable and everything around it quiet.

The world is flat paper on a dark desk. A sticky index rail holds the brand, the one universe picker and the tool list; the desk to its right shows one tool at a time, its settings column beside the report sheet. Surfaces are told apart by small steps of graphite and by 1px rules, never by colour or glow. Numbers that are read, compared or copied are set in a tabular face. One brass ink is the only accent, and its rarity is what makes the verdict land.

The build refuses the neon HUD card stack of the previous UI and the generic SaaS dashboard: no glow, no glass, no decorative gradient, no pills.

**Key Characteristics:**
- Graphite ground, three sheet steps, warm paper ink.
- One brass signal ink, reserved for a short list of meanings.
- 1px rules everywhere; ruled lists and tables instead of cards in cards.
- Tabular numerals, with a mono face for coordinates, counts, ticks and stamps.
- Corners of 3px at most; status marks are rectangular stamps.
- A single motion signature: a changed figure is re-inked by one brass stroke.

## Colors

A near-neutral graphite desk with a warm off-white ink and one brass accent; every other hue is data.

### Primary
- **Brass Signal** (signal): the verdict figures (trade amounts, moonbreak probability, expedition find, the moon-lock coordinate link), the focus outline, the caret and text selection, the open tool label in the index, the selected heatmap cell and the current point on the moonbreak curve. Nothing else.
- **Brass Wash** (signal-soft) and **Brass Ink** (signal-ink): the translucent tint reserved for brass surfaces, and the dark text set on a brass fill (text selection).

### Secondary
- **Ember Loss** (loss) with **Loss Wash** (loss-soft): losses and errors. Moonbreak loss-confidence stamps, API error sheets, the remove-attacker hover, banned and outlaw stamps.
- **Lichen Ok** (ok): success and "on". The copied state of the copy button, active-player stamps, enabled server settings.

### Tertiary (data inks)
- **Metal Grey** (metal), **Crystal Blue** (crystal), **Deuterium Green** (deut): the three OGame resources. They colour resource icons, slider fills and the selected resource tile's under-rule. Crystal also marks vacation stamps. They are data colours, never chrome.

### Neutral
- **Night Desk** (ground): the page ground behind the desk and inside inset panels (the universe box in the index).
- **Report Sheet** (sheet): the index rail, report sheets, ruled lists, the heatmap frame and help notes.
- **Sheet Two** (sheet-2): fields, report headers, hover fills, the open index row.
- **Sheet Three** (sheet-3): selected chips, selected resource tiles, the active language and the open list row.
- **Hairline** (rule): row dividers, ruled lists, the header rule under each tool.
- **Strong Rule** (rule-strong): control borders, sheet borders, dashed empty states, slider tracks, scrollbars.
- **Paper Ink** (ink): primary text, the primary button fill, the curve line and the brightest heatmap step. **Bright Paper** (ink-bright) is only the primary button's hover.
- **Ink Two** (ink-2): secondary text, labels, inactive controls.
- **Ink Three** (ink-3): metadata, placeholders, ticks, column heads.
- **Heat ramp** (heat-0 to heat-4, then ink): six steps of one graphite hue rising in value, so crowded systems on the galaxy map are the bright ones.

### Named Rules
**The Brass Reservation Rule.** Brass means "this is the answer, this has focus, or this is where you are." It marks the verdict figures, focus, the open tool, the selected heatmap cell and the curve's current point. Any other use dilutes the verdict.

**The Ink Selection Rule.** Selection that is not the open tool is shown with ink: an ink border or ink outline and a step-up sheet fill (chips, list rows, language toggle). The selected resource tile is the one exception, and it uses that resource's own data ink.

**The Data Ink Rule.** Metal, crystal and deuterium colours only ever describe a resource. They never colour a button, a heading or a frame.

## Typography

**Display Font:** Atkinson Hyperlegible Next (with Segoe UI, system-ui)
**Body Font:** Atkinson Hyperlegible Next
**Label/Mono Font:** Atkinson Hyperlegible Mono (with ui-monospace, SF Mono, Menlo)

**Character:** A legibility-first humanist sans carries every word and the verdict; its mono sibling sets the figures that get read across a row or copied, so a 0 never passes for an O and columns line up.

### Hierarchy
- **Display** (700, 40px, 1.1, -0.02em, tabular): the verdict figure in brass. 32px under 860px. The moon-lock verdict is the same idea in the mono face (600, 36px; 28px on mobile).
- **Headline** (700, 30px, 1.2, -0.02em): the tool name, the page h1. 24px under 860px. Detail views use a 26px name.
- **Title** (700, 17px, 1.2): settings group titles and report sheet titles.
- **Body** (400, 16px, 1.5): running text. Intros cap at 72ch, help notes at 68ch and set at 15px. Secondary text drops to 14 to 15px in ink-2.
- **Label** (700, 12 to 13px, 0.08em, uppercase): only the index group headings and the server-settings group heads.
- **Figure** (mono 400, tabular, 13 to 20px): coordinates, ranks, counts, axis ticks, table cells, server values, ship counts, the tool stamp. Field inputs set their value at 22px bold tabular in the sans.

### Named Rules
**The Tabular Figure Rule.** Any number a player compares or copies is tabular; numbers in rows, tables, ticks and stamps use the mono face.

**The One Loud Figure Rule.** Only the verdict reaches display size. Nothing else on a report competes with it.

## Layout

A two-column shell: the index rail (264px, sticky, full height, sheet colour, 1px rule on its right edge) and the desk (padding 28px 40px 56px). The desk is capped at 1280px and centred. Each tool opens with a header strip: the h1 and an "explain" text button on the left, the universe stamp on the right, a hairline under it.

Below the header, a tool grid lays settings beside the report. Calculators use a 5:6 split; data views use 7:5; settings-only tools stack in one column. The column gap is 32px. In split layouts the report is sticky at 24px from the top so the verdict stays in view while settings scroll. Settings groups are 28px apart, with 12px inside a group.

Responsive behaviour:
- Under 1180px, the tool grid collapses to one column and the report stops being sticky.
- Under 860px, the index dissolves into the page: brand and language on one row, the universe box, then the tool list as a sideways-scrolling strip of bordered links; the footer moves after the desk. Desk padding drops to 20px 16px 40px, sheet margins to 16px.
- Under 640px, the universe stamp is allowed to wrap.

Rhythm runs on a 4px base (4, 8, 12, 16, 24, 28, 32, 40), with the report sheet's 22px inset as its own step.

## Elevation & Depth

Depth comes from graphite steps and rules: ground, then sheet, then sheet-2 for headers and fields, then sheet-3 for selection. One shadow exists as material, the report sheet resting on the desk; it is a low, tight drop with no spread toward the viewer (`0 12px 32px -18px rgba(0,0,0,0.7)`). The slider thumb carries a 1px contact shadow so it reads above its track. Nothing glows.

### Shadow Vocabulary
- **Sheet on desk** (`box-shadow: 0 12px 32px -18px rgba(0, 0, 0, 0.7)`): the report sheet only.
- **Thumb contact** (`box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5)`): the range slider thumb only.

### Named Rules
**The Paper Not Light Rule.** Surfaces are separated by tone and 1px rules. No glow, no glass, no blur, and no gradient except the slider track fill that shows the value.

## Shapes

Square-cornered paper. Sheets, controls, chips and fields round to 3px, stamps to 2px, heatmap cells and legend swatches to 1px. The only circles are the brand logo, the resource dots and the slider thumb. Borders are 1px throughout: solid for controls and sheets, dashed for "add" ghost buttons and empty states. Disclosure arrows and select chevrons are drawn from CSS triangles, not glyphs. Icons are lucide-react line icons at 13 to 18px, plus three custom filled resource marks (ingot, gem, droplet).

## Components

### Buttons
Plain, inked, rectangular.
- **Shape:** 3px corners, 40px minimum height (52px when paired with a search field).
- **Primary:** a solid paper-ink fill with ground-colour text, 700 at 15px. Hover brightens the fill to bright paper.
- **Ghost:** transparent with a dashed strong rule, ink-2 text. Used for "add" actions (add an attacker).
- **Quiet:** transparent, strong-rule border, 32px, 14px regular. Hover or expanded lifts to sheet-2 with an ink-3 border.
- **Copy:** quiet-shaped, ink text; hover fills sheet-3. When copied, border and text turn ok-green.
- **Text button:** underlined ink-3 text with a strong-rule underline that darkens on hover or when expanded. Used for "explain this tool".
- **Focus:** a 2px brass outline at 2px offset, on every control.

### Chips
Segmented choices for rates, sorts, metrics and status filters.
- **Style:** transparent, strong-rule border, ink-2 text, 36px tall, 3px corners.
- **State:** hover darkens border to ink-3. Selected takes an ink border, a sheet-3 fill and bold ink text. Never brass.

### Cards / Containers (the report sheet)
- **Corner Style:** 3px.
- **Background:** sheet, with a sheet-2 header band ruled off by a strong rule.
- **Shadow Strategy:** the single "sheet on desk" shadow.
- **Border:** 1px strong rule.
- **Internal Padding:** 22px sides, 16px between blocks, 20px under the header (16px on mobile).
- **Content:** verdict lines separated by hairlines, each with a resource name on the left and the brass figure on the right; a "for" line under a hairline restates the input.

### Inputs / Fields
- **Field (one line):** label on the left in ink-2, value right-aligned at 22px bold tabular, 52px tall, sheet-2 fill, strong-rule border. Search fields align left at 16px.
- **Mini field:** a 13px ink-3 label above a 40px mono input or select on sheet-2.
- **Focus:** the border turns brass; no glow.
- **Slider:** a 4px track filled up to the value in the resource's ink (or ink-2), the rest in strong rule; an ink thumb with a ground-colour ring.
- **Error:** an API error is a sheet with a loss border and a loss wash.

### Navigation
- **Index:** two groups (calculators, universe data), each under an uppercase label heading. Links are ruled rows at 15px in ink-2; hover fills sheet-2. The open tool is bold brass on sheet-2.
- **Mobile:** the rows become bordered 3px tabs in a sideways strip; the open tool keeps a brass border.
- **Language toggle:** a joined pair of buttons inside one strong-rule frame; the active language is ink on sheet-3.

### Status Stamps
Rectangular, ruled, never pills: 2px corners, 1px border, 12px bold text with a 13px lucide icon. The border is a half-strength wash of the text colour: ok for active, crystal for vacation, loss for banned or outlaw. The tool header carries a larger mono stamp naming the universe and data age.

### Ruled Lists and Tables
Players, alliances, planets, ships, waves and server settings are all ruled lists: rows with 1px hairlines, a label in ink-2 on the left, a tabular value on the right. In the players and alliances lists, an open row takes sheet-3 with an inset ink-3 outline while the other rows dim to ink-2.

### Galaxy Heatmap
A grid of 12 by 18px cells (2px gap, 1px corners) on a ruled sheet, with a sticky mono row label. Cell value runs up the graphite-to-ink heat ramp. Hover draws a 1px ink border; the selected cell is filled and outlined in brass.

### Moonbreak Curve
An SVG chart on hairline gridlines with mono 9px ticks. The curve is a 1.75px paper-ink line, the target is a dashed strong rule, and the current point is a brass dot ringed in sheet colour with a brass mono label.

### Re-ink (signature motion)
When a verdict figure changes, a 2px brass stroke sweeps under it from left to right and fades (scaleX, 0.9s, `cubic-bezier(0.16, 1, 0.3, 1)`). Reduced motion removes it. All other state changes are 0.15s colour and border transitions.

## Do's and Don'ts

### Do:
- **Do** keep brass to the verdict figures, focus, the open tool, the selected heatmap cell and the curve's current point.
- **Do** show any other selection with an ink border or outline and a step-up sheet fill (sheet-2 for hover, sheet-3 for selected).
- **Do** separate surfaces with 1px rules and graphite steps; rule lists and tables instead of nesting cards.
- **Do** set compared or copied numbers tabular, and in the mono face when they sit in rows, tables, ticks or stamps.
- **Do** make status marks rectangular stamps with 2px corners and a 1px border.
- **Do** colour the galaxy heatmap with the single graphite-to-ink ramp (heat-0 to heat-4, then ink).
- **Do** keep metal, crystal and deuterium inks on resource data only.
- **Do** keep the report beside the settings and sticky on wide screens so the verdict is read without scrolling.

### Don't:
- **Don't** use glows, glass, blur or decorative gradients; the slider's value fill is the only gradient.
- **Don't** add coloured side stripes to cards, notes or rows.
- **Don't** round anything past 3px, and don't make status marks into pills.
- **Don't** add a second accent colour, or use brass for decoration, hover flourishes or headings.
- **Don't** set any figure other than the verdict at display size.
- **Don't** add shadows beyond the report sheet's single drop shadow and the slider thumb's contact shadow.
