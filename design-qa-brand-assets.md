# Design QA — Brand assets

## Visual truth

- Key visual: `/Users/8ega4/Downloads/生成画像2.png`
- Generated icon master: `/Users/8ega4/dev/yorimichi-quest/design-qa/app-icon-master.png`
- Icon comparison sheet: `/Users/8ega4/dev/yorimichi-quest/design-qa/brand-assets-v1.png`
- OGP background master: `/Users/8ega4/dev/yorimichi-quest/design-qa/ogp-v2-background-master.png`
- Transparent title artwork: `/Users/8ega4/dev/yorimichi-quest/design-qa/yorimichi-title-transparent-final.png`
- Final OGP evidence: `/Users/8ega4/dev/yorimichi-quest/design-qa/ogp-v2-final.jpg`
- Published OGP asset: `/Users/8ega4/dev/yorimichi-quest/public/ogp.jpg`

## Asset contract

| Asset | Size | Result |
| --- | ---: | --- |
| favicon | 16 × 16, 32 × 32 | Pass — the orange flag and yellow route remain distinguishable without text. |
| Apple touch icon | 180 × 180 | Pass — opaque cream background, full safe margin, no platform mask baked in. |
| PWA icon | 192 × 192, 512 × 512 | Pass — square `any` icons use the same mark. |
| Maskable icon | 512 × 512 | Pass — the mark stays inside the central safe zone on an opaque cream background. |
| OGP | 1200 × 630 | Pass — the title has no rectangular background, and the luminous route exists only on visible streets inside the town. |

## OGP revision history

1. V1 placed the title crop as an opaque rectangle on a separate cream panel. The slight paper-color mismatch made the title background visibly attached.
2. V1 also added a decorative yellow stroke at the center seam. Because it did not correspond to a visible street, it had no product meaning.
3. V2 rebuilds the art as one continuous wide paper-diorama scene without a split panel or seam.
4. The approved title artwork was extracted to per-letter transparency before compositing, preserving the exact Japanese title without a background rectangle.
5. The yellow route is now part of the right-side miniature town only and follows visible streets with red checkpoints.
6. The value proposition remains plain HTML-rendered Japanese text in the image-composition step; there are no generated-text artifacts.

## Implementation checks

- The icon mark was generated from the approved paper-craft direction and deliberately excludes title text and town detail at favicon sizes.
- OGP text and transparent title artwork were composited deterministically from local assets to avoid generated-text errors.
- Visual inspection at 1200 × 630 confirmed there is no title rectangle, center divider, floating road, or unexplained yellow stroke.
- Sharp processing strips source metadata; exported PNG and JPEG files contain no location information.
- `index.html` exposes favicon, Apple icon, Open Graph, Twitter Card, canonical, dimensions, and alt metadata.
- The Open Graph and Twitter image URLs use `?v=2` so social crawlers do not reuse the rejected V1 cache.
- The PWA manifest exposes separate `any` and `maskable` icon entries.
- Browser inspection found no console errors or warnings and confirmed the expected metadata.
- Local HTTP checks returned `200` with correct image content types for every asset.
- Lint, 20 Vitest assertions, production build, and PWA service-worker generation passed.

## Final result

passed
