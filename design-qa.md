# Design QA — 寄り道クエスト TOP v3

## Visual truth

- Source visual truth: `/Users/8ega4/Downloads/生成画像2.png`
- Generated text-free scene asset: `/Users/8ega4/dev/yorimichi-quest/public/assets/home-city-scene.jpg`
- Source title artwork: `/Users/8ega4/dev/yorimichi-quest/design-qa/yorimichi-title-art-source.jpg`
- Transparent runtime title: `/Users/8ega4/dev/yorimichi-quest/public/assets/yorimichi-title.png`
- Browser-rendered implementation: `/Users/8ega4/dev/yorimichi-quest/design-qa/home-v5-centered-title-390.jpg`
- Side-by-side comparison: `/Users/8ega4/dev/yorimichi-quest/design-qa/home-v3-title-comparison.jpg`
- Focused title comparison: `/Users/8ega4/dev/yorimichi-quest/design-qa/home-v3-title-focused.jpg`

## Capture contract

- CSS viewport: 390 × 844 px
- Device scale factor: 1
- Source pixels: 1003 × 1568 px
- Implementation pixels: 390 × 844 px
- Density normalization: the source was center-cropped with `cover` to 390 × 844 px; the implementation was captured at 390 × 844 px and compared at 1:1
- State: `/?sample=1`, saved discoveries and an active attempt present, scene-arrival animation settled at opacity 1
- Primary interactions preserved: start/resume quest, location-permission timing, sample-mode switch, discovery recording, completion, journal, map, keyboard focus
- Browser console: no errors or warnings; Vite and React development notices only
- Full-view evidence: source and implementation appear in the same 780 × 844 px comparison image
- Focused evidence: the top 220 px of both normalized images appear together in a 780 × 220 px comparison image

## Findings

| Priority | Fidelity surface | Result |
| --- | --- | --- |
| P0 | Core action | Pass — the orange start/resume button is readable, at least 44 px high, and remains above the bottom navigation. |
| P0 | Interaction preservation | Pass — the TOP redesign does not request location early and preserves sample-mode and quest-flow behavior. |
| P1 | Layout and hierarchy | Pass — the source sequence of warm paper sky, oversized logo, dense miniature town, luminous route, and lower river is retained. |
| P1 | Image quality | Pass — the full-bleed 1003 × 1568 scene remains sharp at 390 px and uses a natural center crop without stretching. |
| P1 | Reference motifs | Pass — sun, paper clouds, young-green foliage, teal/orange roofs, red flags, yellow route, and sparkles are present. |
| P1 | Title fidelity | Pass — the visible title preserves the source letterforms, cream outline, paper shadow, sparkle, and flag while allowing the TOP scene to show through every gap around the letters. |
| P2 | Accessibility | Pass — a visually hidden `h1` keeps the product name available to screen readers while the decorative raster title is ignored by assistive technology. |
| P2 | Spacing and rhythm | Pass — title, message, counters, CTA, mode note, and navigation do not overlap at 390 × 844; browser overflow checks also pass at 360, 390, and 430 px. |
| P2 | Color and tokens | Pass — warm cream, orange, young green, teal, yellow, and charcoal map directly to the approved product tokens. |
| P2 | Copy and content | Pass — the existing value proposition, counters, primary action, sample-mode disclosure, and navigation labels remain intact. |

## Comparison history

1. TOP v2 reproduced the title with live HTML text so all interface wording stayed selectable and accessible.
2. The user explicitly requested that the product title also use the reference artwork. The v2 text treatment therefore became a P1 fidelity mismatch for this revision.
3. Extracted only the title lockup from the supplied 1003 × 1568 source, preserving the original sun, cloud, sparkle, flag, outline, and shadow.
4. Replaced the visible HTML letter treatment with the extracted artwork and retained a visually hidden semantic `h1`.
5. Captured the settled implementation at 360, 390, and 430 px. The image measures about 364 × 120 px at 390 px and produces no horizontal overflow.
6. Compared the normalized source and implementation in both full-view and focused composites. No actionable P0, P1, or P2 differences remain.
7. Replaced the opaque 1003 × 330 JPEG title crop with a transparent 918 × 259 PNG extracted from the same approved artwork.
8. Removed the CSS multiply blend because the PNG now carries a real alpha channel. At 390 px it renders at about 364 × 103 px with no rectangular paper background.
9. Rechecked 360, 390, and 430 px in the browser. The scene is visible through the logo spacing, no horizontal overflow occurs, and the browser console remains clear.
10. Replaced the title container’s negative horizontal margin with `margin-inline: auto`. Browser measurements place the title center exactly at the viewport center at 360, 390, and 430 px.

## Accepted constraints

- The visible title is intentionally transparent raster artwork per the user’s latest direction. It contains no location metadata and is paired with semantic HTML text for accessibility.
- Product controls necessarily occupy part of the town image; they use compact paper surfaces so the route and miniature scene remain the visual focus.

## Follow-up polish

- P3: create a transparent-background master of the title artwork if the lockup must later be reused over substantially different backgrounds.

## Final result

passed
