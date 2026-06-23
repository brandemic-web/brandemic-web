/**
 * Ticker Animations - Horizontal loop tickers for various sections
 */

import { horizontalLoop } from "../../utils/horizontalLoop.js";

let aboutTickerLoops = [];
let hopscotchTickerLoops = [];

// export function brandTicker() {
//   const elements = [
//     { selector: '[data-anim-attr="brand_logo"]', hover: ".brands_wrapper", reversed: false },
//     { selector: ".team_ticker-wrapper.is-one .team_card",hover: ".team_ticker-wrapper_collection .is-one", reversed: false },
//     { selector: ".team_ticker-wrapper.is-two .team_card",hover: ".team_ticker-wrapper_collection .is-two", reversed: true },
//     { selector: ".culture_image", reversed: false },
//   ];

//   const teamRows = [];

//   aboutTickerLoops = elements
//     .map(({ selector, hover, reversed }) => {
//       const items = gsap.utils.toArray(selector);
//       if (items.length === 0) return null;

//       const isTeamRow = selector.includes("team_card");

//       const loop = horizontalLoop(items, {
//         draggable: false,
//         inertia: false,
//         repeat: -1,
//         center: false,
//         reversed,
//         paused: true,
//       });

//       if (isTeamRow) {
//         loop.pause();
//         gsap.set(items, { autoAlpha: 0, x: 0, clearProps: "transform" });
//         teamRows.push({ items, loop, reversed });
//       } else {
//         ScrollTrigger.create({
//           trigger: selector,
//           start: "top bottom",
//           once: true,
//           onEnter: () => (reversed ? loop.reverse() : loop.play()),
//         });
//       }

//       // Pause on hover
//       const target = hover
//         ? document.querySelector(hover)
//         : items[0].parentNode;

//       if (target) {
//         target.addEventListener("mouseenter", () => loop.pause());
//         target.addEventListener("mouseleave", () =>
//           reversed ? loop.reverse() : loop.play(),
//         );
//       }

//       return loop;
//     })
//     .filter(Boolean);

//   // Single shared ScrollTrigger for both team rows
//   if (teamRows.length > 0) {
//     const sharedTrigger =
//       document.querySelector(".team_ticker-wrapper.is-one") ||
//       teamRows[0].items[0].parentNode;

//     ScrollTrigger.create({
//       trigger: sharedTrigger,
//       start: "top 80%",
//       once: true,
//       onEnter: () => {
//         const isMobile = window.innerWidth < 768;
//         const visibleCount = isMobile ? 4 : 7;

//         teamRows.forEach(({ items, loop, reversed }) => {
//           const visibleItems = items.slice(0, visibleCount);
//           const restItems = items.slice(visibleCount);

//           gsap.set(restItems, { autoAlpha: 1 });
//           gsap.set(visibleItems, { autoAlpha: 0, filter: "blur(5px)" });

//           gsap.to(visibleItems, {
//             autoAlpha: 1,
//             filter: "blur(0px)",
//             duration: 1.2,
//             stagger: 0.3,
//             ease: "power1.inOut",
//             onComplete: () => {
//               reversed ? loop.reverse() : loop.play();
//             },
//           });
//         });
//       },
//     });
//   }
// }
export function brandTicker() {
  const elements = [
    { selector: '[data-anim-attr="brand_logo"]', hover: ".brands_wrapper", reversed: false },
    { selector: ".team_ticker-wrapper.is-one .team_card", reversed: false },
    { selector: ".team_ticker-wrapper.is-two .team_card", reversed: true },
    { selector: '[data-anim-attr="culture_image"]', reversed: false },
  ];

  const teamRows = [];

  aboutTickerLoops = elements
    .map(({ selector, hover, reversed }) => {
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
        loop.pause();
        gsap.set(items, { autoAlpha: 0, x: 0, clearProps: "transform" });
        teamRows.push({ items, loop, reversed });
      } else {
        ScrollTrigger.create({
          trigger: selector,
          start: "top bottom",
          once: true,
          onEnter: () => (reversed ? loop.reverse() : loop.play()),
        });

        // Hover only for non-team rows
        const target = hover
          ? document.querySelector(hover)
          : items[0].parentNode;

        if (target) {
          target.addEventListener("mouseenter", () => loop.pause());
          target.addEventListener("mouseleave", () =>
            reversed ? loop.reverse() : loop.play()
          );
        }
      }

      return loop;
    })
    .filter(Boolean);

  // Single shared ScrollTrigger for both team rows
  if (teamRows.length > 0) {
    const sharedTrigger =
      document.querySelector(".team_ticker-wrapper.is-one") ||
      teamRows[0].items[0].parentNode;

    ScrollTrigger.create({
      trigger: sharedTrigger,
      start: "top 80%",
      once: true,
      onEnter: () => {
        const isMobile = window.innerWidth < 768;
        const visibleCount = isMobile ? 4 : 7;

        teamRows.forEach(({ items, loop, reversed }) => {
          const visibleItems = items.slice(0, visibleCount);
          const restItems = items.slice(visibleCount);

          gsap.set(restItems, { autoAlpha: 1 });
          gsap.set(visibleItems, { autoAlpha: 0, filter: "blur(5px)" });

          gsap.to(visibleItems, {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1.2,
            stagger: 0.3,
            ease: "power1.inOut",
            onComplete: () => {
              reversed ? loop.reverse() : loop.play();
            },
          });
        });
      },
    });

    // Bind each collection wrapper to its corresponding loop
    const collectionWrappers = document.querySelectorAll(".team_ticker_wrapper_collection");
    collectionWrappers.forEach((wrapper, index) => {
      const row = teamRows[index];
      if (!row || !wrapper) return;

      wrapper.addEventListener("mouseenter", () => row.loop.pause());
      wrapper.addEventListener("mouseleave", () => {
        row.reversed ? row.loop.reverse() : row.loop.play();
      });
    });
  }
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
