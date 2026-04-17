/**
 * Contact Form - intl-tel-input and Freshworks CRM integration
 */

let itiInstance = null;
let submitHandler = null;

/**
 * Initialize contact form: intl-tel-input + Freshworks CRM push
 */
export function initContactForm() {
    const input = document.querySelector('#contact_number');
    if (!input) return;

    // intl-tel-input
    if (typeof intlTelInput !== 'undefined') {
        itiInstance = intlTelInput(input, {
            loadUtils: () => import('https://cdn.jsdelivr.net/npm/intl-tel-input@27.0.0/dist/js/utils.js'),
            initialCountry: 'auto',
            geoIpLookup: (success, failure) => {
                fetch('https://ipapi.co/json')
                    .then(res => res.json())
                    .then(data => success(data.country_code))
                    .catch(() => failure());
            },
            hiddenInput: 'full',
        });
    }

    // Freshworks CRM on submit
    const form = document.querySelector('#wf-form-Contact-Form');
    if (form) {
        submitHandler = function (e) {
            if (typeof fwcrm === 'undefined') return;

            try {
                const fullName = document.getElementById('full_name').value.split(' ');
                const firstName = fullName[0];
                const lastName = fullName.length > 1 ? fullName.slice(1).join(' ') : '\u200C\u200C';
                const email = document.getElementById('email').value;

                const requirements = [];
                ['Branding', 'Packaging', 'UI-UX', 'Web-Development', 'SEO'].forEach(id => {
                    const cb = document.getElementById(id);
                    if (cb && cb.checked) {
                        requirements.push(cb.getAttribute('data-name') || cb.name);
                    }
                });

                const serviceEl = document.querySelector('input[name="service_company"]:checked');

                fwcrm.identify(email, {
                    'First name': firstName,
                    'Last name': lastName,
                    Email: email,
                    'Contact Number': document.getElementById('contact_number').value,
                    'Company Name': document.getElementById('company').value,
                    'Company Type': serviceEl ? serviceEl.value : '',
                    Requirement: requirements.join(';'),
                    'Project Budget': document.getElementById('project_budget').value,
                    Deadline: document.getElementById('project_deadline').value,
                    Message: document.getElementById('your_message').value,
                    'How Did You Hear About Us': document.getElementById('how_did_you_hear').value,
                });
            } catch (err) {
                console.warn('Freshworks CRM push failed:', err);
            }
        };

        form.addEventListener('submit', submitHandler);
    }
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
