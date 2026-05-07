/**
 * Ticker Animations - Horizontal loop tickers for various sections
 */

import { horizontalLoop } from "../../utils/horizontalLoop.js";

let aboutTickerLoops = [];
let hopscotchTickerLoops = [];

/**
 * Initialize about page tickers (brands, team, culture)
 */
export function brandTicker() {
  const elements = [
    { selector: ".brand_logo", container: ".brand_logo_list", reversed: false },
    {
      selector: ".team_ticker-wrapper.is-one .team_card",
      container: ".team_ticker-wrapper.is-one",
      reversed: false,
    },
    {
      selector: ".team_ticker-wrapper.is-two .team_card",
      container: ".team_ticker-wrapper.is-two",
      reversed: true,
    },
    {
      selector: ".culture_image",
      container: ".culture_image-ticker",
      reversed: false,
    },
  ];

  aboutTickerLoops = elements
    .map(({ selector, container, reversed }) => {
      const items = gsap.utils.toArray(selector);
      const hoverTarget = document.querySelector(container);
      if (items.length === 0 || !hoverTarget) return null;

      // 1. Initialize the loop
      const loop = horizontalLoop(items, {
        repeat: -1,
        reversed: reversed, // Let the helper handle the direction
        paused: true,
      });

      // 2. Attach listeners ONCE (outside ScrollTrigger)
      // We use a simple toggle to avoid scale direction confusion
      hoverTarget.addEventListener("mouseenter", () => {
        gsap.to(loop, { timeScale: 0, duration: 0.5, overwrite: "auto" });
      });

      hoverTarget.addEventListener("mouseleave", () => {
        // Always go back to 1, because the 'reversed' state is
        // handled internally by the loop's play/reverse direction
        gsap.to(loop, { timeScale: 1, duration: 0.5, overwrite: "auto" });
      });

      // 3. Use ScrollTrigger only to Start/Stop the ticker
      ScrollTrigger.create({
        trigger: hoverTarget,
        start: "top bottom",
        onEnter: () => loop.play(),
        onLeave: () => loop.pause(),
        onEnterBack: () => loop.play(),
        onLeaveBack: () => loop.pause(),
      });

      return loop;
    })
    .filter(Boolean);
}

/**
 * Destroy about page tickers
 */
export function destroyBrandTicker() {
  aboutTickerLoops.forEach((loop) => {
    if (loop && typeof loop.kill === "function") {
      loop.kill();
    }
  });
  aboutTickerLoops = [];
}

/**
 * Initialize case study ticker
 */
let tickerLoops = [];

export function initHorizontalTicker(wrapperSelector, itemSelector) {
  const wrapper = document.querySelector(wrapperSelector);
  if (!wrapper) return;

  const items = gsap.utils.toArray(itemSelector);
  if (!items.length) return;

  const loop = horizontalLoop(items, {
    draggable: false,
    inertia: false,
    repeat: -1,
    center: false,
  });

  tickerLoops.push(loop);
  return loop;
}

export function destroyHorizontalTickers() {
  tickerLoops.forEach((loop) => loop.kill && loop.kill());
  tickerLoops = [];
}

/**
 * Initialize Hopscotch tickers (two tickers moving in opposite directions)
 */
export function hopscotchTicker() {
  const tickerOne = document.querySelector(".hopscotch_ticker.is-one");
  const tickerTwo = document.querySelector(".hopscotch_ticker.is-two");
  if (!tickerOne && !tickerTwo) return;

  const elements = [
    {
      selector: ".hopscotch_ticker.is-one .hopscotch_ticker-svg",
      reversed: false,
    },
    {
      selector: ".hopscotch_ticker.is-two .hopscotch_ticker-svg",
      reversed: true,
    },
  ];

  hopscotchTickerLoops = elements
    .map(({ selector, reversed }) => {
      const items = gsap.utils.toArray(selector);
      if (items.length === 0) return null;

      const loop = horizontalLoop(items, {
        draggable: false,
        inertia: false,
        repeat: -1,
        center: false,
        reversed,
      });

      return loop;
    })
    .filter(Boolean);
}

/**
 * Destroy case study variant tickers
 */
export function destroyTickers() {
  hopscotchTickerLoops.forEach((loop) => {
    if (loop && typeof loop.kill === "function") {
      loop.kill();
    }
  });
  hopscotchTickerLoops = [];
}

let marqueeTweens = [];

/**
 * Initialize SVG marquee animation
 * @param {string} className - CSS class (without dot)
 */
export function initMarqueeSVG(className) {
  const elements = document.querySelectorAll(`.${className}`);
  if (!elements.length) return;

  elements.forEach((el) => {
    // prevent duplicate tween on same element
    if (marqueeTweens.some((t) => t.targets().includes(el))) return;

    const tween = gsap.to(el, {
      x: "-100%",
      duration: 20,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % 100),
      },
    });

    marqueeTweens.push(tween);
  });
}

/**
 * Destroy ALL marquee tweens
 */
export function destroyMarqueeSVG() {
  marqueeTweens.forEach((tween) => tween.kill());
  marqueeTweens = [];
}
