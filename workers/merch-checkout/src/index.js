/**
 * Brandemic Merch Checkout - Cloudflare Worker
 *
 * POST /create-order   { slug, size, quantity, customer }
 *   Looks up the product's price in the Webflow CMS (never trusts the browser),
 *   creates a Razorpay order with the shipping details in its notes.
 *
 * POST /verify-payment { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *   Checks Razorpay's signature so the site only shows success for real payments.
 *
 * Config: see wrangler.toml (vars) and README.md (secrets).
 */

const MAX_QTY = 10;
// Short so CMS price changes reach checkout quickly (Webflow allows 60+ API calls/min)
const PRODUCT_CACHE_MS = 60 * 1000;

let productCache = { at: 0, items: null };

class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export default {
    async fetch(request, env) {
        const cors = corsHeaders(request.headers.get('Origin') || '', env);

        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: cors });
        }

        try {
            if (request.method !== 'POST') throw new HttpError(404, 'Not found.');
            if (!cors['Access-Control-Allow-Origin']) throw new HttpError(403, 'Origin not allowed.');

            const body = await request.json().catch(() => {
                throw new HttpError(400, 'Invalid request.');
            });
            const path = new URL(request.url).pathname.replace(/\/+$/, '');

            if (path === '/create-order') return json(await createOrder(body, env), 200, cors);
            if (path === '/verify-payment') return json(await verifyPayment(body, env), 200, cors);
            throw new HttpError(404, 'Not found.');
        } catch (err) {
            const status = err instanceof HttpError ? err.status : 500;
            if (status === 500) console.error(err);
            const message = status === 500 ? 'Something went wrong. Please try again.' : err.message;
            return json({ error: message }, status, cors);
        }
    },
};

/* ---------- Create order ---------- */

async function createOrder(body, env) {
    const slug = String(body.slug || '').trim();
    if (!/^[a-z0-9-]{1,100}$/.test(slug)) throw new HttpError(400, 'Invalid product.');

    const quantity = Number(body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY) {
        throw new HttpError(400, 'Invalid quantity.');
    }

    const size = String(body.size || '').trim();
    if (size && !/^[A-Za-z0-9]{1,5}$/.test(size)) throw new HttpError(400, 'Invalid size.');

    const customer = cleanCustomer(body.customer);

    const product = await findProduct(slug, env);
    if (!product) throw new HttpError(404, 'This product is no longer available.');

    const amount = Math.round(product.price * 100) * quantity; // paise
    const description = `${product.name}${size ? ` (${size})` : ''} × ${quantity}`;

    const order = await razorpay('/orders', {
        amount,
        currency: 'INR',
        receipt: `merch_${Date.now()}`,
        notes: truncateNotes({
            product: product.name,
            slug,
            size: size || '-',
            quantity: String(quantity),
            unit_price: `₹${product.price}`,
            customer_name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            city: customer.city,
            state: customer.state,
            pincode: customer.pincode,
        }),
    }, env);

    return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: env.RAZORPAY_KEY_ID,
        description,
    };
}

function cleanCustomer(input) {
    const c = {};
    for (const field of ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode']) {
        c[field] = String(input?.[field] || '').trim().slice(0, 250);
        if (!c[field]) throw new HttpError(400, 'Please fill in all the fields.');
    }
    if (!/^\S+@\S+\.\S+$/.test(c.email)) throw new HttpError(400, 'Please enter a valid email address.');
    if (!/^[6-9]\d{9}$/.test(c.phone)) throw new HttpError(400, 'Please enter a valid 10-digit mobile number.');
    if (!/^\d{6}$/.test(c.pincode)) throw new HttpError(400, 'Please enter a valid 6-digit pincode.');
    return c;
}

// Razorpay allows 15 notes of up to 256 characters each
function truncateNotes(notes) {
    return Object.fromEntries(Object.entries(notes).map(([k, v]) => [k, String(v).slice(0, 250)]));
}

/* ---------- Webflow CMS price lookup ---------- */

async function getProducts(env, force = false) {
    if (!force && productCache.items && Date.now() - productCache.at < PRODUCT_CACHE_MS) {
        return productCache.items;
    }

    const items = [];
    for (let offset = 0; ;) {
        const res = await fetch(
            `https://api.webflow.com/v2/collections/${env.WEBFLOW_COLLECTION_ID}/items/live?limit=100&offset=${offset}`,
            { headers: { Authorization: `Bearer ${env.WEBFLOW_API_TOKEN}`, accept: 'application/json' } }
        );
        if (!res.ok) throw new Error(`Webflow API ${res.status}: ${await res.text()}`);

        const data = await res.json();
        items.push(...data.items);
        offset += data.items.length;
        if (!data.items.length || offset >= (data.pagination?.total ?? 0)) break;
    }

    productCache = { at: Date.now(), items };
    return items;
}

async function findProduct(slug, env) {
    const bySlug = (items) => items.find(item => item.fieldData?.slug === slug);

    // A cache miss may just be a newly published product, so refetch once
    let item = bySlug(await getProducts(env));
    if (!item) item = bySlug(await getProducts(env, true));
    if (!item) return null;

    const priceField = env.WEBFLOW_PRICE_FIELD || 'price';
    const price = parseFloat(String(item.fieldData[priceField] ?? '').replace(/[^\d.]/g, ''));
    if (!(price > 0)) throw new Error(`Product "${slug}" has no valid "${priceField}" field in the CMS`);

    return { name: item.fieldData.name || slug, price };
}

/* ---------- Razorpay ---------- */

async function razorpay(path, payload, env) {
    const res = await fetch(`https://api.razorpay.com/v1${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`),
        },
        body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`Razorpay ${res.status}: ${JSON.stringify(data)}`);
    return data;
}

async function verifyPayment(body, env) {
    const orderId = body.razorpay_order_id;
    const paymentId = body.razorpay_payment_id;
    const signature = body.razorpay_signature;

    if (![orderId, paymentId, signature].every(v => typeof v === 'string' && v)) {
        throw new HttpError(400, 'Invalid payment details.');
    }

    const expected = await hmacSha256Hex(env.RAZORPAY_KEY_SECRET, `${orderId}|${paymentId}`);
    if (!timingSafeEqual(expected, signature)) throw new HttpError(400, 'Payment verification failed.');

    return { ok: true, paymentId };
}

async function hmacSha256Hex(secret, message) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
    return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a, b) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

/* ---------- HTTP helpers ---------- */

function corsHeaders(origin, env) {
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const headers = {
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        Vary: 'Origin',
    };
    if (allowed.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
    return headers;
}

function json(data, status, headers) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...headers, 'Content-Type': 'application/json' },
    });
}
