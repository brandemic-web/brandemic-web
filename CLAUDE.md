# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A modular ES6 animation library for the Brandemic website. Source code in `src/` is bundled via Rollup into an IIFE (`dist/main.js` and `dist/main.min.js`) served from jsDelivr CDN, loaded in Webflow after GSAP plugins and Barba.js.

## Commands

```bash
npm run dev              # Watch mode (rebuilds on change)
npm run build            # Production build → dist/
npm run release:patch    # Build, bump version, commit, tag, push
npm run release:minor
npm run release:major
```

No test framework — verify by running `npm run build` and testing in browser.

## Architecture

**Entry point**: `src/index.js` → registers GSAP plugins, initializes Barba.js, smooth scroll, cursor, navigation, footer.

**Core flow**: Barba.js manages SPA-style page transitions. On each navigation:
1. `leave` — fades out current page, kills it
2. `beforeEnter` — resets Webflow, kills all ScrollTriggers, recreates ScrollSmoother, re-inits cursor/footer
3. `enter` — fades in new page
4. `afterEnter` (per view) — calls page-specific `initXxxAnimations()`
5. `beforeLeave` (per view) — calls page-specific `destroyXxxAnimations()`

**Page modules** (`src/pages/*.js`): Each page exports `init` and `destroy` functions that orchestrate animations for that page. Barba views are mapped by namespace: `home`, `about`, `portfolio`, `contact`, `case-study`, `service`, `thanks`, `blogs`, `blog`.

### Init/Destroy Pattern

Every animation module must export both `init` and `destroy` functions. The destroy function must kill timelines, ScrollTriggers, and remove event listeners. Leaking these causes bugs on repeated page transitions.

```js
// Add to page: import in src/pages/[page].js, call in both init and destroy
export function initMyAnimation() { /* ... */ }
export function destroyMyAnimation() { /* ... */ }
```

### External Globals (CDN-loaded, not bundled)

`gsap`, `ScrollTrigger`, `ScrollSmoother`, `SplitText`, `DrawSVGPlugin`, `Flip`, `Draggable`, `Observer`, `barba`, `Swiper`, `Webflow`, `jQuery` — all available as globals, do not import them.

## Key Conventions

- **Module state**: Store timelines/instances in module-scoped variables. Expose via getter functions when other modules need access (see `megaMenu.js` pattern).
- **Mobile**: Use `isMobile()` from `src/utils/isMobile.js`. Desktop-only features (custom cursor, hover effects) are gated behind `!mobile` checks.
- **CSS classes**: All selectors (`.work_image`, `.animated-chars`, etc.) are defined in Webflow. See `CLASS-REFERENCE.md` for the full list. Do not rename without updating both Webflow and JS.
- **horizontalLoop**: `src/utils/horizontalLoop.js` creates infinite horizontal tickers. Used for brand logos, team cards, culture images. Returns a GSAP timeline — call `.kill()` in destroy.
- **ScrollSmoother**: Uses `#smooth-wrapper` > `#smooth-content` structure. Access via `getSmoother()` from `src/core/smoothScroll.js`.
