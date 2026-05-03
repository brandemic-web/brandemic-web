/**
* Barba.js Configuration - Page transitions and view management
*/

import { delay } from '../utils/delay.js';
import { isMobile } from '../utils/isMobile.js';
import { resetWebflow } from './webflow.js';
import { recreateSmoother } from './smoothScroll.js';
import { mouseHover, getScaleAnim } from '../components/cursor/customCursor.js';
import { getIsOpen, setIsOpen, getCloseMenuTimeline } from '../components/navigation/megaMenu.js';
import { footerLimitless, copyYear } from '../footer/footer.js';

// Page modules
import { initHomeAnimations, destroyHomeAnimations } from '../pages/home.js';
import { initAboutAnimations, destroyAboutAnimations } from '../pages/about.js';
import { initPortfolioAnimations, destroyPortfolioAnimations } from '../pages/portfolio.js';
import { initContactAnimations, destroyContactAnimations } from '../pages/contact.js';
import { initCaseStudyAnimations, destroyCaseStudyAnimations } from '../pages/caseStudy.js';
import { initServiceAnimations, destroyServiceAnimations } from '../pages/service.js';
import { initThankAnimations, destroyThankAnimations } from '../pages/thanks.js';
import { initBlogAnimations, destroyBlogAnimations } from '../pages/blog.js';
import { initBlogPostAnimations, destroyBlogPostAnimations } from '../pages/blogPost.js';
/**
* Get the appropriate hero animation function for a namespace
* @param {string} namespace
* @returns {Function}
*/
export function getHeroAnimationFunction(namespace) {
switch (namespace) {
case 'home':
return initHomeAnimations;
case 'about':
return initAboutAnimations;
case 'portfolio':
return initPortfolioAnimations;
case 'contact':
return initContactAnimations;
case 'case-study':
return initCaseStudyAnimations;
case 'service':
return initServiceAnimations;
case 'thanks':
return initThankAnimations;
case 'blogs':
return initBlogAnimations;
case 'blog':
return initBlogPostAnimations;
default:
return () => { }; // Fallback to no-op
}
}

/**
* Initialize Barba.js with all transitions and views
*/
export function initBarba() {
barba.init({
sync: true,
transitions: [{
async leave(data) {
const done = this.async();
const isOpen = getIsOpen();
if (isOpen) {
const closeMenuTimeline = getCloseMenuTimeline();
closeMenuTimeline.restart();
document.body.classList.remove("no-scroll");
setIsOpen(false);
}

gsap.to(data.current.container, {
opacity: 0,
filter: "blur(10px)",
duration: 0.5,
});

await delay(500);
data.current.container.remove();
done();
},
async beforeEnter(data) {
resetWebflow(data);
const mobile = isMobile();

if (!mobile) {
const scaleAnim = getScaleAnim();
let isHovering = [...document.querySelectorAll(".link-hover-ix, a")].some(
(el) => el.matches(":hover")
);

if (!isHovering && scaleAnim) {
scaleAnim.reverse();
}

mouseHover();
}

recreateSmoother();

ScrollTrigger.normalizeScroll(false);

let triggers = ScrollTrigger.getAll();
triggers.forEach(trigger => {
trigger.kill();
});

footerLimitless();
copyYear();

if (!mobile) {
document.querySelectorAll("img").forEach(img => {
if (img.complete) {
ScrollTrigger.refresh();
} else {
img.addEventListener('load', imgLoaded => ScrollTrigger.refresh());
}
});

document.addEventListener('lazyloaded', function (e) {
ScrollTrigger.refresh();
});
}
},
async enter(data) {
gsap.from(data.next.container, {
opacity: 0,
filter: "blur(10px)",
duration: 0.5,
});
},
}],
views: [{
namespace: 'home',
afterEnter(data) {
initHomeAnimations();
},
beforeLeave(data) {
destroyHomeAnimations();
},
}, {
namespace: 'about',
afterEnter(data) {
initAboutAnimations();
},
beforeLeave(data) {
destroyAboutAnimations();
},
}, {
namespace: 'portfolio',
afterEnter(data) {
initPortfolioAnimations();
},
beforeLeave(data) {
destroyPortfolioAnimations();
},
}, {
namespace: 'contact',
afterEnter(data) {
initContactAnimations();
},
beforeLeave(data) {
destroyContactAnimations();
},
}, {
namespace: 'case-study',
afterEnter(data) {
initCaseStudyAnimations();
},
beforeLeave(data) {
destroyCaseStudyAnimations();
},
}, {
namespace: 'service',
afterEnter(data) {
initServiceAnimations();
},
beforeLeave(data) {
destroyServiceAnimations();
},
}, {
namespace: 'thanks',
afterEnter(data) {
initThankAnimations();
},
beforeLeave(data) {
destroyThankAnimations();
},
}, {
namespace: 'blogs',
afterEnter(data) {
initBlogAnimations();
},
beforeLeave(data) {
destroyBlogAnimations();
},
}, {
namespace: 'blog',
afterEnter(data) {
initBlogPostAnimations();
},
beforeLeave(data) {
destroyBlogPostAnimations();
},
}]
});
}
