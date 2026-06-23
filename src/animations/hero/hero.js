/**
 * Hero Animation with Floating Images
 * Shared animation for pages with image grid hero sections
 */

import { createHeroTimeline } from '../../utils/heroTimeline.js';

let heroTl = null;

export function initHeroAnimation() {
    heroTl = createHeroTimeline();

    const splitTag = new SplitText('[data-anim-attr="hero-tl-0"]', { type: "chars,words,lines" });
    const splitHeadline = new SplitText('[data-anim-attr="hero-tl-1"]', { type: "chars,words,lines" });
    const splitPara = new SplitText('[data-anim-attr="hero-tl-2"]', { type: "chars,words,lines" });
    const leftImages = ['[data-anim-attr="is-one"]', '[data-anim-attr="is-two"]', '[data-anim-attr="is-three"]'];
    const rightImages = ['[data-anim-attr="is-four"]', '[data-anim-attr="is-five"]', '[data-anim-attr="is-six"]'];

    heroTl.from(splitTag.chars, {
            opacity: 0,
            x: 16,
            y: "30%",
            filter: "blur(10px)",
            stagger: 0.02,
        })
        .from(splitHeadline.chars, {
            opacity: 0,
            x: 16,
            y: "30%",
            filter: "blur(10px)",
            stagger: 0.03,
        }, "-=0.5")
        .from(splitPara.words, {
            opacity: 0,
            x: 16,
            y: "30%",
            filter: "blur(10px)",
            stagger: 0.03,
        }, "-=0.5")
        .fromTo(leftImages, {
            x: -200,
            y: -100,
            scale: 0.5,
            rotation: -45,
            opacity: 0,
        }, {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
            stagger: 0.2
        }, "<")
        .fromTo(rightImages, {
            x: 200,
            y: -100,
            scale: 0.5,
            rotation: 45,
            opacity: 0,
        }, {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
            stagger: 0.2
        }, "-=1.3")
        .to('[data-anim-attr="scroll-down"]', {
            opacity: 1,
            duration: 1,
            ease: "power3.out"
        }, "-=1.3")
        .add(() => initHeroFloatingEffect());
}

function initHeroFloatingEffect() {
    const floatTargets = [
        { selector: '[data-anim-attr="is-one"]', xFactor: 20, yFactor: 10, rotFactor: 5 },
        { selector: '[data-anim-attr="is-two"]', xFactor: 15, yFactor: 20, rotFactor: -6 },
        { selector: '[data-anim-attr="is-three"]', xFactor: 25, yFactor: 15, rotFactor: 4 },
        { selector: '[data-anim-attr="is-four"]', xFactor: -20, yFactor: 18, rotFactor: -5 },
        { selector: '[data-anim-attr="is-five"]', xFactor: -15, yFactor: 10, rotFactor: 6 },
        { selector: '[data-anim-attr="is-six"]', xFactor: -25, yFactor: 15, rotFactor: -4 },
    ];

    const wrapper = document.querySelector('[data-anim-attr="section-hero"]');
    if (!wrapper) return;

    wrapper.addEventListener("mousemove", (e) => {
        const { clientX, clientY } = e;
        const { width, height, left, top } = wrapper.getBoundingClientRect();
        const x = (clientX - left - width / 2) / width;
        const y = (clientY - top - height / 2) / height;

        floatTargets.forEach(({ selector, xFactor, yFactor, rotFactor }) => {
            gsap.to(selector, {
                x: x * xFactor,
                y: y * yFactor,
                rotation: x * rotFactor,
                duration: 0.6,
                ease: "power2.out"
            });
        });
    });

    wrapper.addEventListener("mouseleave", () => {
        floatTargets.forEach(({ selector }) => {
            gsap.to(selector, {
                x: 0,
                y: 0,
                rotation: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        });
    });
}

export function destroyHeroAnimation() {
    if (heroTl) heroTl.kill();
}

