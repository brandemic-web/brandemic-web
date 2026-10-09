/**
 * Featured Work - Horizontal loop and FLIP animations
 */

import { horizontalLoop } from '../../utils/horizontalLoop.js';

const featuredWorkLoopHandlers = new Map();
let currentLoop = null;

/**
 * Initialize featured work horizontal loop
 */
export function featuredWorkLoop() {
    const wrapper = document.querySelector(".work_images-wrapper");
    if (!wrapper) return;

    let activeElement;
    const images = gsap.utils.toArray(".work_image");

    const loop = horizontalLoop(images, {
        draggable: true,
        inertia: false,
        repeat: -1,
        center: false,
        onChange: (element, index) => {
            activeElement && activeElement.classList.remove("active");
            element.classList.add("active");
            activeElement = element;
        },
    });

    images.forEach(image => {
        const mouseenter = () => gsap.to(loop, { timeScale: 0, ease: "power2.out", duration: 1, overwrite: true });
        const mouseleave = () => gsap.to(loop, { timeScale: 1, overwrite: true });

        image.addEventListener("mouseenter", mouseenter);
        image.addEventListener("mouseleave", mouseleave);

        featuredWorkLoopHandlers.set(image, { mouseenter, mouseleave });
    });

    currentLoop = loop;
}

/**
 * Destroy featured work loop
 */
export function destroyFeaturedWorkLoop() {
    featuredWorkLoopHandlers.forEach((handlers, image) => {
        image.removeEventListener("mouseenter", handlers.mouseenter);
        image.removeEventListener("mouseleave", handlers.mouseleave);
    });
    featuredWorkLoopHandlers.clear();

    if (currentLoop && typeof currentLoop.kill === "function") {
        currentLoop.kill();
    }
    currentLoop = null;
}

/**
 * Animate work images - lays the cards out as a normal row and starts the
 * carousel ticker once scrolled into view. No flip/title reveal choreography.
 */
export function animateWorkImages() {
    const wrapper = document.querySelector(".work_images-wrapper");
    if (!wrapper) return;

    const images = document.querySelectorAll(".work_image");

    images.forEach((img, index) => {
        img.style.zIndex = images.length - index;
    });

    ScrollTrigger.create({
        trigger: ".our-work_block",
        start: "center 75%",
        once: true,
        onEnter: () => {
            featuredWorkLoop();
        }
    });
}

