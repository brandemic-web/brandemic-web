/**
 * Ticker Animations - Horizontal loop tickers for various sections
 * Hover behavior: smooth brake-like deceleration (like a vehicle stopping)
 */

import { horizontalLoop } from '../../utils/horizontalLoop.js';

let aboutTickerLoops = [];
let hopscotchTickerLoops = [];

// ─── Smooth Brake Helper ──────────────────────────────────────────────────────
/**
 * Attaches smooth brake-on-hover to a DOM container.
 * Instead of pausing abruptly, tweens timeScale → 0 (brake) and back → 1 (accelerate).
 *
 * @param {Element}  container  - The element to watch for mouseenter/mouseleave
 * @param {GSAPTween} loop      - The horizontalLoop (or any GSAP tween/timeline)
 * @param {Object}   [opts]
 * @param {number}   [opts.brakeDuration=0.6]    - Seconds to fully stop  (shorter = harder brake)
 * @param {number}   [opts.accelDuration=0.9]    - Seconds to reach full speed again
 * @param {string}   [opts.brakeEase="power2.out"]  - Ease for slowing down
 * @param {string}   [opts.accelEase="power1.in"]   - Ease for speeding back up
 * @param {number}   [opts.targetSpeed=1]         - Normal playback speed (use -1 for reversed)
 * @returns {{ destroy: Function }} - Call destroy() to remove listeners
 */
function attachBrakeHover(container, loop, opts = {}) {
    if (!container || !loop) return { destroy: () => {} };

    const {
        brakeDuration = 0.6,
        accelDuration = 0.9,
        brakeEase     = "power2.out",
        accelEase     = "power1.in",
        targetSpeed   = 1,
    } = opts;

    // We'll track the in-flight tween so we can kill it before starting a new one
    let scaleTween = null;

    function tweenScale(to, duration, ease) {
        if (scaleTween) scaleTween.kill();
        scaleTween = gsap.to(loop, {
            timeScale: to,
            duration,
            ease,
            overwrite: true,
        });
    }

    const onEnter = () => tweenScale(0, brakeDuration, brakeEase);
    const onLeave = () => tweenScale(targetSpeed, accelDuration, accelEase);

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);

    return {
        destroy() {
            container.removeEventListener("mouseenter", onEnter);
            container.removeEventListener("mouseleave", onLeave);
            if (scaleTween) scaleTween.kill();
        }
    };
}

// Storage for cleanup
const brakeCleanups = [];

// ─── Brand Ticker ─────────────────────────────────────────────────────────────
/**
 * Initialize about page tickers (brands, team, culture)
 */
export function brandTicker() {
    const elements = [
        { selector: ".brand_logo",                                   reversed: false },
        { selector: ".team_ticker-wrapper.is-one .team_card",        reversed: false },
        { selector: ".team_ticker-wrapper.is-two .team_card",        reversed: true  },
        { selector: ".culture_image",                                reversed: false },
    ];

    aboutTickerLoops = elements.map(({ selector, reversed }) => {
        const items = gsap.utils.toArray(selector);
        if (items.length === 0) return null;

        const loop = horizontalLoop(items, {
            draggable: false,
            inertia:   false,
            repeat:    -1,
            center:    false,
            reversed,
            paused:    true,
        });

        // Set correct initial timeScale direction so brake targets are right
        loop.timeScale(reversed ? -1 : 1);

        ScrollTrigger.create({
            trigger: selector,
            start:   "top bottom",
            once:    true,
            onEnter: () => reversed ? loop.reverse() : loop.play(),
        });

        // Attach brake hover to the ticker's parent wrapper
        const container = document.querySelector(selector)?.closest("[class*='ticker'], [class*='brand'], [class*='culture']")
                          || document.querySelector(selector)?.parentElement;

        if (container) {
            const cleanup = attachBrakeHover(container, loop, {
                targetSpeed: reversed ? -1 : 1,
            });
            brakeCleanups.push(cleanup);
        }

        return loop;
    }).filter(Boolean);
}

/**
 * Destroy about page tickers
 */
export function destroyBrandTicker() {
    aboutTickerLoops.forEach(loop => loop?.kill?.());
    aboutTickerLoops = [];
}

// ─── Case Study / Horizontal Ticker ──────────────────────────────────────────
let tickerLoops = [];

/**
 * Initialize case study ticker
 * @param {string} wrapperSelector - Selector for the ticker wrapper (used for hover)
 * @param {string} itemSelector    - Selector for individual ticker items
 */
export function initHorizontalTicker(wrapperSelector, itemSelector) {
    const wrapper = document.querySelector(wrapperSelector);
    if (!wrapper) return;

    const items = gsap.utils.toArray(itemSelector);
    if (!items.length) return;

    const loop = horizontalLoop(items, {
        draggable: false,
        inertia:   false,
        repeat:    -1,
        center:    false,
    });

    // Brake on hover over the entire wrapper
    const cleanup = attachBrakeHover(wrapper, loop);
    brakeCleanups.push(cleanup);

    tickerLoops.push(loop);
    return loop;
}

export function destroyHorizontalTickers() {
    tickerLoops.forEach(loop => loop?.kill?.());
    tickerLoops = [];
}

// ─── Hopscotch Ticker ─────────────────────────────────────────────────────────
/**
 * Initialize Hopscotch tickers (two tickers moving in opposite directions)
 */
export function hopscotchTicker() {
    const tickerOne = document.querySelector(".hopscotch_ticker.is-one");
    const tickerTwo = document.querySelector(".hopscotch_ticker.is-two");
    if (!tickerOne && !tickerTwo) return;

    const elements = [
        { selector: ".hopscotch_ticker.is-one .hopscotch_ticker-svg", container: tickerOne, reversed: false },
        { selector: ".hopscotch_ticker.is-two .hopscotch_ticker-svg", container: tickerTwo, reversed: true  },
    ];

    hopscotchTickerLoops = elements.map(({ selector, container, reversed }) => {
        const items = gsap.utils.toArray(selector);
        if (items.length === 0) return null;

        const loop = horizontalLoop(items, {
            draggable: false,
            inertia:   false,
            repeat:    -1,
            center:    false,
            reversed,
        });

        if (container) {
            const cleanup = attachBrakeHover(container, loop, {
                targetSpeed: reversed ? -1 : 1,
            });
            brakeCleanups.push(cleanup);
        }

        return loop;
    }).filter(Boolean);
}

/**
 * Destroy hopscotch tickers
 */
export function destroyTickers() {
    hopscotchTickerLoops.forEach(loop => loop?.kill?.());
    hopscotchTickerLoops = [];
}

// ─── SVG Marquee ─────────────────────────────────────────────────────────────
let marqueeTweens = [];

/**
 * Initialize SVG marquee animation
 * @param {string} className - CSS class (without dot)
 */
export function initMarqueeSVG(className) {
    const elements = document.querySelectorAll(`.${className}`);
    if (!elements.length) return;

    elements.forEach((el) => {
        if (marqueeTweens.some(t => t.targets().includes(el))) return;

        const tween = gsap.to(el, {
            x:        "-100%",
            duration: 20,
            ease:     "none",
            repeat:   -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % 100)
            }
        });

        // Brake hover on the element's parent container
        const container = el.parentElement;
        if (container) {
            const cleanup = attachBrakeHover(container, tween);
            brakeCleanups.push(cleanup);
        }

        marqueeTweens.push(tween);
    });
}

/**
 * Destroy ALL marquee tweens
 */
export function destroyMarqueeSVG() {
    marqueeTweens.forEach(tween => tween.kill());
    marqueeTweens = [];
}

// ─── Global Cleanup ───────────────────────────────────────────────────────────
/**
 * Remove all brake hover listeners (call on page transitions / teardown)
 */
export function destroyAllBrakeListeners() {
    brakeCleanups.forEach(c => c.destroy());
    brakeCleanups.length = 0;
}