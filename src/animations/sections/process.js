/**
 * Process Section Animation - Scroll-pinned process with Observer
 */

import { isMobile } from '../../utils/isMobile.js';

let processTl = null;

/**
 * Initialize scroll pin observer for process section
 */
export function scrollPinObserver() {
    if (isMobile()) return;

    let headings = gsap.utils.toArray(".process_heading"),
        descriptions = gsap.utils.toArray(".process_description"),
        images = gsap.utils.toArray(".process_image"),
        splitHeadings = headings.map(heading =>
            new SplitText(heading, { type: "chars,words,lines", linesClass: "clip-text" })
        ),
        splitDescriptions = descriptions.map(desc =>
            new SplitText(desc, { type: "lines, words", linesClass: "clip-line" })
        ),
        currentIndex = 0,
        animating;

    splitHeadings.forEach((split, i) => {
        gsap.set(split.chars, {
            autoAlpha: i === 0 ? 1 : 0,
            yPercent: i === 0 ? 0 : 150
        });
    });

    splitDescriptions.forEach((split, i) => {
        gsap.set(split.words, {
            autoAlpha: i === 0 ? 1 : 0,
            yPercent: i === 0 ? 0 : 100
        });
    });

    images.forEach((img, i) => {
        gsap.set(img, {
            autoAlpha: i === 0 ? 1 : 0,
            rotation: i === 0 ? 5 : -5,  // degrees — use 'rotation' not 'rotate'
        });
    });

    function gotoSection(index, direction) {
        if (index < 0 || index >= headings.length) {
            intentObserver.disable();
            return;
        }

        animating = true;
        let fromTop = direction === -1,
            dFactor = fromTop ? -1 : 1,
            tl = gsap.timeline({
                defaults: { duration: 1.25, ease: "power1.inOut" },
                onComplete: () => animating = false
            });

        let currentHeadingSplit = splitHeadings[currentIndex];
        let nextHeadingSplit = splitHeadings[index];

        let currentDescSplit = splitDescriptions[currentIndex];
        let nextDescSplit = splitDescriptions[index];

        let currentImage = images[currentIndex];
        let nextImage = images[index];

        // Heading animation
        tl.to(currentHeadingSplit.chars, {
            autoAlpha: 0,
            yPercent: -150 * dFactor,
            duration: 1,
            ease: "power2",
            stagger: 0.01
        }, 0);

        tl.fromTo(nextHeadingSplit.chars, {
            autoAlpha: 0,
            yPercent: 150 * dFactor
        }, {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1,
            ease: "power2",
            stagger: 0.02
        }, 0.2);

        // Description animation
        tl.to(currentDescSplit.words, {
            autoAlpha: 0,
            yPercent: -100 * dFactor,
            duration: 0.8,
            ease: "power2",
            stagger: 0.01
        }, 0);

        tl.fromTo(nextDescSplit.words, {
            autoAlpha: 0,
            yPercent: 100 * dFactor
        }, {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.8,
            ease: "power2",
            stagger: 0.01
        }, 0.25);

        // Images animation
        tl.to(currentImage, {
            autoAlpha: 0,
            duration: 1,
            ease: "power2.inOut"
        }, 0);

        tl.fromTo(nextImage, {
            autoAlpha: 0,
        }, {
            autoAlpha: 1,
            duration: 1,
            ease: "power2.out"
        }, 0.3);

        currentIndex = index;
    }

    let intentObserver = Observer.create({
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        onDown: () => !animating && gotoSection(currentIndex - 1, -1),
        onUp: () => !animating && gotoSection(currentIndex + 1, 1),
        tolerance: 10,
        preventDefault: true,
        onEnable(self) {
            ScrollTrigger.normalizeScroll(false);
        },
        onDisable(self) {
            ScrollTrigger.normalizeScroll(true);
        }
    });
    intentObserver.disable();

    ScrollTrigger.create({
        trigger: ".section_process-desktop",
        pin: true,
        start: "top top",
        end: "+=10",
        onEnter: (self) => {
            if (intentObserver.isEnabled) { return; }
            self.scroll(self.start + 1);
            intentObserver.enable();
        },
        onEnterBack: (self) => {
            if (intentObserver.isEnabled) { return; }
            self.scroll(self.end - 1);
            intentObserver.enable();
        },
    });
}

/**
 * Destroy scroll pin observer
 */
export function destroyScrollPinObserver() {
    Observer.getAll().forEach(observer => {
        observer.kill();
    });
}

/**
 * Initialize service process horizontal scroll
 */
export function serviceProcessScroll() {
    if (isMobile()) return;

    let processWrapper = document.querySelector(".service_process-contents");
    if (!processWrapper) return;

    processTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".section-service-process",
            start: "center center",
            end: "+=1500",
            scrub: true,
            pin: true,
            anticipatePin: 1
        },
        defaults: { ease: "none" }
    });

    processTl.fromTo(processWrapper, { x: 0 }, { x: -(processWrapper.offsetWidth - 1248) });
}

/**
 * Destroy service process scroll
 */
export function destroyServiceProcessScroll() {
    if (processTl) {
        processTl.kill();
        processTl = null;
    }
}

// Add to src/animations/sections/process.js

let servicesPinST = null;

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

export function destroyServicesOfferingPin() {
    if (servicesPinST) {
        servicesPinST.kill();
        servicesPinST = null;
    }
}