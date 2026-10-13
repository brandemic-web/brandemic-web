/**
 * Portfolio Sticky Filter Header
 *
 * Desktop: the whole bar (title + filters) pins below the navbar via a
 * ScrollTrigger pin - safe because its natural resting position already
 * matches the pinned position, so no spacer math is involved.
 *
 * Mobile: only the filter row should stick (the title scrolls away), while
 * the portfolio list below keeps reflowing as Flip filters resize it. A real
 * ScrollTrigger pin fights that combination (ScrollSmoother's transformed
 * content + a constantly-changing list height), so instead we overlay a
 * fixed-position clone of just the filter row outside the smoothed content;
 * the real row keeps flowing normally underneath, untouched.
 *
 * In both cases, tapping a filter while scrolled past the list glides back
 * to the top of the list first so the Flip reflow isn't happening off-screen.
 */

import { isMobile } from '../../utils/isMobile.js';
import { getSmoother } from '../../core/smoothScroll.js';

const NAV_OFFSET_DESKTOP = 75;
const NAV_OFFSET_MOBILE = 72;
const MOBILE_TOP_SPACE = 12;
const SCROLL_DURATION = 0.5;

let headerTrigger = null;
let fixedCopy = null;
let cleanups = [];
let scrolling = false;
let releasing = false;

function getOptionsRow(root) {
    return Array.from(root.children).find(child => child.querySelector('.filter')) || root;
}

function getScrollables(root) {
    return Array.from(root.querySelectorAll('*')).filter(el => el.scrollWidth > el.clientWidth);
}

function syncActiveFilters(from, to) {
    const toFilters = to.querySelectorAll('.filter');
    from.querySelectorAll('.filter').forEach((filter, i) => {
        if (toFilters[i]) toFilters[i].classList.toggle('active', filter.classList.contains('active'));
    });
}

function positionCopy(header) {
    if (!fixedCopy) return;
    const rect = header.getBoundingClientRect();
    const rightGap = document.documentElement.clientWidth - rect.right;
    const ownPadding = parseFloat(getComputedStyle(header).paddingRight) || 0;
    Object.assign(fixedCopy.style, {
        top: `${NAV_OFFSET_MOBILE}px`,
        left: `${rect.left}px`,
        right: '0px',
        width: 'auto',
        paddingRight: `${ownPadding + rightGap}px`,
    });
}

// A fixed copy of just the filter row, outside the smooth-scroll container,
// so the row can stick without the real list ever being pinned.
function createCopy(header) {
    const styles = getComputedStyle(header);
    fixedCopy = header.cloneNode(true);
    fixedCopy.removeAttribute('id');
    fixedCopy.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    fixedCopy.setAttribute('aria-hidden', 'true');
    Object.assign(fixedCopy.style, {
        position: 'fixed',
        margin: '0',
        boxSizing: 'border-box',
        transform: 'none',
        paddingTop: `${MOBILE_TOP_SPACE}px`,
        zIndex: styles.zIndex === 'auto' ? '10' : styles.zIndex,
        backgroundColor: styles.backgroundColor,
        visibility: 'hidden',
    });

    // Keep only the filter row in the copy - the title scrolls with the page.
    const copyRow = getOptionsRow(fixedCopy);
    Array.from(fixedCopy.children).forEach(child => {
        if (child !== copyRow) child.style.display = 'none';
    });
    copyRow.style.marginTop = '0';

    document.body.appendChild(fixedCopy);

    // Taps on the copy's filters act on the real filters.
    const realFilters = header.querySelectorAll('.filter');
    fixedCopy.querySelectorAll('.filter').forEach((copyFilter, i) => {
        copyFilter.addEventListener('click', (e) => {
            e.preventDefault();
            if (realFilters[i]) realFilters[i].click();
        });
    });

    // Keep the copy's horizontal scroll (if the filter row overflows) in sync.
    const realRows = getScrollables(header);
    getScrollables(fixedCopy).forEach((row, i) => {
        row.addEventListener('scroll', () => {
            if (realRows[i]) realRows[i].scrollLeft = row.scrollLeft;
        }, { passive: true });
    });
}

function showCopy(header) {
    if (!fixedCopy) return;
    syncActiveFilters(header, fixedCopy);
    const realRows = getScrollables(header);
    getScrollables(fixedCopy).forEach((row, i) => {
        if (realRows[i]) row.scrollLeft = realRows[i].scrollLeft;
    });
    positionCopy(header);
    fixedCopy.style.visibility = 'visible';
}

function hideCopy() {
    if (fixedCopy) fixedCopy.style.visibility = 'hidden';
}

function getBarBottom(header) {
    const stuckHeight = fixedCopy ? fixedCopy.offsetHeight : header.offsetHeight;
    const navOffset = fixedCopy ? NAV_OFFSET_MOBILE : NAV_OFFSET_DESKTOP;
    return navOffset + stuckHeight;
}

function scrollToListStart(header, list, done) {
    const barBottom = getBarBottom(header);
    const smoother = getSmoother();

    if (smoother) {
        smoother.scrollTo(list, true, `top ${barBottom}px`);
        gsap.delayedCall(SCROLL_DURATION, done);
    } else {
        const y = window.scrollY + list.getBoundingClientRect().top - barBottom;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setTimeout(done, SCROLL_DURATION * 1000 + 150);
    }
}

function afterFilter(header) {
    if (fixedCopy) syncActiveFilters(header, fixedCopy);
    if (headerTrigger) requestAnimationFrame(() => headerTrigger.refresh());
}

/**
 * Pin/stick the portfolio filter bar and wire up the "scroll back before filtering" behavior.
 */
export function initPortfolioStickyHeader() {
    destroyPortfolioStickyHeader();

    const header = document.querySelector('.portfolio_listing-header');
    if (!header) return;

    const items = document.querySelectorAll('.portfolio-item');
    const list = items.length ? items[0].parentElement : header.parentElement;
    const mobile = isMobile();

    let settings;

    if (mobile) {
        createCopy(header);
        positionCopy(header);

        settings = {
            trigger: getOptionsRow(header),
            start: () => `top top+=${NAV_OFFSET_MOBILE + MOBILE_TOP_SPACE}`,
            onToggle: (self) => (self.isActive ? showCopy(header) : hideCopy()),
            onRefresh: () => positionCopy(header),
        };
    } else {
        settings = {
            trigger: header,
            start: () => `top top+=${NAV_OFFSET_DESKTOP}`,
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
        };
    }

    settings.endTrigger = list;
    settings.end = () => `bottom top+=${getBarBottom(header)}`;
    settings.invalidateOnRefresh = true;

    headerTrigger = ScrollTrigger.create(settings);

    const onFilterClick = (e) => {
        if (releasing) return;
        const filter = e.target.closest('.filter');
        if (!filter) return;

        const scrolledPastList = list.getBoundingClientRect().top < getBarBottom(header) - 1;
        if (!scrolledPastList) {
            requestAnimationFrame(() => afterFilter(header));
            return;
        }
        if (scrolling) return;

        e.preventDefault();
        e.stopPropagation();
        scrolling = true;

        scrollToListStart(header, list, () => {
            scrolling = false;
            releasing = true;
            filter.click();
            releasing = false;
            afterFilter(header);
        });
    };

    header.addEventListener('click', onFilterClick, true);
    cleanups.push(() => header.removeEventListener('click', onFilterClick, true));
}

/**
 * Tear down the sticky header's ScrollTrigger, clone, and listeners.
 */
export function destroyPortfolioStickyHeader() {
    cleanups.forEach(fn => fn());
    cleanups = [];
    scrolling = false;
    releasing = false;
    if (headerTrigger) {
        headerTrigger.kill(true);
        headerTrigger = null;
    }
    if (fixedCopy) {
        fixedCopy.remove();
        fixedCopy = null;
    }
}
