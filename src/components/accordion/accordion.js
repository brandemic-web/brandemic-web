import { isMobile } from '../../utils/isMobile.js';

let accordionListeners = [];

function initAccordion(acc, panels) {
    const mobile = isMobile();

    for (let i = 0; i < acc.length; i++) {
        const handler = function () {
            const isActive = this.classList.contains("active");

            // Close all
            acc.forEach((el, j) => {
                el.classList.remove("active");
                panels[j].style.maxHeight = null;
            });

            // If it wasn't already open, open it
            if (!isActive) {
                this.classList.add("active");
                panels[i].style.maxHeight = panels[i].scrollHeight + "px";

                if (typeof ScrollTrigger !== "undefined" && !mobile) {
                    ScrollTrigger.refresh();
                }
            }
        };

        acc[i].addEventListener("click", handler);
        accordionListeners.push({ el: acc[i], handler });
    }
}

function destroyAccordionListeners() {
    accordionListeners.forEach(({ el, handler }) => {
        el.removeEventListener("click", handler);
    });
    accordionListeners = [];
}

export function lineAnimation() {
    gsap.fromTo(
        '[data-anim-attr="accordion"]',
        { clipPath: "polygon(0 0, 0% 0, 0% 100%, 0 100%)" },
        {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 1,
            stagger: 0.2,
            ease: "power1.out",
            scrollTrigger: {
                trigger: '[data-anim-attr="accordions"]',
                start: "top 70%",
            },
        }
    );
}


export function initAccordionComponents() {
    const accordions = document.querySelectorAll('[data-anim-attr="accordion_toggle"]');
    const panels = document.querySelectorAll('[data-anim-attr="accordion_panel"]');
    
    initAccordion(accordions, panels);

}
export function destroyAccordionComponents() {
    destroyAccordionListeners();
}