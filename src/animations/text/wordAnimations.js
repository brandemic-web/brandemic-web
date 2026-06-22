/**
 * Word Animations - Text reveal by words
 */

/**
 * Initialize word-based text animations
 */
export function initWordAnimations() {
    const animatedWords = document.querySelectorAll('[data-anim-attr="animated-words"]');

    animatedWords.forEach((element) => {
        const splitWords = new SplitText(element, { type: "chars,words,lines" });

        gsap.from(splitWords.words, {
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

