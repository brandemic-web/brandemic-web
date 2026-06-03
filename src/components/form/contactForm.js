let submitHandler = null;

const WORKER_URL       = 'https://brandemicrecaptcha.web-455.workers.dev/';
const RECAPTCHA_KEY    = '6LdUc9osAAAAAJ5DdiwM0gKwl60xPn0BVM1C2Q92';
const RECAPTCHA_ACTION = 'contact_form_submit';

function val(id) {
    const el = document.getElementById(id);
    return el ? (el.value || '') : '';
}

function collectFormData() {
    const fullName  = val('full_name').trim().split(' ');
    const firstName = fullName[0] || '';
    const lastName  = fullName.length > 1 ? fullName.slice(1).join(' ') : '\u200C\u200C';

    const requirements = [];
    ['Branding', 'Packaging', 'UI-UX', 'Web-Development', 'SEO'].forEach(id => {
        const cb = document.getElementById(id);
        if (cb && cb.checked) requirements.push(cb.getAttribute('data-name') || cb.name || id);
    });

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

export function initContactForm() {
    const form = document.querySelector('#wf-form-Contact-Form');
    if (!form) return;

    submitHandler = function () {
        const data = collectFormData();

        grecaptcha.ready(function () {
            grecaptcha.execute(RECAPTCHA_KEY, { action: RECAPTCHA_ACTION })
                .then(function (token) {
                    fetch(WORKER_URL, {
                        method:  'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body:    JSON.stringify({ ...data, recaptchaToken: token }),
                    }).catch(err => console.error('[CRM] Worker request failed:', err));
                })
                .catch(err => console.error('[CRM] reCAPTCHA execute failed:', err));
        });
    };

    form.addEventListener('submit', submitHandler);
}

export function destroyContactForm() {
    if (submitHandler) {
        const form = document.querySelector('#wf-form-Contact-Form');
        if (form) form.removeEventListener('submit', submitHandler);
        submitHandler = null;
    }
}