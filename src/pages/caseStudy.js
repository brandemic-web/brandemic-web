/**
 * Case Study Page - Initialize and destroy animations
 */

// Hero
import { initHPIHeroAnimation, destroyHPIHeroAnimation } from '../animations/hero/hpiHero.js';

// Text Animations
import { initCharAnimations } from '../animations/text/charAnimations.js';
import { initLineAnimations } from '../animations/text/lineAnimations.js';

// Sections
import { featuredWorkLoop } from '../animations/sections/featuredWork.js';
import { initHorizontalTicker, hopscotchTicker, destroyTickers, destroyHorizontalTickers, initMarqueeSVG, destroyMarqueeSVG} from '../animations/sections/ticker.js';
import { animateCTA } from '../animations/sections/cta.js';
import { animateGalleryImages } from '../animations/sections/gallery.js';

// Scroll
import { applyParallaxEffect } from '../animations/scroll/parallax.js';

// Variant animations (case-study specific)
import { initHappyFeetAnimation, destroyHappyFeetAnimation } from '../animations/sections/case-study/happyfeet.js';
import { initScreworksSVG, destroyScreworksSVG } from '../animations/sections/case-study/Screworks.js';
import { initHabitusSVG, destroyHabitusSVG } from '../animations/sections/case-study/habitus.js';
import { initGyglTextPathAnimation, destroyGyglTextPathAnimation,} from '../animations/sections/case-study/gygl.js';
import { initSkaiMarqueeSVG, destroySkaiMarqueeSVG} from '../animations/sections/case-study/skai.js';
import { initFloutRotateGroupAnimation,destroyFloutRotateGroupAnimation } from '../animations/sections/case-study/flout.js';
import { initCasePreviewIframe } from '../utils/case-preview-iframe-loader.js';
/**
 * Initialize all case study page animations
 */
export function initCaseStudyAnimations() {
    initHPIHeroAnimation();
    applyParallaxEffect();
    initCharAnimations();
    initLineAnimations();
    featuredWorkLoop();
    animateCTA();
    animateGalleryImages();

    // Variant animations (element-guarded)
    // Case Study ticker
    initHorizontalTicker(".case_studies-ticker-element", ".case_study-ticker-image");
    // LivX ticker
    initHorizontalTicker(".is-livx-texts", ".livx_ticker-text");
    hopscotchTicker();
    initHappyFeetAnimation();
    initHabitusSVG();
    initGyglTextPathAnimation();
    initFloutRotateGroupAnimation();
    initSkaiMarqueeSVG();
    initScreworksSVG();
    initMarqueeSVG('[data-anim-attr="blitz-text-svg"]');
    initMarqueeSVG('.gygl-marquee-svg');
    initCasePreviewIframe();
}

/**
 * Destroy all case study page animations
 */
export function destroyCaseStudyAnimations() {
    destroyHPIHeroAnimation();
    destroyTickers();
    destroyHorizontalTickers();
    destroyHappyFeetAnimation();
    destroyHabitusSVG();
    destroyGyglTextPathAnimation();
    destroySkaiMarqueeSVG();
    destroyFloutRotateGroupAnimation();
    destroyMarqueeSVG();
    destroyScreworksSVG();
}

