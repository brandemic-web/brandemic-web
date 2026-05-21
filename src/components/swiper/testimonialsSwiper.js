/**
 * Testimonials Swiper - Creative effect swiper for testimonials
 */

let testimonialsSwiperInstance = null;

/**
 * Initialize testimonials swiper
 */
export function initTestimonialsSwiperScripts() {
    testimonialsSwiperInstance = new Swiper('.is-testimonials', {
        slidesPerView: 1,
        direction: 'horizontal',
        centeredSlides: true,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        effect: "creative",
        creativeEffect: {
            prev: {
                shadow: true,
                translate: [0, 0, -400],
            },
            next: {
                translate: ["100%", 0, 0],
            },
        },
        navigation: {
            nextEl: '.testimonials-next',
            prevEl: '.testimonials-prev',
        },
    });
}

/**
 * Destroy testimonials swiper instance
 */
export function destroyTestimonialsSwiperScripts() {
    if (testimonialsSwiperInstance && testimonialsSwiperInstance.destroy) {
        testimonialsSwiperInstance.destroy(true, true);
        testimonialsSwiperInstance = null;
    }
}

