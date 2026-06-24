/**
 * CTA Animation - Call-to-action section with text reveals
 */

import { isMobile } from '../../utils/isMobile.js';

/**
 * Animate CTA section
 */
export function animateCTA() {
    const ctaWrapper = document.querySelector('[data-anim-attr="cta_text-wrapper"]');
    if (!ctaWrapper) return;

    const mobile = isMobile();

    const allParagraphs = Array.from(ctaWrapper.querySelectorAll('[data-anim-attr="cta_paragraph"]'));
    const visibleParagraphs = allParagraphs.filter(p => {
        if (mobile && p.classList.contains('[data-visibility-attr="desktop-hidden"]')) return true;
        if (!mobile && p.classList.contains('[data-visibility-attr="mobile-hidden"]')) return true;
        if (p.classList.contains('[data-visibility-attr="desktop-hidden"]') || p.classList.contains('[data-visibility-attr="mobile-hidden"]')) return false;
        return true;
    });

    // Apply SplitText once
    const splitCtaChars = new SplitText(visibleParagraphs, { type: "chars" });
    const ctaChars = splitCtaChars.chars;
    const paragraphs = splitCtaChars.elements;

    // Select images
    const images = [
        ctaWrapper.querySelector('[data-anim-attr="cta_image-one"]'),
        ctaWrapper.querySelector('[data-anim-attr="cta_image-two"]')
    ];

    // Timeline with ScrollTrigger
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ctaWrapper,
            start: "top 70%",
            toggleActions: "play none none none",
        }
    });

    // Define animation sequence
    const sequence = [
        { textIndex: 0, imageIndex: 0 },
        { textIndex: 1 },
        { textIndex: 2 },
        { imageIndex: 1 },
        { textIndex: 3 },
        { textIndex: 4 },
        { textIndex: 5 },
    ];

    sequence.forEach(({ textIndex, imageIndex }, i) => {
        if (textIndex !== undefined && paragraphs[textIndex]) {
            tl.from(ctaChars.filter(char => char.parentElement === paragraphs[textIndex]), {
                opacity: 0,
                x: 16,
                y: "30%",
                filter: "blur(10px)",
                stagger: 0.02,
            }, i === 0 ? "+=0" : "-=0.4");
        }

        if (imageIndex !== undefined && images[imageIndex]) {
            tl.fromTo(images[imageIndex],
                { clipPath: "inset(0 100% 0 0)" },
                { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power2.out" },
                "-=0.4"
            );
        }
    });
}

