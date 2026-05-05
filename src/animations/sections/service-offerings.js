import { isMobile } from '../../utils/isMobile.js';

export function servicesOfferingPin() {
    if (isMobile()) return;

    const section = document.querySelector(".section_services-offerings");
    const heading = document.querySelector(".services_offering-heading");
    
    if (!section || !heading) return;

    ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `bottom bottom`,
        pin: heading,
        pinSpacing: false,
        anticipatePin: 1,
    });
}

export function destroyServicesOfferingPin() {
    ScrollTrigger.getAll().forEach(st => {
        if (st.vars?.pin === document.querySelector(".services_offering-heading")) {
            st.kill();
        }
    });
}