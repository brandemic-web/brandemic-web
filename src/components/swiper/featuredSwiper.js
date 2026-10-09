/**
 * Featured Swiper - Swiper for featured projects
 */

import { lazyLoadImagesIn } from '../../utils/lazyLoadImages.js';

let featuredSwiperInstance = null;

/**
 * Initialize featured swiper
 */
export function initFeaturedSwiper() {
    featuredSwiperInstance = new Swiper('.is-featured-swiper', {
        slidesPerView: 1,
        direction: 'horizontal',
        spaceBetween: 20,
        loop: true,
        navigation: {
            nextEl: '.featured-next',
            prevEl: '.featured-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 38,
            }
        }
    });

    lazyLoadImagesIn('.is-featured-swiper');
}

/**
 * Destroy featured swiper instance
 */
export function destroyFeaturedSwiper() {
    if (featuredSwiperInstance && featuredSwiperInstance.destroy) {
        featuredSwiperInstance.destroy(true, true);
        featuredSwiperInstance = null;
        console.log("Featured swiper destroyed");
    }
}

