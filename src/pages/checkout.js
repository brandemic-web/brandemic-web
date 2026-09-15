/**
 * Checkout Page - Initialize and destroy animations
 */

// Hero
import { initCheckoutHeroAnimation, destroyCheckoutHeroAnimation } from '../animations/hero/checkoutHero.js';

// Merch
import { initCheckout, destroyCheckout } from '../components/merch/checkout.js';

/**
 * Initialize all checkout page animations
 */
export function initCheckoutAnimations() {
    initCheckoutHeroAnimation();
    initCheckout();
}

/**
 * Destroy all checkout page animations
 */
export function destroyCheckoutAnimations() {
    destroyCheckoutHeroAnimation();
    destroyCheckout();
}
