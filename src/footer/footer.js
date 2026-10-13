/**
 * Footer Animations - Footer text animation and copyright year
 */

let limitlessSplit = null;
let limitlessTween = null;

/**
 * Animate "Think Limitless" text and footer AI elements in footer
 */
export function footerLimitless() {
    const thinkLimitless = document.querySelector('[data-anim-attr="think-limitless"]');
    if (thinkLimitless) {
        if (limitlessTween) limitlessTween.kill();
        if (limitlessSplit) limitlessSplit.revert();

        limitlessSplit = new SplitText(thinkLimitless, { type: "chars" });

        limitlessTween = gsap.from(limitlessSplit.chars, {
            y: "100%",
            stagger: 0.1,
            scrollTrigger: {
                trigger: thinkLimitless,
                start: "top 90%",
                toggleActions: "play none none none",
                markers: true,
            }
        });
    }

    const footerAiEls = document.querySelectorAll('[data-anim-attr="footer_ai"]');
    if (footerAiEls.length) {
        gsap.from(footerAiEls, {
            y: 40,
            opacity: 0,
            stagger: 0.1,
            scrollTrigger: {
                trigger: footerAiEls[0],
                start: "top 90%",
                toggleActions: "play none none none",
            }
        });
    }
}

/**
 * Set current year in copyright
 */
export function copyYear() {
    const yearSpan = document.querySelector('.copy_year');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = currentYear;
    }
}
