/**
 * Navigation Hover Animations - Link hover effects
 */

/**
 * Initialize sub navigation hover animation
 */
export function initNavHoverAnimation() {
    const allBlocks = document.querySelectorAll('.nav_link-block');
    
    allBlocks.forEach(block => {
        const arrow = block.querySelector('.nav_arrow-icon');
        const link = block.querySelector('.nav_link');

        block.addEventListener('mouseenter', () => {
            // Fade out other blocks
            allBlocks.forEach(otherBlock => {
                if (otherBlock !== block) {
                    gsap.to(otherBlock, { opacity: 0.4, duration: 0.3, overwrite: true });
                }
            });

            // Animate current block
            gsap.to(arrow, { opacity: 1, x: 0, duration: 0.3 });
            gsap.to(link, { left: 30, opacity: 1, duration: 0.3 });
        });

        block.addEventListener('mouseleave', () => {
            // Restore opacity to all blocks
            allBlocks.forEach(otherBlock => {
                gsap.to(otherBlock, { opacity: 1, duration: 0.3 });
            });

            // Reset current block
            gsap.to(arrow, { opacity: 0, x: -30, duration: 0.3 });
            gsap.to(link, { left: 0, duration: 0.3 });
        });
    });
}

/**
 * Initialize sub-menu navigation hover (dropdown blocks, e.g. Services)
 * Supports any number of dropdown blocks. `.nav_link-block-dropdown` is the
 * generic class; `.nav_link-block-services` is kept for backwards compatibility.
 */
export function initSubMenuNavHover() {
    const dropdownBlocks = document.querySelectorAll('.nav_link-block-dropdown, .nav_link-block-services');
    if (!dropdownBlocks.length) return;

    const allBlocks = document.querySelectorAll('.nav_link-block');

    dropdownBlocks.forEach(dropdownBlock => {
        const arrow = dropdownBlock.querySelector('.nav_arrow-icon');
        const subNavWrapper = dropdownBlock.querySelector('.sub_nav-wrapper');
        const subNav = dropdownBlock.querySelector('.nav_link');
        if (!subNavWrapper) return;
        const subNavLinks = subNavWrapper.querySelectorAll('.sub_nav-link');

        dropdownBlock.addEventListener('mouseenter', () => {
            // Fade out other blocks
            allBlocks.forEach(otherBlock => {
                if (otherBlock !== dropdownBlock) {
                    gsap.to(otherBlock, { opacity: 0.4, duration: 0.3, overwrite: true });
                }
            });

            gsap.to(arrow, { opacity: 1, x: 0, duration: 0.3 });
            gsap.set(subNavLinks, { x: -20, opacity: 0, display: "block" });
            gsap.to(subNav, { left: 30, opacity: 1, duration: 0.3 });
            gsap.to(subNavLinks, {
                x: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                overwrite: true,
            });
        });

        dropdownBlock.addEventListener('mouseleave', () => {
            // Restore opacity to all blocks
            allBlocks.forEach(otherBlock => {
                gsap.to(otherBlock, { opacity: 1, duration: 0.3 });
            });

            gsap.to(arrow, { opacity: 0, x: -30, duration: 0.3 });
            gsap.to(subNav, { left: 0, duration: 0.3 });
            gsap.to(subNavLinks, {
                x: -20,
                opacity: 0,
                duration: 0.3,
                stagger: { each: 0.05, from: "end" },
                ease: "power2.out",
                overwrite: true,
                onComplete: () => {
                    gsap.set(subNavLinks, { display: "none" });
                }
            });
        });

        // Add hover effect for individual submenu items
        subNavLinks.forEach(subLink => {
            subLink.addEventListener('mouseenter', () => {
                // Fade out other submenu links
                subNavLinks.forEach(otherLink => {
                    if (otherLink !== subLink) {
                        gsap.to(otherLink, { opacity: 0.4, duration: 0.3 });
                    }
                });
            });

            subLink.addEventListener('mouseleave', () => {
                // Restore opacity to all submenu links
                subNavLinks.forEach(otherLink => {
                    gsap.to(otherLink, { opacity: 1, duration: 0.3 });
                });
            });
        });
    });
}
