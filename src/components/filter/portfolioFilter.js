/**
 * Portfolio Filter - FLIP-based filtering for portfolio items
 */

import { isMobile } from '../../utils/isMobile.js';

let filterPortfolioCleanupFns = [];

/**
 * Initialize portfolio filter
 */
export function initFilterPortfolio() {
    const filters = gsap.utils.toArray('.filter');
    const items = gsap.utils.toArray('.portfolio-item');

    const getActiveCategories = () => {
        return filters
            .filter(filter => filter.classList.contains('active'))
            .map(filter => filter.id);
    };

    const filterItems = () => {
        const mobile = isMobile();
        const activeCategories = getActiveCategories();
        const state = Flip.getState(items);

        items.forEach(item => {
            const categoryElements = item.querySelectorAll('.category');
            const itemCategories = Array.from(categoryElements).map(el => el.textContent.trim().toLowerCase());
            const isFeaturedOnSharkTank = !!item.querySelector('.featured_on_sharktank_wrapper');

            const matches = activeCategories.some(cat => {
                if (cat === 'featured_shark_tank') return isFeaturedOnSharkTank;
                return itemCategories.includes(cat);
            });
            const shouldShow = activeCategories.length === 0 || activeCategories.length === filters.length || matches;

            item.style.display = shouldShow ? 'block' : 'none';
        });

        Flip.from(state, {
            duration: 0.7,
            scale: true,
            ease: "power1.inOut",
            stagger: 0.08,
            absoluteOnLeave: true,
            onEnter: elements => gsap.fromTo(elements, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 1 }),
            onLeave: elements => gsap.to(elements, { opacity: 0, scale: 0, duration: 1 })
        });

        if (!mobile) {
            ScrollTrigger.refresh();
        }
    };

    filters.forEach(filter => {
        const handleFilterClick = () => {
            filter.classList.toggle('active');
            filterItems();
        };

        filter.addEventListener('click', handleFilterClick);
        filterPortfolioCleanupFns.push(() => filter.removeEventListener('click', handleFilterClick));
    });

    // Initial display: all items shown, filters inactive
    filters.forEach(filter => filter.classList.remove('active'));
    filterItems();
}

/**
 * Destroy portfolio filter listeners
 */
export function destroyFilterPortfolio() {
    filterPortfolioCleanupFns.forEach(fn => fn());
    filterPortfolioCleanupFns = [];
}

