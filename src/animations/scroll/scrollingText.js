/**
 * Scrolling Text Animation - Horizontal scroll on scroll
 */

/**
 * Animate horizontal scrolling text
 */
export function animateScrollingText() {
    const scrollTextWrapper = document.querySelector(".scroll_text-wrapper");
    if (!scrollTextWrapper) return;

    // Clone children to create seamless loop
    const children = Array.from(scrollTextWrapper.children);
    children.forEach(child => {
        const clone = child.cloneNode(true);
        scrollTextWrapper.appendChild(clone);
    });

    const singleSetWidth = scrollTextWrapper.scrollWidth / 2;

    gsap.to(scrollTextWrapper, {
        x: -singleSetWidth,
        duration: 20,
        ease: "none",
        repeat: -1,
        modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % singleSetWidth)
        }
    });
}

