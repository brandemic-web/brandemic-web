/**
 * Check if the current device is mobile based on viewport width
 * @returns {boolean}
 */
export function isMobile() {
    return window.matchMedia("(max-width: 1024px)").matches;
}

