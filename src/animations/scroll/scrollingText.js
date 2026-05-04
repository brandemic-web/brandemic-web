/**
 * Scrolling Text Animation - Horizontal scroll on scroll
 */

/**
 * Animate horizontal scrolling text
 */
export function animateScrollingText() {
    const scrollTextWrapper = document.querySelector(".scroll_text-wrapper");
    if (!scrollTextWrapper) return;

    const textWidth = scrollTextWrapper.scrollWidth;

    gsap.to(scrollTextWrapper, {
        x: -textWidth + window.innerWidth,
        ease: "none",
        scrollTrigger: {
            trigger: scrollTextWrapper,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
}

