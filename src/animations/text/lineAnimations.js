/**
 * Line Animations - Text reveal by lines
 */

/**
 * Initialize line-based text animations
 */
export function initLineAnimations() {
    const animatedLines = document.querySelectorAll('[data-anim-attr="animated-lines"]');

    animatedLines.forEach((element) => {
        const splitLines = new SplitText(element, { type: "chars,words,lines" });

        gsap.from(splitLines.lines, {
            opacity: 0,
            y: "80%",
            filter: "blur(10px)",
            stagger: 0.1,
            scrollTrigger: {
                trigger: element,
                start: "top 90%",
                toggleActions: "play none none none",
            }
        });
    });
}

