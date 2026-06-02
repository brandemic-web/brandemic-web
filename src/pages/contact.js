/**
 * Contact Page - Initialize and destroy animations
 */

// Hero
import { initContactHeroAnimation, destroyContactHeroAnimation } from '../animations/hero/contactHero.js';

// Text Animations
import { initCharAnimations } from '../animations/text/charAnimations.js';

import { initScrollArrows, destroyScrollArrows } from '../components/lottie/arrowScroll.js';

// Form
import { initContactForm, destroyContactForm } from '../components/form/contactForm.js';

/**
 * Initialize all contact page animations
 */
export function initContactAnimations() {
    initCharAnimations();
    initContactHeroAnimation();
    initScrollArrows();
    initContactForm();
}

/**
 * Destroy all contact page animations
 */
export function destroyContactAnimations() {
    destroyContactHeroAnimation();
    destroyScrollArrows();
    destroyContactForm();
}

