/**
 * Tools Swiper - Coverflow effect swiper for tools section
 */

import { lazyLoadImagesIn } from '../../utils/lazyLoadImages.js';

let toolsSwiperInstance = null;

/**
 * Initialize tools swiper
 */
export function initToolsSwiperScripts() {
    toolsSwiperInstance = new Swiper('.is-tools', {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        coverflowEffect: {
            rotate: 50,
            stretch: 50,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
    });

    lazyLoadImagesIn('.is-tools');
}

/**
 * Destroy tools swiper instance
 */
export function destroyToolsSwiperScripts() {
    if (toolsSwiperInstance && toolsSwiperInstance.destroy) {
        toolsSwiperInstance.destroy(true, true);
        toolsSwiperInstance = null;
    }
}

