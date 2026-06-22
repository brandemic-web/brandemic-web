/**
 * SVG Path Drawing - Brandemic logo draw animation
 */

/**
 * Animate SVG paths with draw effect
 */
export function animateSvgPaths() {
    const paths = document.querySelectorAll('[data-anim-attr="brandemic_svg-path"]');

    paths.forEach((path) => {
        gsap.from(path, {
            duration: 2,
            drawSVG: 0,
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: path,
                start: "top 50%",
            },
        });
    });
}