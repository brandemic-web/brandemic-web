/**
 * Checkout Hero Animation - Page reveal and heading char reveal on the checkout page
 */

import { createHeroTimeline } from '../../utils/heroTimeline.js';

let heroTl = null;
let splitTitle = null;

/**
 * Initialize checkout hero animation
 */
export function initCheckoutHeroAnimation() {
    heroTl = createHeroTimeline();

    const title = document.querySelector('[data-anim-attr="hero-timeline-1"]');
    if (title) {
        splitTitle = new SplitText(title, { type: "chars,words,lines" });
        heroTl.from(splitTitle.chars, {
            opacity: 0,
            x: 16,
            y: "30%",
            filter: "blur(10px)",
            stagger: 0.03,
        });
    }
}

/**
 * Destroy checkout hero animation
 */
export function destroyCheckoutHeroAnimation() {
    if (heroTl) heroTl.kill();
    if (splitTitle) splitTitle.revert();
    heroTl = null;
    splitTitle = null;
}
