/**
 * Blog Hero Animation - Hero intro animation for blog pages
 * Similar to HPI Hero but without image animation
 */

import { createHeroTimeline } from '../../utils/heroTimeline.js';

let heroTl = null;

/**
 * Initialize Blog hero animation
 */
export function initBlogHeroAnimation() {
    heroTl = createHeroTimeline();

    const heroHeadline = document.querySelector('[data-anim-attr="hero-timeline-1"]');
    const heroPara = document.querySelector('[data-anim-attr="hero-timeline-2"]');
    const blogCards = document.querySelectorAll('[data-anim-attr="related_blog-item"]');

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
    if (blogCards.length) {
        heroTl.from(blogCards, {
            opacity: 0,
            y: 30,
            filter: "blur(8px)",
            stagger: 0.2,
            duration: 1,
            ease: "power2.out",
        }, "-=0.3");
    }
}

/**
 * Destroy Blog hero animation
 */
export function destroyBlogHeroAnimation() {
    if (heroTl) heroTl.kill();
}

