# Merch Checkout Worker

Cloudflare Worker behind the merch checkout page. It:

1. **`POST /create-order`**: looks up the product's price in the Webflow CMS by slug, multiplies it by the quantity, and creates a Razorpay order. The buyer's size, quantity and shipping address are saved in the order's **notes**, so every order in the Razorpay dashboard shows what to ship and where.
2. **`POST /verify-payment`**: checks Razorpay's payment signature before the site shows "Order confirmed".

The browser never decides the price, so buyers can't pay less by editing the page.

## One-time setup

You need a Cloudflare account (the existing `brandemicrecaptcha` worker is on one), a Razorpay account, and Webflow site access.

### 1. Fill in `wrangler.toml`

| Setting | Where to find it |
|---|---|
| `RAZORPAY_KEY_ID` | Razorpay Dashboard → Account & Settings → API Keys (use `rzp_test_…` first) |
| `WEBFLOW_COLLECTION_ID` | Webflow → CMS → Merch collection → Settings (Collection ID) |
| `WEBFLOW_PRICE_FIELD` | The **slug** of the CMS field holding the selling price (e.g. `price`) |
| `ALLOWED_ORIGINS` | Every domain the site runs on (staging + live) |

### 2. Add the secrets (never commit these)

```bash
cd workers/merch-checkout
npx wrangler login
npx wrangler secret put RAZORPAY_KEY_SECRET   # Razorpay key secret (pairs with the Key ID)
npx wrangler secret put WEBFLOW_API_TOKEN     # Webflow → Site settings → Apps & integrations → API access → token with CMS read
```

### 3. Deploy

```bash
npx wrangler deploy
```

The URL it prints must match `API_URL` in `src/components/merch/checkout.js`
(currently `https://brandemic-merch-checkout.web-455.workers.dev`).

## Going live

1. Test with `rzp_test_…` keys and Razorpay's test cards/UPI.
2. Swap to the `rzp_live_…` Key ID in `wrangler.toml` and run `npx wrangler secret put RAZORPAY_KEY_SECRET` with the live secret.
3. `npx wrangler deploy`.

In Razorpay → Account & Settings → Payment capture, make sure payments are **automatically captured**.

## Logs

```bash
npx wrangler tail
```
