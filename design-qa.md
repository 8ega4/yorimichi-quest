# Design QA — 寄り道クエスト

## Visual truth

- Approved reference: `/Users/8ega4/Documents/Codex/2026-07-23/new-chat-2/outputs/yorimichi-quest-key-visual.png`
- Latest home screenshot: `/Users/8ega4/.codex/visualizations/2026/07/23/019f8ccf-589f-73e3-8f7a-8eabac0171de/yorimichi-home-390-final.jpg`
- Latest run screenshot: `/Users/8ega4/.codex/visualizations/2026/07/23/019f8ccf-589f-73e3-8f7a-8eabac0171de/yorimichi-run-390-final.jpg`
- Side-by-side comparison: `/Users/8ega4/.codex/visualizations/2026/07/23/019f8ccf-589f-73e3-8f7a-8eabac0171de/yorimichi-visual-comparison.png`

## Capture contract

- Viewport: 390 × 844 CSS px
- Screenshot size: 390 × 844 px (1× capture)
- State: `?sample=1`; saved discoveries present; home at rest and an active 5-minute quest after the sample track had advanced
- Full-view evidence: full home and quest-run screens, including the fixed bottom navigation or action area
- Focused evidence: the quest-run screen is the focused check for the yellow walked track, current-location point, map attribution, safety notice, and primary action

## Findings

| Priority | Area | Result |
| --- | --- | --- |
| P0 | Core task clarity | Pass — the orange start/record action is immediately identifiable and remains above the fold. |
| P0 | Safety and privacy cues | Pass — the home disclosure and map safety notice are visible without competing with the main action. |
| P1 | Reference palette | Pass — warm cream, orange, young green, teal, and luminous yellow are present with restrained contrast. |
| P1 | Reference motifs | Pass — red flags, sparkles, a miniature-town hero, and the glowing route carry across without embedding operational UI in the image. |
| P1 | Route semantics | Pass — the map shows only the sampled walked track and current point; it does not draw a navigation proposal. |
| P1 | Small-screen hierarchy | Pass — title, message, hero, counts, CTA, and navigation remain readable at 390 × 844. Automated overflow coverage also passes at 360, 390, and 430 px. |
| P2 | Paper depth and typography | Pass — rounded Japanese type, paper grain, pale keylines, and two shadow levels preserve the crafted feel without becoming a children's-game UI. |
| P2 | Map fallback boundary | Pass — attribution is visible and the action panel is independent of tile rendering. |

## Iteration history

1. The first run capture showed too little of the sample track to communicate the glowing-path motif clearly.
2. Reduced the sample update interval from 1250 ms to 450 ms while keeping the same fixed, safe sample geometry.
3. Re-ran the full browser flow and captured the final home/run views. The route now reads as a travelled line while the map remains visually secondary to safety and task controls.
4. Compared the approved reference, final home, and final run screen in one composite input. No open P0, P1, or P2 visual issues remain.

## Accepted constraints

- The high-detail miniature diorama remains concentrated in the approved home key visual; operational screens translate its color, paper, flag, and light language into native HTML/CSS and MapLibre UI.
- Base-map appearance and availability depend on the configured tile provider. The product UI remains usable when tiles fail, and provider attribution remains visible when they load.

## Final result

passed
