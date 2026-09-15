/**
 * Merch Checkout - Order summary, shipping form and Razorpay payment
 * The worker (workers/merch-checkout) sets the real price and verifies payments
 */

import { loadOrder, clearOrder, formatINR } from './orderStore.js';
import { getSmoother } from '../../core/smoothScroll.js';

const API_URL = 'https://brandemic-merch-checkout.web-455.workers.dev';
const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

const CUSTOMER_FIELDS = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];

let form = null;
let submitHandler = null;
let razorpayInstance = null;
let razorpayLoader = null;
let busy = false;
let submitLabel = '';

function q(name) {
    return document.querySelector(`[data-merch="${name}"]`);
}

function setText(name, text) {
    const el = q(name);
    if (el) el.textContent = text;
}

function toggle(name, show) {
    const el = q(name);
    if (el) el.style.display = show ? 'block' : 'none';
}

function showError(message) {
    setText('checkout-error', message);
    toggle('checkout-error', !!message);
}

function loadRazorpay() {
    if (window.Razorpay) return Promise.resolve();
    if (!razorpayLoader) {
        razorpayLoader = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = RAZORPAY_SCRIPT;
            script.onload = resolve;
            script.onerror = () => {
                razorpayLoader = null;
                reject(new Error('Could not load the payment window. Please check your connection and try again.'));
            };
            document.head.appendChild(script);
        });
    }
    return razorpayLoader;
}

async function post(path, body) {
    const res = await fetch(API_URL + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
    return data;
}

function fillSummary(order) {
    setText('summary-name', order.name);
    setText('summary-size', order.size || '');
    setText('summary-qty', order.quantity);
    setText('summary-price', formatINR(order.price));
    setText('summary-total', formatINR(order.price * order.quantity));

    const image = q('summary-image');
    if (image && order.image) {
        image.removeAttribute('srcset');
        image.src = order.image;
    }

    const link = q('summary-link');
    if (link && order.url) link.setAttribute('href', order.url);
}

function getCustomer() {
    const customer = {};
    CUSTOMER_FIELDS.forEach(field => {
        customer[field] = (form.elements[field]?.value || '').trim();
    });
    customer.phone = customer.phone.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
    return customer;
}

function validate(customer) {
    const missing = CUSTOMER_FIELDS.filter(field => !customer[field]);
    if (missing.length) return 'Please fill in all the fields.';
    if (!/^\S+@\S+\.\S+$/.test(customer.email)) return 'Please enter a valid email address.';
    if (!/^[6-9]\d{9}$/.test(customer.phone)) return 'Please enter a valid 10-digit mobile number.';
    if (!/^\d{6}$/.test(customer.pincode)) return 'Please enter a valid 6-digit pincode.';
    return '';
}

function setBusy(value) {
    busy = value;
    const button = form?.querySelector('[type="submit"]');
    if (!button) return;

    const isInput = button.tagName === 'INPUT';
    if (value) {
        submitLabel = isInput ? button.value : button.textContent;
        const waitLabel = button.dataset.wait || 'Please wait...';
        if (isInput) button.value = waitLabel; else button.textContent = waitLabel;
    } else if (submitLabel) {
        if (isInput) button.value = submitLabel; else button.textContent = submitLabel;
    }
    button.disabled = value;
}

function showSuccess(paymentId) {
    clearOrder();
    setText('success-payment-id', paymentId);

    // If the success message sits inside the content wrapper (e.g. Webflow's form "done" block),
    // keep the summary visible and hide just the form
    const content = q('checkout-content');
    const success = q('checkout-success');
    if (content && success && content.contains(success)) {
        form.style.display = 'none';
        showError('');
    } else {
        toggle('checkout-content', false);
    }
    toggle('checkout-success', true);
    getSmoother()?.scrollTo(0, true);
}

function openRazorpay(created, customer) {
    razorpayInstance = new Razorpay({
        key: created.keyId,
        order_id: created.orderId,
        amount: created.amount,
        currency: created.currency,
        name: 'Brandemic',
        description: created.description,
        prefill: { name: customer.name, email: customer.email, contact: customer.phone },
        handler: async (response) => {
            try {
                await post('/verify-payment', response);
                showSuccess(response.razorpay_payment_id);
            } catch (err) {
                showError(`We received your payment but couldn't confirm it automatically. Please contact us with payment ID ${response.razorpay_payment_id}.`);
            }
            setBusy(false);
        },
        modal: {
            ondismiss: () => setBusy(false),
        },
    });

    razorpayInstance.on('payment.failed', (response) => {
        showError(response.error?.description || 'Payment failed. Please try again.');
    });

    razorpayInstance.open();
}

async function handleSubmit(e) {
    // Stop Webflow's own form handler from submitting the address to Webflow
    e.preventDefault();
    e.stopImmediatePropagation();
    if (busy) return;

    const order = loadOrder();
    if (!order) {
        toggle('checkout-content', false);
        toggle('checkout-empty', true);
        return;
    }

    const customer = getCustomer();
    const error = validate(customer);
    showError(error);
    if (error) return;

    setBusy(true);
    try {
        const [created] = await Promise.all([
            post('/create-order', {
                slug: order.slug,
                size: order.size,
                quantity: order.quantity,
                customer,
            }),
            loadRazorpay(),
        ]);
        openRazorpay(created, customer);
    } catch (err) {
        showError(err.message);
        setBusy(false);
    }
}

export function initCheckout() {
    // Works whether the attribute is on the Form Block or the form inside it
    const formEl = q('checkout-form');
    form = formEl?.tagName === 'FORM' ? formEl : formEl?.querySelector('form');
    if (!form) return;

    showError('');
    toggle('checkout-success', false);

    const order = loadOrder();
    toggle('checkout-content', !!order);
    toggle('checkout-empty', !order);
    if (order) fillSummary(order);

    submitHandler = handleSubmit;
    form.addEventListener('submit', submitHandler, true);

    // Warm up the Razorpay script while the buyer fills the form
    if (order) loadRazorpay().catch(() => { });
}

export function destroyCheckout() {
    if (form && submitHandler) form.removeEventListener('submit', submitHandler, true);
    if (razorpayInstance) razorpayInstance.close();
    form = null;
    submitHandler = null;
    razorpayInstance = null;
    busy = false;
    submitLabel = '';
}
