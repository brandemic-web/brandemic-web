/**
 * Service Hover Animation - Expandable service elements
 */

import { isMobile } from '../../utils/isMobile.js';

let serviceHoverCleanupFns = [];

/**
 * Initialize service hover animation
 */
export function serviceHoverAnimation() {
    const elements = document.querySelectorAll('[data-anim-attr="services-element"]');
    const mobile = isMobile();

    elements.forEach((element) => {
        const serviceLine = element.querySelector('[data-anim-attr="service_line"]');
        const serviceDescription = element.querySelector('[data-anim-attr="service_description"]');
        const serviceButton = element.querySelector('[data-anim-attr="service_button"]');
        const serviceImage = element.querySelector('[data-anim-attr="service_image"]');
        const serviceHeading = element.querySelector('[data-anim-attr="service_heading"]');
        const serviceNumber = element.querySelector('[data-anim-attr="service_number"]');

        element.style.height = "auto";
        let expandedHeight = element.offsetHeight;
        element.style.height = mobile ? "4.8rem" : "8.5rem";

        const floatImage = (event) => {
            const { clientX, clientY } = event;
            const { left, top, width, height } = element.getBoundingClientRect();

            let xMove = (clientX - (left + width / 2)) * 0.1;
            let yMove = (clientY - (top + height / 2)) * 0.1;

            gsap.to(serviceImage, { x: xMove, y: yMove, rotate: 12 + xMove * 0.1, duration: 0.3, ease: "power2.out" });
        };

        const onMouseEnter = () => {
            element.addEventListener("mousemove", floatImage);
            gsap.timeline({ defaults: { overwrite: true } })
                .to(element, { height: expandedHeight, backgroundColor: "#2C1387", duration: 0.5, ease: "power2.out" })
                .to(serviceHeading, { color: "#38C67F", duration: 0.5, ease: "power2.out" }, "<")
                .to(serviceNumber, { color: "#38C67F", duration: 0.5, ease: "power2.out" }, "<")
                .to(serviceImage, { opacity: 1, scale: 1, y: 0, rotate: 12, duration: 0.5, ease: "power2.out" }, "<")
                .to(serviceLine, { width: mobile ? "70%" : "100%", duration: 0.5, ease: "power2.out" }, "<")
                .to(serviceDescription, { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.1")
                .to(serviceButton, { opacity: 1, duration: 0.5, ease: "power2.out" }, "<");
            if (!mobile && window.location.pathname === "/") {
                gsap.timeline.call(() => ScrollTrigger && ScrollTrigger.refresh());
            }
        };

        const onMouseLeave = () => {
            gsap.timeline({ defaults: { overwrite: true } })
                .to(element, { height: mobile ? '4.8rem' : '8.5rem', backgroundColor: "#5431D0", duration: 0.3, ease: "power2.out" })
                .to(serviceHeading, { color: "#FEFEFE", duration: 0.3, ease: "power2.out" }, "<")
                .to(serviceNumber, { color: "#FEFEFE", duration: 0.3, ease: "power2.out" }, "<")
                .to(serviceImage, { opacity: 0, scale: 0.8, y: -10, rotate: 0, duration: 0.3, ease: "power2.out" }, "<")
                .to(serviceLine, { width: "0%", duration: 0.3, ease: "power2.out" }, "<")
                .to(serviceDescription, { opacity: 0, duration: 0 }, "<")
                .to(serviceButton, { opacity: 0, duration: 0 }, "<")
                .call(() => {
                    element.removeEventListener("mousemove", floatImage);
                    gsap.to(serviceImage, { x: 0, y: -10, rotate: 0, duration: 0 });
                    if (!mobile && window.location.pathname === "/") {
                        ScrollTrigger && ScrollTrigger.refresh();
                    }
                });
        };

        element.addEventListener("mouseenter", onMouseEnter);
        element.addEventListener("mouseleave", onMouseLeave);

        // Push cleanup function for this element
        serviceHoverCleanupFns.push(() => {
            element.removeEventListener("mouseenter", onMouseEnter);
            element.removeEventListener("mouseleave", onMouseLeave);
            element.removeEventListener("mousemove", floatImage);
        });
    });
}

/**
 * Destroy service hover animation
 */
export function destroyServiceHoverAnimation() {
    serviceHoverCleanupFns.forEach((fn) => fn());
    serviceHoverCleanupFns = [];
}

