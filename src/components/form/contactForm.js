/**
 * Contact Form — Freshworks CRM integration via Cloudflare Worker + reCAPTCHA v3
 *
 * Flow:
 *  1. User submits form → Webflow processes it normally (no preventDefault)
 *  2. Form data is collected synchronously on submit
 *  3. reCAPTCHA v3 token is generated (invisible, no user friction)
 *  4. Token + data sent to Cloudflare Worker (fire-and-forget)
 *  5. Worker verifies token score, then pushes to Freshworks CRM
 */

let submitHandler = null;

const WORKER_URL      = 'https://white-dream-606e.mayank-bba.workers.dev/'; // 🔧 Replace with your Worker URL
const RECAPTCHA_KEY   = '6LdUc9osAAAAAJ5DdiwM0gKwl60xPn0BVM1C2Q92';         // 🔧 Replace with your reCAPTCHA v3 site key
const RECAPTCHA_ACTION = 'contact_form_submit';

// ── Helpers ────────────────────────────────────────────────

/**
 * Safely reads a DOM element's value. Returns '' if element missing.
 */
function val(id) {
    const el = document.getElementById(id);
    if (!el) {
        console.warn('[CRM] Element not found:', id);
        return '';
    }
    return el.value || '';
}

/**
 * Collects all form data into a plain object.
 */
function collectFormData() {
    const fullName  = val('full_name').trim().split(' ');
    const firstName = fullName[0] || '';
    const lastName  = fullName.length > 1 ? fullName.slice(1).join(' ') : '\u200C\u200C';

    // Checkboxes
    const requirements = [];
    ['Branding', 'Packaging', 'UI-UX', 'Web-Development', 'SEO'].forEach(id => {
        const cb = document.getElementById(id);
        if (cb && cb.checked) {
            requirements.push(cb.getAttribute('data-name') || cb.name || id);
        }
    });

    // Radio
    const serviceEl = document.querySelector('input[name="service_company"]:checked');

    return {
        firstName,
        lastName,
        email:          val('email'),
        contactNumber:  val('contact_number'),
        company:        val('company'),
        serviceCompany: serviceEl ? serviceEl.value : '',
        requirements:   requirements.join(';'),
        projectBudget:  val('project_budget'),
        deadline:       val('project_deadline'),
        message:        val('your_message'),
        howDidYouHear:  val('how_did_you_hear'),
    };
}

// ── Public API ─────────────────────────────────────────────

/**
 * Initialize contact form: reCAPTCHA v3 + Cloudflare Worker CRM push
 */
export function initContactForm() {
    const form = document.querySelector('#wf-form-Contact-Form');
    if (!form) {
        console.warn('[CRM] Contact form not found in DOM');
        return;
    }

    submitHandler = function () {
        // ── 1. Collect data synchronously before any async work ──
        const data = collectFormData();

        // ── 2. Generate reCAPTCHA v3 token, then fire to Worker ──
        grecaptcha.ready(function () {
            grecaptcha.execute(RECAPTCHA_KEY, { action: RECAPTCHA_ACTION })
                .then(function (token) {
                    // Fire-and-forget — does not block or affect Webflow's native submission
                    fetch(WORKER_URL, {
                        method:  'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body:    JSON.stringify({ ...data, recaptchaToken: token }),
                    }).catch(err => {
                        console.error('[CRM] Worker request failed:', err);
                    });
                })
                .catch(err => {
                    console.error('[CRM] reCAPTCHA execute failed:', err);
                });
        });
    };

    form.addEventListener('submit', submitHandler);
}

/**
 * Destroy contact form: cleanup event listeners
 */
export function destroyContactForm() {
    if (submitHandler) {
        const form = document.querySelector('#wf-form-Contact-Form');
        if (form) {
            form.removeEventListener('submit', submitHandler);
        }
        submitHandler = null;
    }
}