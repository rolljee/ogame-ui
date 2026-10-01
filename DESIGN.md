---
name: OGame Tools
description: A fan-made OGame toolbox where every tool hands down its verdict as a ruled report on a night-blue desk.
colors:
  ground: "#0d1320"
  sheet: "#141b2a"
  sheet-2: "#1a2234"
  sheet-3: "#222b40"
  rule: "#283249"
  rule-strong: "#3b4760"
  report: "#172034"
  report-2: "#1e2a42"
  report-rule: "#2b3753"
  ink: "#ece8dd"
  ink-bright: "#fffaf0"
  ink-2: "#bcc1cc"
  ink-3: "#8e97aa"
  signal: "#e0a43c"
  signal-soft: "rgba(224, 164, 60, 0.14)"
  signal-ink: "#1b1407"
  loss: "#ec8a6f"
  loss-soft: "rgba(236, 138, 111, 0.12)"
  ok: "#8fcb98"
  metal: "#c6cfd9"
  crystal: "#74c6ee"
  deut: "#5fd6a4"
  st-active: "#7fd492"
  st-inactive: "#f4a582"
  st-long-inactive: "#c9917a"
  st-vacation: "#7cb8ff"
  st-banned: "#ff6b6b"
  st-outlaw: "#c49bff"
  st-admin: "#5fd4cf"
  heat-0: "#172034"
  heat-1: "#304068"
  heat-2: "#4b5e90"
  heat-3: "#7186b4"
  heat-4: "#b1bcd6"
  heat-5: "#f2ede0"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  display-compact:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  verdict-mono:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "36px"
    fontWeight: 600
    fontFeature: "tnum"
  verdict-mono-compact:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "28px"
    fontWeight: 600
    fontFeature: "tnum"
  headline:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline-detail:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline-compact:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  field-value:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    fontFeature: "tnum"
  brand:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    letterSpacing: "-0.01em"
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
  body-sm:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.08em"
  figure-lg:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "20px"
    fontWeight: 400
    fontFeature: "tnum"
  figure:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  tick:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 400
    fontFeature: "tnum"
  tick-label:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "10px"
    fontWeight: 600
    fontFeature: "tnum"
  tick-sm:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "9px"
    fontWeight: 400
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
    typography: "{typography.field-value}"
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
    backgroundColor: "{colors.report}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "22px"
  report-head:
    backgroundColor: "{colors.report-2}"
    typography: "{typography.title}"
    padding: "12px 22px"
  verdict-figure:
    textColor: "{colors.signal}"
    typography: "{typography.display}"
  verdict-odds-high:
    textColor: "{colors.ok}"
    typography: "{typography.display}"
  verdict-odds-low:
    textColor: "{colors.loss}"
    typography: "{typography.display}"
  status-stamp:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.stamp}"
    padding: "1px 6px"
  status-stamp-active:
    textColor: "{colors.st-active}"
  status-stamp-vacation:
    textColor: "{colors.st-vacation}"
  status-stamp-banned:
    textColor: "{colors.st-banned}"
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

Every tool hands down its verdict as a report: a dated, ruled document on a night-blue telex desk. The lineage is the combat and espionage reports OGame players have pasted into forums and Discord since 2002. The verdict is the first thing read and the thing copied back into chat, so the whole system is arranged to make one figure unmistakable and everything around it quiet.

The world is flat paper on a dark desk. A sticky index rail holds the brand, the one universe picker and the tool list; the desk to its right shows one tool at a time, its settings column beside the report sheet. The desk and its chrome are told apart by small steps of night blue and by 1px rules, never by glow; the report sheet lies one step lighter than the desk. Numbers that are read, compared or copied are set in a tabular face. Brass is the one chrome accent. Every other hue is data: the three resource inks, seven status inks, and the ok and loss inks for success, odds and errors, each used only where its colour carries the meaning.

The build refuses the neon HUD card stack of the previous UI and the generic SaaS dashboard: no glow, no glass, no decorative gradient, no pills. There is one theme.

**Key Characteristics:**
- Night-blue ground, three sheet steps, a report sheet one step lighter, warm paper ink.
- One brass signal ink for the verdict, focus and the open tool.
- Data inks by meaning: resource inks, status inks, and ok/loss for odds and errors.
- 1px rules everywhere; ruled lists and tables instead of cards in cards.
- Tabular numerals, with a mono face for coordinates, counts, ticks and stamps.
- Corners of 3px at most; status marks are rectangular stamps with an icon and a word.
- A single motion signature: a changed figure is re-inked by one brass stroke.

## Colors

A night-blue desk with a warm off-white ink and one brass accent; every other hue is data, coloured by what it means.

### Primary
- **Brass Signal** (signal): the verdict figures that have no meaning ink of their own (expedition find, the moon-lock coordinate link, moonbreak odds between 50% and 95%), the focus outline, the caret and text selection, the open tool label in the index, the selected heatmap cell and the current point on the moonbreak curve.
- **Brass Wash** (signal-soft) and **Brass Ink** (signal-ink): the translucent tint that fills the area under the moonbreak curve, and the dark text set on a brass fill (text selection).

### Secondary
- **Ember Loss** (loss) with **Loss Wash** (loss-soft): losses and errors. Moonbreak odds under 50%, moonbreak loss-confidence stamps, API error sheets, the remove-attacker hover.
- **Lichen Ok** (ok): success and "on". Moonbreak odds from 95%, the copied state of the copy button, enabled server settings.

### Tertiary (data inks)
- **Metal Grey** (metal), **Crystal Blue** (crystal), **Deuterium Green** (deut): the three OGame resources. In the trade calculator they colour the resource tiles, the amount field, each received-resource line and its amount, the slider fills and the resource icons and dots.
- **Status inks**: **Active Green** (st-active), **Inactive Apricot** (st-inactive), **Long-Inactive Clay** (st-long-inactive), **Vacation Blue** (st-vacation), **Banned Red** (st-banned), **Outlaw Violet** (st-outlaw), **Admin Teal** (st-admin). One ink per player status, shared by status stamps, status filter chips and the alliance breakdown.

### Neutral
- **Night Desk** (ground): the page ground behind the desk and inside inset panels (the universe box in the index).
- **Desk Sheet** (sheet): the index rail, ruled lists, the heatmap frame and help notes.
- **Sheet Two** (sheet-2): fields, hover fills, the open index row.
- **Sheet Three** (sheet-3): selected chips, the active language and the open list row.
- **Report** (report), **Report Two** (report-2), **Report Rule** (report-rule): the report sheet's body, its header band and the hairlines inside it. One step lighter than the desk, so the sheet reads as lying on it.
- **Hairline** (rule): row dividers, ruled lists, the header rule under each tool.
- **Strong Rule** (rule-strong): control borders, sheet borders, dashed empty states, slider tracks, scrollbars.
- **Paper Ink** (ink): primary text, the primary button fill and the curve line. **Bright Paper** (ink-bright) is only the primary button's hover.
- **Ink Two** (ink-2): secondary text, labels, inactive controls.
- **Ink Three** (ink-3): metadata, placeholders, ticks, column heads.
- **Heat ramp** (heat-0 to heat-5): six steps from night blue to sand, rising in value, so crowded systems on the galaxy map are the bright ones.

### Named Rules
**The Brass Reservation Rule.** Brass means "this is the answer, this has focus, or this is where you are." It marks the verdict figures that have no meaning ink, focus, the open tool, the selected heatmap cell, the curve's current point and the wash under the curve. Never use it for decoration, hover or headings.

**The Meaning Ink Rule.** A verdict takes a data ink instead of brass only when the colour is part of the answer. Trade amounts are set in the ink of the resource received; moonbreak odds are ok from 95%, loss under 50% and brass in between. This is the one exception to brass on the verdict.

**The Ink Selection Rule.** Selection that is not the open tool is shown with ink: an ink border and a step-up sheet fill (chips, list rows, language toggle). Two exceptions take their data ink: the selected resource tile (resource-ink border, an 18% resource tint and a 3px resource under-rule) and a selected status filter chip (status-ink border and a 16% status tint).

**The Data Ink Rule.** Resource and status inks describe a resource or a status. They never colour a button fill, a heading or a frame. The one borrowed use is the calculator field icons, which take a fixed ink each so the tools read apart: metal for moon size, crystal for the expedition fleet, vacation blue for moon-lock coordinates.

**The Never Colour Alone Rule.** No status is told by colour alone. Every status stamp carries its icon and its word; filter chips and breakdown items carry the icon in the status ink beside the word.

**The Heat Step Rule.** The heat ramp is one family from night blue to sand, and adjacent steps aim for at least 1.5:1 contrast so neighbouring levels stay apart.

## Typography

**Display Font:** Atkinson Hyperlegible Next (with Segoe UI, system-ui)
**Body Font:** Atkinson Hyperlegible Next
**Label/Mono Font:** Atkinson Hyperlegible Mono (with ui-monospace, SF Mono, Menlo)

**Character:** A legibility-first humanist sans carries every word and the verdict; its mono sibling sets the figures that get read across a row or copied, so a 0 never passes for an O and columns line up.

### Hierarchy
Every font size in the stylesheet is on this ramp (9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40px).
- **Display** (700, 40px, 1.1, -0.02em, tabular): the verdict figure. Display Compact (32px) under 860px.
- **Verdict Mono** (mono 600, 36px): the moon-lock coordinate verdict. Verdict Mono Compact (28px) under 860px.
- **Headline** (700, 30px, 1.2, -0.02em): the tool name, the page h1. Headline Compact (24px) under 860px. Headline Detail (26px, -0.01em) names the player or alliance in detail views.
- **Field Value** (700, 22px, tabular): the value in a one-line field.
- **Brand** (700, 18px, -0.01em): the brand name in the index; the position search field also sets its value at 18px.
- **Title** (700, 17px, 1.2): settings group titles, report sheet titles and verdict line names.
- **Body** (400, 16px, 1.5): running text, search fields, resource tiles. Intros cap at 72ch, help notes at 68ch.
- **Body Small** (400, 15px): help notes, index links, field labels, buttons. Secondary text also runs at 14px in ink-2.
- **Caption** (400, 13px): mini-field labels, the brand tagline, legends.
- **Label** (700, 12px, 0.08em, uppercase): only the index group headings and the server-settings group heads. Status stamps also set at 12px bold, not uppercase.
- **Figure Large** (mono, 20px): ship counts.
- **Figure** (mono 400, tabular, 14px): coordinates, ranks, counts, table cells, server values, chips, the tool stamp.
- **Ticks** (mono): heatmap axis ticks at 11px, the curve's current-point label at 10px (600), curve axis ticks and target labels at 9px.

### Named Rules
**The Tabular Figure Rule.** Any number a player compares or copies is tabular; numbers in rows, tables, ticks and stamps use the mono face.

**The One Loud Figure Rule.** Only the verdict reaches display size. Nothing else on a report competes with it.

## Layout

A two-column shell: the index rail (264px, sticky, full height, sheet colour, 1px rule on its right edge) and the desk (padding 28px 40px 56px). The desk is capped at 1280px and centred. Each tool opens with a header strip: the h1 and an "explain" text button on the left, the universe stamp on the right, a hairline under it.

Below the header, a tool grid lays settings beside the report. Calculators use a 5:6 split; data views use 7:5; settings-only tools stack in one column. The column gap is 32px. In split layouts the report is sticky at 24px from the top so the verdict stays in view while settings scroll. Settings groups are 28px apart, with 12px inside a group.

Responsive behaviour:
- Under 1180px, the tool grid collapses to one column and the report stops being sticky.
- Under 860px, the index dissolves into the page: brand and language on one row, the universe box, then the tool list as a sideways-scrolling strip of bordered links; the footer moves after the desk. Desk padding drops to 20px 16px 40px, sheet margins to 16px, and the display, verdict-mono and headline sizes step down to their compact sizes.
- Under 640px, the universe stamp is allowed to wrap.

Rhythm runs on a 4px base (4, 8, 12, 16, 24, 28, 32, 40), with the report sheet's 22px inset as its own step.

## Elevation & Depth

Depth comes from night-blue steps and rules: ground, then sheet, then sheet-2 for fields, then sheet-3 for selection. The report sheet is its own family one step lighter than the desk (report, report-2 for its header, report-rule for its hairlines), and it carries the one material shadow, a low, tight drop with no spread toward the viewer. The slider thumb carries a 1px contact shadow so it reads above its track. Nothing glows.

### Shadow Vocabulary
- **Sheet on desk** (`box-shadow: 0 12px 32px -18px rgba(0, 0, 0, 0.7)`): the report sheet only.
- **Thumb contact** (`box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5)`): the range slider thumb only.
- **Resource under-rule** (`box-shadow: inset 0 -3px 0 <resource ink>`): a flat 3px rule at the foot of the selected resource tile, drawn with an inset shadow. Not elevation.

### Named Rules
**The Paper Not Light Rule.** Surfaces are separated by tone and 1px rules. No glow, no glass, no blur, and no gradient except the slider track fill that shows the value.

## Shapes

Square-cornered paper. Sheets, controls, chips, fields and tinted verdict lines round to 3px, stamps to 2px, heatmap cells and legend swatches to 1px. The only circles are the brand logo, the resource dots and the slider thumb. Borders are 1px throughout: solid for controls and sheets, dashed for "add" ghost buttons and empty states. Disclosure arrows and select chevrons are drawn from CSS triangles, not glyphs. Icons are lucide-react line icons at 13 to 18px, plus three custom filled resource marks (ingot, gem, droplet).

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
- **State:** hover darkens the border to ink-3. Selected takes an ink border, a sheet-3 fill and bold ink text. Never brass.
- **Status filter chips:** the icon is always in its status ink; selected, the border takes the status ink over a 16% status tint.

### Cards / Containers (the report sheet)
- **Corner Style:** 3px.
- **Background:** report, with a report-2 header band ruled off by a strong rule; hairlines inside the sheet use report-rule.
- **Shadow Strategy:** the single "sheet on desk" shadow.
- **Border:** 1px strong rule.
- **Internal Padding:** 22px sides, 16px between blocks, 20px under the header (16px on mobile).
- **Content:** verdict lines separated by hairlines, each with a name on the left and the verdict figure on the right; a "for" line under a hairline restates the input.
- **Trade verdict lines:** each received resource is a 3px-cornered line on an 8% wash of its resource ink, the name in ink and the amount in the resource ink; lines sit 6px apart with no hairline.

### Inputs / Fields
- **Field (one line):** label on the left in ink-2, value right-aligned at 22px bold tabular, 52px tall, sheet-2 fill, strong-rule border. Search fields align left at 16px. The field's icon takes ink-3, or its fixed calculator ink.
- **Resource field:** the trade amount field takes a 35% resource-ink border over a 6% resource tint, and its focus border is the resource ink instead of brass.
- **Mini field:** a 13px ink-3 label above a 40px mono input or select on sheet-2.
- **Focus:** the border turns brass; no glow.
- **Slider:** a 4px track filled up to the value in the resource's ink (or ink-2), the rest in strong rule; an ink thumb with a ground-colour ring.
- **Error:** an API error is a sheet with a loss border and a loss wash.

### Resource Tiles
Three tiles choose the resource to sell. At rest each carries a 30% resource-ink border over a 7% resource tint, in ink-2; hover raises the border to 60% and the text to ink. Selected takes the full resource-ink border, an 18% tint, bold ink text and a 3px resource under-rule.

### Navigation
- **Index:** two groups (calculators, universe data), each under an uppercase label heading. Links are ruled rows at 15px in ink-2; hover fills sheet-2. The open tool is bold brass on sheet-2.
- **Mobile:** the rows become bordered 3px tabs in a sideways strip; the open tool keeps a brass border.
- **Language toggle:** a joined pair of buttons inside one strong-rule frame; the active language is ink on sheet-3.

### Status Stamps
Rectangular, ruled, never pills: 2px corners, 12px bold text with a 13px lucide icon and the status word. The text is the status ink, the 1px border is the status ink at 55%, and the fill is the status ink at 14%, mixed with `color-mix`. A stamp without a status falls back to ink-2 text over ink-3. The alliance breakdown lists each status as an icon in its status ink beside an ink-2 word and a mono count. The tool header carries a larger mono stamp naming the universe and data age.

### Ruled Lists and Tables
Players, alliances, planets, ships, waves and server settings are all ruled lists: rows with 1px hairlines, a label in ink-2 on the left, a tabular value on the right. In the players and alliances lists, an open row takes sheet-3 with an inset ink-3 outline while the other rows dim to ink-2.

### Galaxy Heatmap
A grid of 12 by 18px cells (2px gap, 1px corners) on a ruled sheet, with a sticky mono row label. Cell value runs up the night-blue-to-sand heat ramp. Hover draws a 1px ink border; the selected cell is filled and outlined in brass.

### Moonbreak Verdict and Curve
The probability is the display figure, coloured by its odds band (ok from 95%, loss under 50%, brass in between). The curve is an SVG chart on hairline gridlines with mono 9px ticks: the area under it is washed in signal-soft, the line is a 1.75px paper-ink stroke, the target is a dashed strong rule, and the current point is a brass dot ringed in sheet colour with a brass 10px mono label.

### Re-ink (signature motion)
When a verdict figure changes, a 2px brass stroke sweeps under it from left to right and fades (scaleX, 0.9s, `cubic-bezier(0.16, 1, 0.3, 1)`). Reduced motion removes it. All other state changes are 0.15s colour and border transitions.

## Do's and Don'ts

### Do:
- **Do** keep brass to verdict figures without a meaning ink, focus, the open tool, the selected heatmap cell, the curve's current point and the wash under the curve.
- **Do** set trade amounts in the ink of the resource received, and colour moonbreak odds ok from 95%, loss under 50% and brass in between.
- **Do** show any other selection with an ink border and a step-up sheet fill (sheet-2 for hover, sheet-3 for selected); only resource tiles and status filter chips select in their data ink.
- **Do** draw status as text, a 55% border and a 14% tint of its status ink, always with its icon and its word.
- **Do** lay the report sheet on the report family (report, report-2, report-rule), one step lighter than the desk.
- **Do** separate surfaces with 1px rules and night-blue steps; rule lists and tables instead of nesting cards.
- **Do** set compared or copied numbers tabular, and in the mono face when they sit in rows, tables, ticks or stamps.
- **Do** pick font sizes from the type ramp.
- **Do** make status marks rectangular stamps with 2px corners and a 1px border.
- **Do** colour the galaxy heatmap with the single night-blue-to-sand ramp (heat-0 to heat-5), keeping adjacent steps at least 1.5:1 apart.
- **Do** keep the report beside the settings and sticky on wide screens so the verdict is read without scrolling.

### Don't:
- **Don't** use glows, glass, blur or decorative gradients; the slider's value fill is the only gradient.
- **Don't** add coloured side stripes to cards, notes or rows.
- **Don't** round anything past 3px, and don't make status marks into pills.
- **Don't** add a second chrome accent, or use brass for decoration, hover flourishes or headings.
- **Don't** use resource or status inks for button fills, headings or frames, or let colour be the only cue for a status.
- **Don't** set any figure other than the verdict at display size.
- **Don't** add shadows beyond the report sheet's single drop shadow and the slider thumb's contact shadow.
- **Don't** add a theme picker or alternative palettes; the system has one theme.
