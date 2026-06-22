/**
 * Vision Section Animation - Our vision section with floating images
 */

let onVisionMouseMove = null;
let onVisionMouseLeave = null;
let visionTl = null;

/**
 * Initialize vision section animation
 */
export function visionSectionAnimation() {
    const visionSection = document.querySelector('[data-anim-attr="section_our-vision"]');
    if (!visionSection) return;

    const visionPara = visionSection.querySelector('[data-anim-attr="vision_para"]');
    const visionWrapper = visionSection.querySelector('[data-anim-attr="our-vision_content-wrapper"]');
    const visionButton = visionWrapper?.querySelector('.button');
    const visionImages = document.querySelectorAll('[data-anim-attr="our-vision_image"]');
    const visionLines = new SplitText(visionPara, { type: "lines" });

    visionTl = gsap.timeline({
        scrollTrigger: {
            trigger: visionSection,
            start: "top 70%",
            toggleActions: "play none none none",
        },
    });

    visionTl
        .from(visionLines.lines, {
            opacity: 0,
            y: "80%",
            filter: "blur(10px)",
            stagger: 0.1,
        })
        .from(visionImages, {
            opacity: 0,
            filter: "blur(10px)",
            stagger: 0.2,
        }, "-=0.2")
        .from(visionButton, {
            opacity: 0,
            y: "40%",
            filter: "blur(10px)",
        }, "-=0.2")
        .call(enableFloatingEffect);

    function enableFloatingEffect() {
        onVisionMouseMove = function (e) {
            const { clientX: x, clientY: y } = e;
            visionImages.forEach((image, index) => {
                const movementX = (x / window.innerWidth - 0.5) * (20 + index * 5);
                const movementY = (y / window.innerHeight - 0.5) * (20 + index * 5);
                gsap.to(image, {
                    x: movementX,
                    y: movementY,
                    duration: 0.5,
                    ease: "power2.out",
                });
            });
        };

        onVisionMouseLeave = function () {
            gsap.to(visionImages, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
            });
        };

        visionSection.addEventListener("mousemove", onVisionMouseMove);
        visionSection.addEventListener("mouseleave", onVisionMouseLeave);
    }
}

/**
 * Destroy vision section animation
 */
export function destroyVisionSectionAnimation() {
    const visionSection = document.querySelector(".section_our-vision");

    if (!visionSection) return;

    if (onVisionMouseMove) {
        visionSection.removeEventListener("mousemove", onVisionMouseMove);
    }
    if (onVisionMouseLeave) {
        visionSection.removeEventListener("mouseleave", onVisionMouseLeave);
    }

    if (visionTl) {
        visionTl.kill();
        visionTl = null;
    }
}

