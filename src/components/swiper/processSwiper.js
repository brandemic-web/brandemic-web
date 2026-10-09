/**
 * Process Swiper - Mobile swiper for process section
 */

import { isMobile } from '../../utils/isMobile.js';
import { lazyLoadImagesIn } from '../../utils/lazyLoadImages.js';

let processSwiperInstance = null;

/**
 * Initialize process swiper (mobile only)
 */
export function initProcessSwiper() {
    if (isMobile()) {
        processSwiperInstance = new Swiper('.is-process', {
            slidesPerView: 1,
            direction: 'horizontal',
            spaceBetween: 30,
            navigation: {
                nextEl: '#process-next',
                prevEl: '#process-prev',
            },
        });

        lazyLoadImagesIn('.is-process');
    }
}

/**
 * Destroy process swiper instance
 */
export function destroyProcessSwiper() {
    if (processSwiperInstance && processSwiperInstance.destroy) {
        processSwiperInstance.destroy(true, true);
        processSwiperInstance = null;
    }
}

