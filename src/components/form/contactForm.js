/**
 * Contact Form - intl-tel-input and Freshworks CRM integration
 */

let itiInstance  = null;
let submitHandler = null;

const SDK_TIMEOUT_MS = 6000;  // max wait for fwcrm to be ready
const SDK_POLL_MS    = 100;   // how often to check

// ── Helpers ────────────────────────────────────────────────

/**
 * Polls until window.fwcrm is fully callable, then runs callback.
 * Runs timeoutCallback if SDK never loads within SDK_TIMEOUT_MS.
 */
function waitForFwcrm(callback, timeoutCallback) {
    const start    = Date.now();
    const interval = setInterval(() => {

        const ready = (
            typeof window.fwcrm !== 'undefined' &&
            typeof window.fwcrm.identify === 'function'
        );

        if (ready) {
            clearInterval(interval);
            callback();
            return;
        }

        if (Date.now() - start >= SDK_TIMEOUT_MS) {
            clearInterval(interval);
            console.error('[CRM] fwcrm SDK did not load within', SDK_TIMEOUT_MS, 'ms — lead not captured');
            if (typeof timeoutCallback === 'function') timeoutCallback();
        }

    }, SDK_POLL_MS);
}

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
        email:           val('email'),
        contactNumber:   val('contact_number'),
        company:         val('company'),
        serviceCompany:  serviceEl ? serviceEl.value : '',
        requirements:    requirements.join(';'),
        projectBudget:   val('project_budget'),
        deadline:        val('project_deadline'),
        message:         val('your_message'),
        howDidYouHear:   val('how_did_you_hear'),
    };
}

/**
 * Pushes data to Freshworks CRM via fwcrm.identify().
 * Logs result via success/failure callbacks.
 */
function pushToFwcrm(data) {
    fwcrm.identify(data.email, {
        'First name':              data.firstName,
        'Last name':               data.lastName,
        'Email':                   data.email,
        'Contact Number':          data.contactNumber,
        'Company Name':            data.company,
        'Company Type':            data.serviceCompany,
        'Requirement':             data.requirements,
        'Project Budget':          data.projectBudget,
        'Deadline':                data.deadline,
        'Message_new':          data.message,
        'How Did You Hear About Us': data.howDidYouHear,
    },
    // ── Success callback ──────────────────────────────────
    () => {
        console.log('[CRM] Lead pushed successfully for:', data.email);
    },
    // ── Failure callback ──────────────────────────────────
    (err) => {
        console.error('[CRM] fwcrm.identify() failed for:', data.email, '| Error:', err);
    });
}

// ── Public API ─────────────────────────────────────────────

/**
 * Initialize contact form: intl-tel-input + Freshworks CRM push
 */
export function initContactForm() {

    // TODO: intl-tel-input temporarily disabled
    // if (typeof intlTelInput !== 'undefined') {
    //     itiInstance = intlTelInput(input, {
    //         loadUtils: () => import('https://cdn.jsdelivr.net/npm/intl-tel-input@27.0.0/dist/js/utils.js'),
    //         initialCountry: 'auto',
    //         geoIpLookup: (success, failure) => {
    //             fetch('https://ipapi.co/json')
    //                 .then(res => res.json())
    //                 .then(data => success(data.country_code))
    //                 .catch(() => failure());
    //         },
    //         hiddenInput: 'full',
    //     });
    // }

    const form = document.querySelector('#wf-form-Contact-Form');
    if (!form) {
        console.warn('[CRM] Contact form not found in DOM');
        return;
    }

    submitHandler = function () {
        // ── 1. Collect data immediately on submit ─────────
        // Do this synchronously before any async work,
        // in case the DOM changes after submission.
        let data;
        try {
            data = collectFormData();
        } catch (err) {
            console.error('[CRM] Failed to collect form data:', err);
            return;
        }

        // // ── 2. Basic email sanity check ───────────────────
        // if (!data.email || !data.email.includes('@')) {
        //     console.warn('[CRM] Invalid or missing email — skipping CRM push');
        //     return;
        // }

        // ── 3. Wait for SDK, then push ────────────────────
        waitForFwcrm(
            () => {
                try {
                    pushToFwcrm(data);
                } catch (err) {
                    // Catches any unexpected runtime error inside pushToFwcrm
                    console.error('[CRM] Unexpected error during fwcrm.identify():', err);
                }
            },
            // SDK timed out
            () => {
                console.error('[CRM] SDK unavailable — lead lost for:', data.email);
                // ── Future: swap this for Cloudflare Worker fallback ──
            }
        );
    };

    form.addEventListener('submit', submitHandler);
}

/**
 * Destroy contact form: cleanup intl-tel-input and event listeners
 */
export function destroyContactForm() {
    if (itiInstance) {
        itiInstance.destroy();
        itiInstance = null;
    }

    if (submitHandler) {
        const form = document.querySelector('#wf-form-Contact-Form');
        if (form) {
            form.removeEventListener('submit', submitHandler);
        }
        submitHandler = null;
    }
}