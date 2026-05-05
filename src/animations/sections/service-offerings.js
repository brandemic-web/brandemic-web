import { isMobile } from '../../utils/isMobile.js';

export function servicesOfferingPin() {
    if (isMobile()) return;

    const wrapper = document.querySelector(".services_offering-wrapper");
    if (!wrapper) return;

    ScrollTrigger.create({
        trigger: ".services_offering-wrapper",
        pin: ".services_offering-heading",
        start: "top top",
        end: () => `+=${wrapper.offsetHeight - document.querySelector(".services_offering-heading").offsetHeight}`,
        pinSpacing: false,
    });
}

export function destroyServicesOfferingPin() {
    ScrollTrigger.getAll().forEach(st => {
        if (st.vars.pin === ".services_offering-heading") {
            st.kill();
        }
    });
}