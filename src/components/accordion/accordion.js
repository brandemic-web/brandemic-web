import { isMobile } from '../../utils/isMobile.js';

let accordionListeners = [];

function initAccordion(acc, panels) {
    const mobile = isMobile();
    for (let i = 0; i < acc.length; i++) {
        const handler = function () {
            for (let j = 0; j < panels.length; j++) {
                if (j !== i) {
                    panels[j].style.maxHeight = null;
                    acc[j].classList.remove("active");
                }
            }
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            }
            else{
                panel.style.maxHeight = panel.scrollHeight + "px";
                if (typeof ScrollTrigger !== "undefined" && !mobile) {
                    ScrollTrigger.refresh();
                }
            }
            
        }
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