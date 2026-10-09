/**
 * Marks images inside a container as lazy/async-decoded so the browser
 * defers fetching them until they're near the viewport, instead of Swiper's
 * default of requesting every slide's image eagerly on init.
 * @param {string} containerSelector
 */
export function lazyLoadImagesIn(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
        }
    });
}
