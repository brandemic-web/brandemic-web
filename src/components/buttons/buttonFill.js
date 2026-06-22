/**
 * Button Fill Hover - Radial fill effect on buttons
 */

/**
 * Initialize button fill hover effect
 */
export function buttonFillHover() {
    document.querySelectorAll('[data-anim-attr="is-fill"], [data-anim-attr="is-fill-rect"]').forEach(button => {
        const flair = button.querySelector('[data-anim-attr="button__flair"]');

        button.addEventListener("mouseenter", (e) => {
            const { left, top } = button.getBoundingClientRect();
            gsap.set(flair, {
                x: e.clientX - left,
                y: e.clientY - top,
                scale: 0
            });

            gsap.to(flair, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        button.addEventListener("mousemove", (e) => {
            const { left, top } = button.getBoundingClientRect();
            gsap.to(flair, {
                x: e.clientX - left,
                y: e.clientY - top,
                duration: 0.2,
                ease: "power3.out"
            });
        });

        button.addEventListener("mouseleave", () => {
            gsap.to(flair, {
                scale: 0,
                duration: 0.3,
                ease: "power2.inOut"
            });
        });
    });
}

