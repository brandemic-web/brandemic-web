// src/animations/servicesOfferingPin.js

import { isMobile } from '../../utils/isMobile.js';

let servicesPinST = null;

/**
 * Initialize services offering heading pin
 */
export function servicesOfferingPin() {
    if (isMobile()) return;

    const servicesList = document.querySelector(".services-wrapper.is-services-page");
    if (!servicesList) return;

    servicesPinST = ScrollTrigger.create({
        trigger: ".section_services-offerings",
        start: "top top",
        end: () => `+=${servicesList.offsetHeight}`,
        pin: ".services_offering-heading",
        pinSpacing: false,
        anticipatePin: 1,
    });
}

/**
 * Destroy services offering heading pin
 */
export function destroyServicesOfferingPin() {
    if (servicesPinST) {
        servicesPinST.kill();
        servicesPinST = null;
    }
}