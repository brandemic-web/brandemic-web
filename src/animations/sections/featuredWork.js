/**
 * Featured Work - Horizontal loop and FLIP animations
 */

import { horizontalLoop } from '../../utils/horizontalLoop.js';

const featuredWorkLoopHandlers = new Map();

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
}

/**
 * Animate work images with FLIP
 */
export function animateWorkImages() {
    const wrapper = document.querySelector(".work_images-wrapper");
    if (!wrapper) return;

    const images = document.querySelectorAll(".work_image");
    const firstImage = images[0];
    const secondImage = images[1];
    const title = document.querySelector(".our-work_title");
    const titleWrapper = document.querySelector(".our-work_title-wrapper");

    images.forEach((img, index) => {
        img.style.zIndex = images.length - index;
    });

    const flipImages = Array.from(images).slice(0, 10);
    const restImages = Array.from(images).slice(10);

    gsap.set(firstImage, { rotation: 6 });
    gsap.set(secondImage, { rotation: 3 });
    gsap.set(restImages, { autoAlpha: 0 });

    ScrollTrigger.create({
        trigger: ".our-work_block",
        start: "center 75%",
        once: true,
        onEnter: () => {
            const worksTl = gsap.timeline();

            worksTl.to(title, {
                y: "-100%",
                duration: 1,
                ease: "power1.out"
            })
                .to([firstImage, secondImage], {
                    rotation: 0,
                    duration: 1,
                    ease: "power1.out"
                }, "<")
                .set(title, { autoAlpha: 0 })
                .set(titleWrapper, { autoAlpha: 0 })
                .add(() => {
                    const state = Flip.getState(flipImages);
                    wrapper.classList.add("flex-layout");

                    Flip.from(state, {
                        duration: 1,
                        ease: "power1.out",
                        stagger: 0.05,
                        onComplete: () => {
                            gsap.set(restImages, { autoAlpha: 1 });
                            featuredWorkLoop();
                        }
                    });
                });
        }
    });
}

