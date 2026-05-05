// src/animations/servicesOfferingPin.js

import { isMobile } from '../../utils/isMobile.js';

let servicesPinST = null;

/**
 * Initialize services offering heading pin
 */
export function servicesOfferingPin() {
    console.log("servicesOfferingPin called");
    
    if (isMobile()) {
        console.log("bailed: isMobile");
        return;
    }

    const servicesList = document.querySelector(".services-wrapper.is-services-page");
    console.log("servicesList:", servicesList);
    
    if (!servicesList) {
        console.log("bailed: servicesList not found");
        return;
    }

    console.log("creating ScrollTrigger...");
    
    servicesPinST = ScrollTrigger.create({
        trigger: ".section_services-offerings",
        start: "top top",
        end: () => `+=${servicesList.offsetHeight}`,
        pin: ".services_offering-heading",
        pinSpacing: false,
        anticipatePin: 1,
        markers: true,
    });
    
    console.log("ScrollTrigger created:", servicesPinST);
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