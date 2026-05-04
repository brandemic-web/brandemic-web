/**
 * Scrolling Text Animation - Infinite ticker (right to left)
 */

/**
 * Create infinite ticker animation
 */
export function animateScrollingText() {
    const scrollTextWrapper = document.querySelector(".scroll_text-wrapper");
    if (!scrollTextWrapper) return;

    // Duplicate content for seamless loop
    const originalContent = scrollTextWrapper.innerHTML;
    scrollTextWrapper.innerHTML = originalContent + originalContent;

    const singleWidth = scrollTextWrapper.scrollWidth / 2;

    // Inject keyframe dynamically
    const styleId = "ticker-keyframe";
    if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
            @keyframes ticker-scroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-${singleWidth}px); }
            }
        `;
        document.head.appendChild(style);
    }

    // Apply animation
    scrollTextWrapper.style.display = "flex";
    scrollTextWrapper.style.width = "max-content";
    scrollTextWrapper.style.animation = `ticker-scroll 20s linear infinite`;
    scrollTextWrapper.style.willChange = "transform";
}