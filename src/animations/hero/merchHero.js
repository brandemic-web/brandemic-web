/**
 * Merch Hero Animation - Product intro animation for merch (CMS) pages
 * Same char/blur reveal as the other heroes, applied to the product layout
 */

import { createHeroTimeline } from '../../utils/heroTimeline.js';

let heroTl = null;
let splitTitle = null;

/**
 * Initialize Merch hero animation
 */
export function initMerchHeroAnimation() {
    heroTl = createHeroTimeline();

    const title = document.querySelector('[data-anim-attr="hero-timeline-1"]');
    const media = document.querySelector('[data-anim-attr="merch_media"]');
    const info = document.querySelector('[data-anim-attr="merch_info"]');

    if (media) {
        const [mainImage, ...rest] = media.children;
        const thumbnails = rest.flatMap(el => [...el.children]);

        heroTl.from(mainImage, {
            opacity: 0,
            y: 30,
            filter: "blur(8px)",
            duration: 1,
            ease: "power2.out",
        });

        if (thumbnails.length) {
            heroTl.from(thumbnails, {
                opacity: 0,
                y: 20,
                filter: "blur(8px)",
                stagger: 0.15,
                duration: 0.8,
                ease: "power2.out",
            }, "-=0.6");
        }
    }

    if (title) {
        splitTitle = new SplitText(title, { type: "chars,words,lines" });
        heroTl.from(splitTitle.chars, {
            opacity: 0,
            x: 16,
            y: "30%",
            filter: "blur(10px)",
            stagger: 0.03,
        }, media ? "<" : ">");
    }

    if (info) {
        // Everything in the info column except the block holding the title
        const infoItems = [...info.children].filter(el => !title || !el.contains(title));

        if (infoItems.length) {
            heroTl.from(infoItems, {
                opacity: 0,
                y: 20,
                filter: "blur(8px)",
                stagger: 0.08,
                duration: 0.8,
                ease: "power2.out",
            }, "-=0.5");
        }
    }
}

/**
 * Destroy Merch hero animation
 */
export function destroyMerchHeroAnimation() {
    if (heroTl) heroTl.kill();
    if (splitTitle) splitTitle.revert();
    heroTl = null;
    splitTitle = null;
}
