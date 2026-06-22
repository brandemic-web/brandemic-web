/**
 * Home Hero Animation - Main homepage hero with cycling words
 */

import { createHeroTimeline } from '../../utils/heroTimeline.js';

let homeHeroTl = null;
let heroCycleCall = null;

/**
 * Initialize home hero animation
 */
export function initHomeHeroAnimation() {
    const homeHeroChars = document.querySelector('[data-anim-attr="hero_anim-chars"]');
    if (!homeHeroChars) return;

    const splitHomeHeroChars = new SplitText(homeHeroChars, { type: "chars,words,lines" });

    homeHeroTl = createHeroTimeline();

    homeHeroTl.from(splitHomeHeroChars.chars, {
            opacity: 0,
            x: 16,
            y: "30%",
            filter: "blur(10px)",
            stagger: 0.03,
        })
        .add(() => {
            gsap.delayedCall(0.8, cycleHeroHeadingWords);
        });
}

/**
 * Cycle through hero heading words
 */
function cycleHeroHeadingWords() {
    const words = [
        "Strategy", "Packaging", "Naming", "Branding", "Storytelling",
        "Experiences", "Partnerships", "Growth", "Impact", "Design"
    ];

    const headingWords = document.querySelector("#heading_keywords");
    if (!headingWords) return;

    let currentIndex = 0;

    const loopWords = () => {
        const nextWord = words[currentIndex];

        const charsOut = new SplitText(headingWords, { type: "chars" });
        const loopTl = gsap.timeline({
            onComplete: () => {
                headingWords.textContent = nextWord;
                const charsIn = new SplitText(headingWords, { type: "chars" });

                gsap.fromTo(charsIn.chars, {
                    y: 20,
                    opacity: 0,
                }, {
                    y: 0,
                    opacity: 1,
                    stagger: 0.03,
                    duration: 0.4,
                    ease: "power2.out"
                });

                currentIndex = (currentIndex + 1) % words.length;

                heroCycleCall = gsap.delayedCall(0.8, loopWords);
            }
        });

        loopTl.to(charsOut.chars, {
            y: -20,
            opacity: 0,
            stagger: 0.03,
            duration: 0.4,
            ease: "power1.in"
        });
    };

    loopWords();
}

/**
 * Destroy home hero animation
 */
export function destroyHomeHeroAnimation() {
    if (homeHeroTl) homeHeroTl.kill();
    if (heroCycleCall) heroCycleCall.kill();
}

