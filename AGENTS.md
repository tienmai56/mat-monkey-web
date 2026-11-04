# Project rules

- Homepage UI lives in `src/routes/index.tsx` with shared brand primitives in `src/components/home/` (logo, avatars, tape labels, streak belts, session ticket, phone mockup); app screens are rebuilt in HTML/CSS instead of screenshots so they stay faithful to the current app.
- Design tokens (paper, ink, coral, friend hues, shadows, press-edge utilities) are defined in `src/styles.css` and mirror Calculated-Reps `design-system/tokens/`; fonts load from the existing `/share-assets/*.woff2` files, never a remote font CSS.
- The Silverback logo is always rendered from `/share-assets/logo-mark*.svg` and never inside rotated containers, because the brand forbids redrawing or rotating it.
