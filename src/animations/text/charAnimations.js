/**
 * Character Animations - Text reveal by characters
 */

/**
 * Initialize character-based text animations
 */
export function initCharAnimations() {
    const animatedChars = document.querySelectorAll('[data-anim-attr="animated-chars"]');

    animatedChars.forEach((element) => {
        const splitChars = new SplitText(element, { type: "chars,words,lines" });

        gsap.from(splitChars.chars, {
            opacity: 0,
            x: 16,
            y: "30%",
            filter: "blur(10px)",
            stagger: 0.03,
            scrollTrigger: {
                trigger: element,
                start: "top 90%",
                toggleActions: "play none none none",
            }
        });
    });
}

