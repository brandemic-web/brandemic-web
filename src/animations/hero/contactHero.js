/**
 * Contact Hero Animation - Contact page hero with floating images and greeting cycle
 */

import { createHeroTimeline } from '../../utils/heroTimeline.js';

let contactHeroTl = null;
let contactCycleCall = null;

/**
 * Initialize contact hero animation
 */
export function initContactHeroAnimation() {
    contactHeroTl = createHeroTimeline();

    const splitContactHeroHeadline = new SplitText(".contact_hero-tl-1", { type: "chars,words,lines" });
    const splitContactHeroPara = new SplitText(".contact_hero-tl-2", { type: "chars,words,lines" });
    const leftImages = ['.is-one', '.is-two', '.is-three'];
    const rightImages = ['.is-four', '.is-five', '.is-six'];

    contactHeroTl.from(splitContactHeroHeadline.chars, {
            opacity: 0,
            x: 16,
            y: "30%",
            filter: "blur(10px)",
            stagger: 0.03,
        })
        .from(splitContactHeroPara.words, {
            opacity: 0,
            x: 16,
            y: "30%",
            filter: "blur(10px)",
            stagger: 0.03,
        }, "-=0.5")
        .fromTo(".contact_hero-tl-3", {
            opacity: 0,
        }, {
            opacity: 1,
            duration: 0.8,
            ease: "power1.inOut",
        }, "-=0.2")
        .fromTo(leftImages, {
            x: -200,
            y: -100,
            scale: 0.5,
            rotation: -45,
            opacity: 0,
        }, {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
            stagger: 0.2
        }, "<")
        .fromTo(rightImages, {
            x: 200,
            y: -100,
            scale: 0.5,
            rotation: 45,
            opacity: 0,
        }, {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
            stagger: 0.2
        }, "-=1.3")
        .to(".scroll-down", {
            opacity: 1,
            duration: 1,
            ease: "power3.out"
        }, "-=1.3")
        .add(() => cycleHeadingWords())
        .add(() => initContactHeroFloatingEffect());
}

/**
 * Initialize floating effect for contact hero images
 */
function initContactHeroFloatingEffect() {
    const floatTargets = [
        { selector: '.is-one', xFactor: 20, yFactor: 10, rotFactor: 5 },
        { selector: '.is-two', xFactor: 15, yFactor: 20, rotFactor: -6 },
        { selector: '.is-three', xFactor: 25, yFactor: 15, rotFactor: 4 },
        { selector: '.is-four', xFactor: -20, yFactor: 18, rotFactor: -5 },
        { selector: '.is-five', xFactor: -15, yFactor: 10, rotFactor: 6 },
        { selector: '.is-six', xFactor: -25, yFactor: 15, rotFactor: -4 },
        { selector: '.contact_hero-tl-3', xFactor: 60, yFactor: 40, rotFactor: 0 },
    ];

    const wrapper = document.querySelector(".section_contact-hero");
    if (!wrapper) return;

    wrapper.addEventListener("mousemove", (e) => {
        const { clientX, clientY } = e;
        const { width, height, left, top } = wrapper.getBoundingClientRect();
        const x = (clientX - left - width / 2) / width;
        const y = (clientY - top - height / 2) / height;

        floatTargets.forEach(({ selector, xFactor, yFactor, rotFactor }) => {
            gsap.to(selector, {
                x: x * xFactor,
                y: y * yFactor,
                rotation: x * rotFactor,
                duration: 0.6,
                ease: "power2.out"
            });
        });
    });

    wrapper.addEventListener("mouseleave", () => {
        floatTargets.forEach(({ selector }) => {
            gsap.to(selector, {
                x: 0,
                y: 0,
                rotation: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        });
    });
}

/**
 * Cycle through greeting words in different languages
 */
function cycleHeadingWords() {
    const region = document.documentElement.dataset.region;

    const baseWords = [
        "Namaste,",
        "Bonjour,",
        "Hej,",
        "Ciao,",
        "Hallo,",
        "안녕하세요,",
        "Hola,",
        "Hello,",
        "こんにちは,",
        "Marhaba,",
    ];

    // Reorder based on region
    let words;

    if (region === "india") {
        words = [
            "Namaste,",
            ...baseWords.filter(word => word !== "Namaste,")
        ];
    } 
    else if (region === "dubai") {
        words = [
            "Marhaba,",
            ...baseWords.filter(word => word !== "Marhaba,")
        ];
    } 
    else {
        words = baseWords;
    }

    const greetingText = document.querySelector("#greeting-text");
    if (!greetingText) return;

    let currentIndex = 0;

    const loop = () => {
        const nextWord = words[currentIndex];

        const charsOut = new SplitText(greetingText, { type: "chars" });

        const tl = gsap.timeline({
            onComplete: () => {
                greetingText.textContent = nextWord;

                const charsIn = new SplitText(greetingText, { type: "chars" });

                gsap.fromTo(charsIn.chars, {
                    y: 20,
                    opacity: 0,
                }, {
                    y: 0,
                    opacity: 1,
                    stagger: 0.03,
                    duration: 0.5,
                    ease: "power2.out"
                });

                currentIndex = (currentIndex + 1) % words.length;

                contactCycleCall = gsap.delayedCall(2.5, loop);
            }
        });

        tl.to(charsOut.chars, {
            y: -20,
            opacity: 0,
            stagger: 0.03,
            duration: 0.4,
            ease: "power1.in"
        });
    };

    loop();
}

/**
 * Destroy contact hero animation
 */
export function destroyContactHeroAnimation() {
    if (contactHeroTl) contactHeroTl.kill();
    if (contactCycleCall) contactCycleCall.kill();
}

