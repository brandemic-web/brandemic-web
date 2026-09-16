/**
 * Merch Page (CMS) - Initialize and destroy animations
 */

// Hero
import { initMerchHeroAnimation, destroyMerchHeroAnimation } from '../animations/hero/merchHero.js';

// SVG
import { animateSvgPaths } from '../animations/svg/drawPaths.js';

// Sections
import { animateCTA } from '../animations/sections/cta.js';

// Components
import { initAccordionComponents, destroyAccordionComponents, lineAnimation } from '../components/accordion/accordion.js';

// Merch
import { initProductOrder, destroyProductOrder } from '../components/merch/productOrder.js';

// Share
import { initShareButton, destroyShareButton } from '../components/share/shareButton.js';

/**
 * Initialize all merch page animations
 */
export function initMerchAnimations() {
    initMerchHeroAnimation();
    animateSvgPaths();
    animateCTA();
    initAccordionComponents();
    lineAnimation();
    initProductOrder();
    initShareButton();
}

/**
 * Destroy all merch page animations
 */
export function destroyMerchAnimations() {
    destroyMerchHeroAnimation();
    destroyAccordionComponents();
    destroyProductOrder();
    destroyShareButton();
}
