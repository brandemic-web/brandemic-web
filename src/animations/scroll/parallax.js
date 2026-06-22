/**
 * Parallax Effect - Smooth parallax on images
 */

import { getSmoother } from '../../core/smoothScroll.js';

/**
 * Apply parallax effect to images
 */
export function applyParallaxEffect() {
    const smoother = getSmoother();
    if (smoother) {
        smoother.effects('[data-anim-attr="parallax-image"]', { speed: "auto" });
    }
}

