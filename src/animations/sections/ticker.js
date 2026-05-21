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
    { selector: ".brand_logo", hover: ".brands_wrapper", reversed: false },
    { selector: ".team_ticker-wrapper.is-one .team_card", reversed: false },
    { selector: ".team_ticker-wrapper.is-two .team_card", reversed: true },
    { selector: ".culture_image", reversed: false },
  ];

  aboutTickerLoops = elements
    .map(({ selector, hover, reversed }, index) => {
      const items = gsap.utils.toArray(selector);
      if (items.length === 0) return null;

      const isTeamRow = selector.includes("team_card");

      const loop = horizontalLoop(items, {
        draggable: false,
        inertia: false,
        repeat: -1,
        center: false,
        reversed,
        paused: true,
      });

      if (isTeamRow) {
        // Hide all cards immediately so they don't flash before scroll trigger
        gsap.set(items, { autoAlpha: 0 });

        ScrollTrigger.create({
          trigger: selector,
          start: "top bottom",
          once: true,
          onEnter: () => {
            gsap.to(items, {
              autoAlpha: 1,
              duration: 0.4,
              stagger: 0.08,
              ease: "power2.out",
              onComplete: () => {
                reversed ? loop.reverse() : loop.play();
              },
            });
          },
        });
      } else {
        ScrollTrigger.create({
          trigger: selector,
          start: "top bottom",
          once: true,
          onEnter: () => (reversed ? loop.reverse() : loop.play()),
        });
      }

      // Pause on hover
      const target = hover
        ? document.querySelector(hover)
        : items[0].parentNode;

      if (target) {
        target.addEventListener("mouseenter", () => loop.pause());
        target.addEventListener("mouseleave", () =>
          reversed ? loop.reverse() : loop.play(),
        );
      }

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

export function initHorizontalTicker(
  wrapperSelector,
  itemSelector,
  hoverSelector,
) {
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

  // Pause on hover — prefer the outer wrapper over the items' direct parent
  const hoverTarget =
    (hoverSelector && document.querySelector(hoverSelector)) ||
    wrapper.parentElement ||
    wrapper;

  hoverTarget.addEventListener("mouseenter", () => loop.pause());
  hoverTarget.addEventListener("mouseleave", () => loop.play());

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
