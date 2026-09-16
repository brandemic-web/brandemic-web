/**
 * Share Popup - Product-page share menu (WhatsApp, Facebook, X, LinkedIn, copy link)
 * Uses the device's native share sheet where available (phones), popup otherwise
 */

const TRIGGER_SELECTOR = '.share_button';
const STYLE_ID = 'brandemic-share-styles';

let triggers = [];
let popup = null;
let outsideHandler = null;
let keyHandler = null;

const NETWORKS = [
    { id: 'whatsapp', label: 'WhatsApp', url: (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}` },
    { id: 'facebook', label: 'Facebook', url: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
    { id: 'x', label: 'X', url: (u, t) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}` },
    { id: 'linkedin', label: 'LinkedIn', url: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}` },
];

function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
.brandemic-share {
    position: fixed; z-index: 10000; min-width: 190px; padding: .5rem;
    background: #141414; border: 1px solid #454545; border-radius: 10px;
    box-shadow: 0 12px 32px rgba(0,0,0,.45);
    font-family: inherit; opacity: 0; transform: translateY(-6px);
    transition: opacity .18s ease, transform .18s ease;
}
.brandemic-share.is-open { opacity: 1; transform: translateY(0); }
.brandemic-share button {
    display: flex; align-items: center; gap: .65rem; width: 100%;
    padding: .6rem .7rem; border: 0; border-radius: 7px; cursor: pointer;
    background: transparent; color: #fff; font-size: .9rem; text-align: left;
}
.brandemic-share button:hover { background: #262626; }
.brandemic-share svg { width: 17px; height: 17px; flex: none; }
.brandemic-share hr { margin: .35rem .3rem; border: 0; border-top: 1px solid #333; }
`;
    document.head.appendChild(style);
}

const ICONS = {
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.4-3.9-4.6-4.1-.1-.2-1-1.4-1-2.6s.6-1.8.8-2.1c.2-.2.5-.3.6-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.3.5-.3.3c-.1.1-.3.3-.1.6.1.3.6 1.1 1.4 1.8 1 .9 1.8 1.1 2 1.2.3.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .1 0 .6-.2 1.1Z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 3h3.1l-6.8 7.7L22 21h-6.3l-4.9-6.4L5.2 21H2l7.3-8.3L2 3h6.4l4.4 5.8L17.5 3Zm-1.1 16h1.7L7.7 4.8H5.9L16.4 19Z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.75-2.05 4 0 4.4 2.5 4.4 5.9V21h-4v-5.5c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21h-4V9Z"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
};

function shareData() {
    const name = document.querySelector('[data-merch="name"]')?.textContent.trim();
    return {
        title: name || document.title,
        text: name ? `Check out ${name} from Brandemic` : document.title,
        url: window.location.href,
    };
}

function closePopup() {
    if (!popup) return;
    popup.remove();
    popup = null;
    document.removeEventListener('click', outsideHandler, true);
    document.removeEventListener('keydown', keyHandler);
    window.removeEventListener('resize', closePopup);
}

async function copyLink(button) {
    const { url } = shareData();
    try {
        await navigator.clipboard.writeText(url);
        button.lastChild.textContent = 'Link copied!';
        setTimeout(closePopup, 900);
    } catch (e) {
        button.lastChild.textContent = 'Press Ctrl+C to copy';
    }
}

function buildPopup(trigger) {
    const { url, text } = shareData();
    popup = document.createElement('div');
    popup.className = 'brandemic-share';

    NETWORKS.forEach(network => {
        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = ICONS[network.id];
        const label = document.createElement('span');
        label.textContent = `Share on ${network.label}`;
        button.appendChild(label);
        button.addEventListener('click', () => {
            window.open(network.url(url, text), '_blank', 'noopener,width=600,height=560');
            closePopup();
        });
        popup.appendChild(button);
    });

    popup.appendChild(document.createElement('hr'));

    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.innerHTML = ICONS.link;
    const copyLabel = document.createElement('span');
    copyLabel.textContent = 'Copy link';
    copyButton.appendChild(copyLabel);
    copyButton.addEventListener('click', () => copyLink(copyButton));
    popup.appendChild(copyButton);

    document.body.appendChild(popup);

    // Keep the menu on screen, below the icon
    const box = trigger.getBoundingClientRect();
    const width = popup.offsetWidth;
    popup.style.top = `${Math.min(box.bottom + 8, window.innerHeight - popup.offsetHeight - 8)}px`;
    popup.style.left = `${Math.max(8, Math.min(box.right - width, window.innerWidth - width - 8))}px`;
    requestAnimationFrame(() => popup.classList.add('is-open'));

    outsideHandler = (e) => {
        if (!popup.contains(e.target) && !trigger.contains(e.target)) closePopup();
    };
    keyHandler = (e) => { if (e.key === 'Escape') closePopup(); };
    document.addEventListener('click', outsideHandler, true);
    document.addEventListener('keydown', keyHandler);
    window.addEventListener('resize', closePopup);
}

function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (popup) {
        closePopup();
        return;
    }

    const data = shareData();
    // Phones/tablets get the OS share sheet, like a native shopping app
    if (navigator.share && navigator.canShare?.(data)) {
        navigator.share(data).catch(() => { });
        return;
    }

    buildPopup(e.currentTarget);
}

export function initSharePopup() {
    triggers = [...document.querySelectorAll(TRIGGER_SELECTOR)];
    if (!triggers.length) return;

    injectStyles();
    triggers.forEach(trigger => {
        trigger.style.cursor = 'pointer';
        trigger.addEventListener('click', handleClick);
    });
}

export function destroySharePopup() {
    closePopup();
    triggers.forEach(trigger => trigger.removeEventListener('click', handleClick));
    triggers = [];
}
