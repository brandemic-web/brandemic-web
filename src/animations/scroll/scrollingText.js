export function animateScrollingText() {
    const scrollTextWrapper = document.querySelector(".scroll_text-wrapper");
    if (!scrollTextWrapper) return;

    // Measure BEFORE duplicating
    const originalWidth = scrollTextWrapper.scrollWidth;

    // Duplicate the content
    scrollTextWrapper.innerHTML += scrollTextWrapper.innerHTML;

    // Now scroll exactly one original-width's worth
    gsap.to(scrollTextWrapper, {
        x: -originalWidth,
        duration: 20,
        ease: "none",
        repeat: -1,
        modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % originalWidth)
        }
    });
}