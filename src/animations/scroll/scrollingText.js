/**
 * Scrolling Text Animation - Continuous auto-scroll (marquee)
 */

/**
 * Animate horizontal scrolling text continuously
 */
export function animateScrollingText() {
    const scrollTextWrapper = document.querySelector(".scroll_text-wrapper");
    if (!scrollTextWrapper) return;

    const textWidth = scrollTextWrapper.scrollWidth / 2; // Half if content is duplicated

    gsap.to(scrollTextWrapper, {
        x: -textWidth,
        duration: 20, // Adjust speed: lower = faster
        ease: "none",
        repeat: -1, // Infinite loop
        modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % textWidth) // Seamless wrap
        }
    });
}