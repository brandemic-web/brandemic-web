/**
 * Share Button - Native share or copy URL to clipboard
 */

let shareButtons = [];

const SHARE_SELECTOR = '.blog_share';

/**
 * Handle share button click
 * Uses Web Share API on supported devices, fallback to clipboard copy
 */
function handleShare(e) {
    e.preventDefault();
    
    const shareData = {
        title: document.title,
        text: document.querySelector('meta[name="description"]')?.content || '',
        url: window.location.href
    };

    // Use native share if available (primarily mobile)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        navigator.share(shareData).catch((err) => {
            // User cancelled or share failed - fallback to clipboard
            if (err.name !== 'AbortError') {
                copyToClipboard(shareData.url, e.currentTarget);
            }
        });
    } else {
        // Fallback: copy URL to clipboard
        copyToClipboard(shareData.url, e.currentTarget);
    }
}

/**
 * Copy URL to clipboard and show feedback
 */
function copyToClipboard(url, button) {
    navigator.clipboard.writeText(url).then(() => {
        showCopyFeedback(button, true);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopyFeedback(button, true);
        } catch (err) {
            showCopyFeedback(button, false);
        }
        
        document.body.removeChild(textArea);
    });
}

/**
 * Show visual feedback after copy action
 */
function showCopyFeedback(button, success) {
    // Icon buttons (e.g. the merch share SVG) only get the state class - swapping
    // their text would replace the icon
    const isIcon = button.tagName.toLowerCase() === 'svg' || button.children.length > 0;
    const originalText = button.textContent;

    if (!isIcon) button.textContent = success ? 'Link Copied!' : 'Copy Failed';
    button.classList.add(success ? 'is-copied' : 'is-copy-failed');

    setTimeout(() => {
        if (!isIcon) button.textContent = originalText;
        button.classList.remove('is-copied', 'is-copy-failed');
    }, 2000);
}

/**
 * Initialize share button functionality
 */
export function initShareButton() {
    shareButtons = document.querySelectorAll(SHARE_SELECTOR);
    
    shareButtons.forEach(button => {
        button.addEventListener('click', handleShare);
    });
}

/**
 * Destroy share button event listeners
 */
export function destroyShareButton() {
    shareButtons.forEach(button => {
        button.removeEventListener('click', handleShare);
    });
    shareButtons = [];
}
