/**
 * Portfolio Page - Initialize and destroy animations
 */

// Hero
import { initHPIHeroAnimation, destroyHPIHeroAnimation } from '../animations/hero/hpiHero.js';

// Text Animations
import { initCharAnimations } from '../animations/text/charAnimations.js';

// Sections
import { visionSectionAnimation, destroyVisionSectionAnimation } from '../animations/sections/vision.js';
import { animateCTA } from '../animations/sections/cta.js';

// Filter
import { initFilterPortfolio, destroyFilterPortfolio } from '../components/filter/portfolioFilter.js';
import { initPortfolioStickyHeader, destroyPortfolioStickyHeader } from '../components/filter/portfolioStickyHeader.js';

// Scroll
import { applyParallaxEffect } from '../animations/scroll/parallax.js';
import { animateScrollingText } from '../animations/scroll/scrollingText.js';

// SVG
import { animateSvgPaths } from '../animations/svg/drawPaths.js';

/**
 * Initialize all portfolio page animations
 */
export function initPortfolioAnimations() {
    initHPIHeroAnimation();
    initCharAnimations();
    animateScrollingText();
    visionSectionAnimation();
    applyParallaxEffect();
    animateSvgPaths();
    initFilterPortfolio();
    initPortfolioStickyHeader();
    animateCTA();
}

/**
 * Destroy all portfolio page animations
 */
export function destroyPortfolioAnimations() {
    destroyHPIHeroAnimation();
    destroyVisionSectionAnimation();
    destroyFilterPortfolio();
    destroyPortfolioStickyHeader();
}

