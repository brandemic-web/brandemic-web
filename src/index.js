/**
 * Brandemic - Main Entry Point
 * 
 * This is the main entry point for all animations and interactions.
 * The code is organized into modular components for better maintainability.
 * 
 * Structure:
 * - /core       - Core functionality (GSAP, Barba, ScrollSmoother, Webflow)
 * - /components - Reusable UI components (cursor, navigation, buttons, video, swipers)
 * - /animations - Animation modules (text, scroll, SVG, sections, hero)
 * - /pages      - Page-specific animation orchestration
 * - /footer     - Footer animations
 * - /utils      - Utility functions
 */

// Core
import { registerGSAPPlugins } from './core/gsapConfig.js';
import { initSmoothScroller } from './core/smoothScroll.js';
import { initBarba } from './core/barba.js';

// Components
import { customCursorInit, mouseHover } from './components/cursor/customCursor.js';
import { buttonFillHover } from './components/buttons/buttonFill.js';
import { megaMenuToggle } from './components/navigation/megaMenu.js';
import { initNavHoverAnimation, initSubMenuNavHover } from './components/navigation/navHover.js';

// Footer
import { footerLimitless, copyYear } from './footer/footer.js';

// Utils
import { isMobile } from './utils/isMobile.js';

/**
 * Main initialization function
 * Called when DOM is ready and fonts are loaded
 */
function init() {
    const mobile = isMobile();

    // Initialize Barba.js for page transitions
    initBarba();

    // Initialize smooth scrolling
    initSmoothScroller();

    // Desktop-only features
    if (!mobile) {
        window.addEventListener("load", () => {
            ScrollTrigger.refresh();
        });

        customCursorInit();
        mouseHover();
        buttonFillHover();
    }

    // Navigation
    megaMenuToggle();
    initNavHoverAnimation();
    initSubMenuNavHover();

    // Footer
    footerLimitless();
    copyYear();
}

/**
 * Bootstrap the application
 */
document.addEventListener("DOMContentLoaded", (event) => {
    document.fonts.ready.then(() => {
        // Register GSAP plugins
        registerGSAPPlugins();

        // Initialize the app
        init();
    });
});

