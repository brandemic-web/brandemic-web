export function animateScrollingText() {
    const scrollTextWrapper = document.querySelector(".scroll_text-wrapper");
    if (!scrollTextWrapper) return;

    // Prevent double-init
    if (scrollTextWrapper.dataset.scrollInit) {
        gsap.killTweensOf(scrollTextWrapper);
    }
    scrollTextWrapper.dataset.scrollInit = "true";

    // Clone nodes instead of innerHTML to preserve listeners/avoid duplicate IDs
    const children = Array.from(scrollTextWrapper.children);
    children.forEach(child => {
        scrollTextWrapper.appendChild(child.cloneNode(true));
    });

    const originalWidth = scrollTextWrapper.scrollWidth / 2; // now doubled
    if (!originalWidth) return; // guard against hidden/empty

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