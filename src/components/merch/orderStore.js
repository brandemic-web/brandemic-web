/**
 * Merch Order Store - Hands the chosen product from the product page to the checkout page
 * Price here is for display only; the checkout worker looks up the real price from the CMS
 */

const STORAGE_KEY = 'brandemic_merch_order';

export const CHECKOUT_PATH = '/checkout';

export function saveOrder(order) {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
        return true;
    } catch (e) {
        return false;
    }
}

export function loadOrder() {
    try {
        const order = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
        return order && order.slug ? order : null;
    } catch (e) {
        return null;
    }
}

export function clearOrder() {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) { /* storage unavailable */ }
}

/**
 * Parse a displayed price like "₹1,199" into a number
 */
export function parsePrice(text) {
    const n = parseFloat(String(text || '').replace(/[^\d.]/g, ''));
    return Number.isFinite(n) ? n : 0;
}

export function formatINR(amount) {
    return '₹' + Number(amount || 0).toLocaleString('en-IN');
}

/**
 * Navigate with Barba when available so the page transition still plays
 */
export function goTo(path) {
    if (typeof barba !== 'undefined' && barba.go) {
        barba.go(path);
    } else {
        window.location.href = path;
    }
}
