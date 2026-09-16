/**
 * Product Order - Size picker, quantity stepper and Place Order button on merch pages
 */

import { saveOrder, parsePrice, goTo, CHECKOUT_PATH } from './orderStore.js';

const MIN_QTY = 1;
const MAX_QTY = 10;

let listeners = [];
let quantity = MIN_QTY;
let selectedSize = null;

function q(name, root = document) {
    return root.querySelector(`[data-merch="${name}"]`);
}

function on(el, type, handler) {
    if (!el) return;
    el.addEventListener(type, handler);
    listeners.push({ el, type, handler });
}

function renderQuantity() {
    const valueEl = q('qty-value');
    // Don't fight the buyer while they are typing
    if (valueEl && valueEl !== document.activeElement) {
        if ('value' in valueEl) valueEl.value = quantity;
        else valueEl.textContent = quantity;
    }
    q('qty-minus')?.classList.toggle('is-disabled', quantity <= MIN_QTY);
    q('qty-plus')?.classList.toggle('is-disabled', quantity >= MAX_QTY);
}

function setQuantity(value) {
    const n = parseInt(value, 10);
    quantity = Math.min(MAX_QTY, Math.max(MIN_QTY, Number.isFinite(n) ? n : MIN_QTY));
    renderQuantity();
}

function showSizeError(show) {
    const errorEl = q('size-error');
    if (errorEl) errorEl.style.display = show ? 'block' : 'none';
}

/**
 * Product slug from the CMS template URL, e.g. /merch/pop-dealer-tee → pop-dealer-tee
 */
function getSlug() {
    return window.location.pathname.split('/').filter(Boolean).pop() || '';
}

function handlePlaceOrder(e) {
    e.preventDefault();
    e.stopPropagation(); // keep Barba from following the button's href

    const sizeButtons = document.querySelectorAll('[data-merch="size"]');
    if (sizeButtons.length && !selectedSize) {
        showSizeError(true);
        return;
    }

    const image = q('image');

    saveOrder({
        slug: getSlug(),
        url: window.location.pathname,
        name: q('name')?.textContent.trim() || document.title,
        price: parsePrice(q('price')?.textContent),
        image: image ? (image.currentSrc || image.src || '') : '',
        size: selectedSize,
        quantity,
    });

    goTo(CHECKOUT_PATH);
}

export function initProductOrder() {
    if (!q('place-order')) return;

    quantity = MIN_QTY;
    selectedSize = null;
    renderQuantity();

    on(q('qty-minus'), 'click', (e) => { e.preventDefault(); setQuantity(quantity - 1); });
    on(q('qty-plus'), 'click', (e) => { e.preventDefault(); setQuantity(quantity + 1); });

    // Typed quantity: works with a real input, or by making the text editable
    const valueEl = q('qty-value');
    if (valueEl && 'value' in valueEl) {
        on(valueEl, 'change', () => setQuantity(valueEl.value));
    } else if (valueEl) {
        valueEl.setAttribute('contenteditable', 'true');
        valueEl.setAttribute('inputmode', 'numeric');
        valueEl.setAttribute('role', 'textbox');

        on(valueEl, 'input', () => {
            const digits = valueEl.textContent.replace(/\D/g, '').slice(0, 2);
            if (digits !== valueEl.textContent) valueEl.textContent = digits;
        });
        on(valueEl, 'keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                valueEl.blur();
            }
        });
        on(valueEl, 'focus', () => {
            // Select what's there so typing replaces it
            const range = document.createRange();
            range.selectNodeContents(valueEl);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        });
        on(valueEl, 'blur', () => setQuantity(valueEl.textContent));
    }

    // Nothing is selected until the buyer picks, even if Webflow left is-active on one
    const sizeButtons = [...document.querySelectorAll('[data-merch="size"]')];
    sizeButtons.forEach(b => b.classList.remove('is-active'));
    showSizeError(false);
    sizeButtons.forEach(btn => {
        on(btn, 'click', (e) => {
            e.preventDefault();
            sizeButtons.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            selectedSize = (btn.dataset.size || btn.textContent).trim();
            showSizeError(false);
        });
    });

    on(q('place-order'), 'click', handlePlaceOrder);
}

export function destroyProductOrder() {
    listeners.forEach(({ el, type, handler }) => el.removeEventListener(type, handler));
    listeners = [];
    q('qty-value')?.removeAttribute('contenteditable');
}
