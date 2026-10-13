/**
 * Portfolio Sticky Filter Header - Pins the filter bar below the navbar while
 * scrolling the portfolio list. On mobile only the options row sticks (the
 * title scrolls away); on desktop the whole bar sticks.
 *
 * If a filter is tapped while scrolled past the list, the page glides back
 * to the top of the list first so the Flip reflow doesn't happen off-screen.
 */

import { isMobile } from '../../utils/isMobile.js';
import { getSmoother } from '../../core/smoothScroll.js';

const NAV_OFFSET_DESKTOP = 75;
const NAV_OFFSET_MOBILE = 72;
const SCROLL_DURATION = 0.5;

let headerTrigger = null;
let removeClickListener = null;
let scrolling = false;
let releasing = false;

function getOptionsRow(header) {
    return Array.from(header.children).find(child => child.querySelector('.filter')) || header;
}

function scrollToListStart(list, barBottom, done) {
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

/**
 * Pin the portfolio filter bar and wire up the "scroll back before filtering" behavior.
 */
export function initPortfolioStickyHeader() {
    destroyPortfolioStickyHeader();

    const header = document.querySelector('.portfolio_listing-header');
    if (!header) return;

    const items = document.querySelectorAll('.portfolio-item');
    const list = items.length ? items[0].parentElement : header.parentElement;
    const mobile = isMobile();
    const navOffset = mobile ? NAV_OFFSET_MOBILE : NAV_OFFSET_DESKTOP;
    const pinTarget = mobile ? getOptionsRow(header) : header;
    const getBarBottom = () => navOffset + pinTarget.offsetHeight;

    headerTrigger = ScrollTrigger.create({
        trigger: pinTarget,
        start: `top top+=${navOffset}`,
        endTrigger: list,
        end: () => `bottom top+=${getBarBottom()}`,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
    });

    const onFilterClick = (e) => {
        if (releasing) return;
        const filter = e.target.closest('.filter');
        if (!filter) return;

        const scrolledPastList = list.getBoundingClientRect().top < getBarBottom() - 1;
        if (!scrolledPastList) {
            requestAnimationFrame(() => headerTrigger.refresh());
            return;
        }
        if (scrolling) return;

        e.preventDefault();
        e.stopPropagation();
        scrolling = true;

        scrollToListStart(list, getBarBottom(), () => {
            scrolling = false;
            releasing = true;
            filter.click();
            releasing = false;
            requestAnimationFrame(() => headerTrigger.refresh());
        });
    };

    header.addEventListener('click', onFilterClick, true);
    removeClickListener = () => header.removeEventListener('click', onFilterClick, true);
}

/**
 * Tear down the sticky header's ScrollTrigger and listeners.
 */
export function destroyPortfolioStickyHeader() {
    if (removeClickListener) {
        removeClickListener();
        removeClickListener = null;
    }
    if (headerTrigger) {
        headerTrigger.kill(true);
        headerTrigger = null;
    }
    scrolling = false;
    releasing = false;
}
