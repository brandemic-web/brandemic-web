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
 * UI wiring that has no dependency on GSAP plugins or font metrics
 * (cursor, nav, buttons). Runs as soon as the DOM is ready so the nav/menu
 * aren't stuck waiting on web fonts to finish loading before they respond.
 */
function initUI(mobile) {
    // Desktop-only features
    if (!mobile) {
        window.addEventListener("load", () => {
            ScrollTrigger.refresh();
        });

        customCursorInit();
        mouseHover();
    }
    buttonFillHover();

    // Navigation
    megaMenuToggle();
    initNavHoverAnimation();
    initSubMenuNavHover();
}

/**
 * Animation setup that relies on GSAP plugins (SplitText/ScrollTrigger) and
 * needs final font metrics to measure text correctly, so it waits on
 * document.fonts.ready.
 */
function initAnimations() {
    // Register GSAP plugins
    registerGSAPPlugins();

    // Initialize Barba.js for page transitions
    initBarba();

    // Initialize smooth scrolling
    initSmoothScroller();

    // Footer
    footerLimitless();
    copyYear();
}

/**
 * Bootstrap the application
 */
document.addEventListener("DOMContentLoaded", (event) => {
    const mobile = isMobile();

    initUI(mobile);

    document.fonts.ready.then(() => {
        initAnimations();
    });
});

