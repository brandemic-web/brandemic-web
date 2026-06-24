/**
 * HPI Hero Animation - Generic hero page intro animation
 * Used on Portfolio and Case Study pages
 */

import { createHeroTimeline } from '../../utils/heroTimeline.js';

let heroTl = null;

/**
 * Initialize HPI hero animation
 */
export function initHPIHeroAnimation() {
    heroTl = createHeroTimeline();

    const heroHeadline = document.querySelector('[data-anim-attr="hero-timeline-1"]');
    const heroPara = document.querySelector('[data-anim-attr="hero-timeline-2"]');

    if (!heroHeadline) return;

    const splitHeroHeadline = new SplitText(heroHeadline, { type: "chars,words,lines" });
    const splitHeroPara = heroPara ? new SplitText(heroPara, { type: "chars,words,lines" }) : null;

    heroTl.from(splitHeroHeadline.chars, {
            opacity: 0,
            x: 16,
            y: "30%",
            filter: "blur(10px)",
            stagger: 0.03,
        });

    if (splitHeroPara) {
        heroTl.from(splitHeroPara.words, {
            opacity: 0,
            x: 16,
            y: "30%",
            filter: "blur(10px)",
            stagger: 0.03,
        }, "-=0.5");
    }

    heroTl.fromTo('[data-anim-attr="hero-timeline-3"]', {
        clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
    }, {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 0.8,
        ease: "power1.inOut",
    }, "-=0.2");
}

/**
 * Destroy HPI hero animation
 */
export function destroyHPIHeroAnimation() {
    if (heroTl) heroTl.kill();
}

