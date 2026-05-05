/**
 * Service Page - Initialize and destroy animations
 */

// Hero
import { initHeroAnimation, destroyHeroAnimation } from '../animations/hero/hero.js';

// Text Animations
import { initCharAnimations } from '../animations/text/charAnimations.js';

// Sections
import { serviceHoverAnimation, destroyServiceHoverAnimation } from '../animations/sections/serviceHover.js';
import { serviceProcessScroll, destroyServiceProcessScroll } from '../animations/sections/process.js';

// SVG
import { animateSvgPaths } from '../animations/svg/drawPaths.js';

// Swipers
import { initFeaturedSwiper, destroyFeaturedSwiper } from '../components/swiper/featuredSwiper.js';
import { initTestimonialsSwiperScripts, destroyTestimonialsSwiperScripts } from '../components/swiper/testimonialsSwiper.js';

// FAQ
import { initAccordionComponents, destroyAccordionComponents, lineAnimation } from '../components/accordion/accordion.js';

//FeaturedWorks
import { animateWorkImages, destroyFeaturedWorkLoop } from '../animations/sections/featuredWork.js';

// Arrow Scrolling
import { initScrollArrows,destroyScrollArrows } from '../components/lottie/arrowScroll.js';
import { servicesOfferingPin, destroyServicesOfferingPin } from '../animations/sections/servicesOfferingPin.js';

/**
 * Initialize all service page animations
 */
export function initServiceAnimations() {
    initHeroAnimation();
    initScrollArrows();
    initAccordionComponents();
    lineAnimation();
    animateWorkImages();
    initCharAnimations();
    animateSvgPaths();
    initFeaturedSwiper();
    serviceProcessScroll();
    serviceHoverAnimation();
    initTestimonialsSwiperScripts();
    servicesOfferingPin();
}

/**
 * Destroy all service page animations
 */
export function destroyServiceAnimations() {
    destroyHeroAnimation();
    destroyAccordionComponents();
    destroyFeaturedSwiper();
    destroyServiceProcessScroll();
    destroyServiceHoverAnimation();
    destroyFeaturedWorkLoop();
    destroyTestimonialsSwiperScripts();
    destroyScrollArrows();
    destroyServicesOfferingPin();
}

