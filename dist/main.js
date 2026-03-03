/**
 * Brandemic - Custom Animations
 * Version: 1.0.0
 * Built: 2026-03-03T07:54:58.184Z
 * 
 * This file is auto-generated from modular source code.
 * Do not edit directly - edit the source files in /src instead.
 */
(function () {
    'use strict';

    /**
     * GSAP Configuration - Register all GSAP plugins
     */

    // Note: gsap and plugins are loaded via CDN in Webflow
    // This function registers all the plugins we use
    function registerGSAPPlugins() {
        gsap.registerPlugin(
            ScrollTrigger,
            ScrollSmoother,
            DrawSVGPlugin,
            SplitText,
            Draggable,
            Flip,
            Observer
        );
    }

    /**
     * Smooth Scroll - ScrollSmoother initialization
     */

    // Global smoother instance
    let smoother = null;

    /**
     * Initialize ScrollSmoother
     */
    function initSmoothScroller() {
        smoother = ScrollSmoother.create({
            wrapper: '#smooth-wrapper',
            content: '#smooth-content',
            smooth: 1,
            effects: true,
            smoothTouch: 0,
        });
    }

    /**
     * Get the current smoother instance
     * @returns {ScrollSmoother}
     */
    function getSmoother() {
        return smoother;
    }

    /**
     * Recreate smoother instance (used in Barba transitions)
     */
    function recreateSmoother() {
        smoother = ScrollSmoother.get();
        smoother.scrollTo(0);
        smoother.kill();
        smoother = ScrollSmoother.create({
            smooth: 1,
            effects: true,
            smoothTouch: 0,
        });
        return smoother;
    }

    /**
     * Delay utility - returns a promise that resolves after n milliseconds
     * @param {number} n - Delay in milliseconds (default: 2000)
     * @returns {Promise}
     */
    function delay(n) {
        n = n || 2000;

        return new Promise(done => {
            setTimeout(() => {
                done();
            }, n);
        });
    }

    /**
     * Check if the current device is mobile based on viewport width
     * @returns {boolean}
     */
    function isMobile() {
        return window.matchMedia("(max-width: 768px)").matches;
    }

    /**
     * Webflow Reset - Reinitialize Webflow after Barba page transitions
     */

    /**
     * Reset Webflow interactions after page transition
     * @param {Object} data - Barba transition data
     */
    function resetWebflow(data) {
        let parser = new DOMParser();
        let dom = parser.parseFromString(data.next.html, "text/html");
        let webflowPageId = $(dom).find("html").attr("data-wf-page");
        $("html").attr("data-wf-page", webflowPageId);
        window.Webflow && window.Webflow.destroy();
        window.Webflow && window.Webflow.ready();
        window.Webflow && window.Webflow.require("ix2").init();
    }

    /**
     * Custom Cursor - Mouse follow animations
     */

    let isVisible = false;
    let xCTo = null;
    let yCTo = null;
    let scaleAnim = null;
    let targets = [];

    /**
     * Initialize custom cursor
     */
    function customCursorInit() {
        gsap.set('.inner-dot', { width: "1rem", height: "1rem" });
        isVisible = false;
        document.addEventListener("mousemove", mouseMove);

        xCTo = gsap.quickTo(".inner-dot", "left", {
            duration: 0.6,
            ease: "power3"
        });
        yCTo = gsap.quickTo(".inner-dot", "top", {
            duration: 0.6,
            ease: "power3"
        });

        scaleAnim = gsap.timeline({ paused: true });

        scaleAnim.to(".inner-dot", {
            width: "3rem",
            height: "3rem",
            duration: 0.3,
        });

        document.querySelector(".page-wrapper").addEventListener("mouseenter", () => {
            gsap.to(".inner-dot", { opacity: 1, duration: 0.3 });
        });

        document.querySelector(".page-wrapper").addEventListener("mouseleave", () => {
            gsap.to(".inner-dot", { opacity: 0, duration: 0.3 });
        });
    }

    /**
     * Handle mouse movement
     * @param {MouseEvent} e 
     */
    function mouseMove(e) {
        if (!isVisible) {
            gsap.set(".inner-dot", { opacity: 1 });
            isVisible = true;
        }

        const cursorPosition = {
            left: e.clientX,
            top: e.clientY
        };

        xCTo(cursorPosition.left);
        yCTo(cursorPosition.top);
    }

    /**
     * Initialize mouse hover effect on links
     */
    function mouseHover() {
        targets = gsap.utils.toArray(".link-hover-ix, a");
        targets.forEach((target) => {
            target.addEventListener("mouseenter", handleMouseEnter);
            target.addEventListener("mouseleave", handleMouseLeave);
        });
    }

    function handleMouseEnter() {
        if (scaleAnim) scaleAnim.play();
    }

    function handleMouseLeave() {
        if (scaleAnim) scaleAnim.reverse();
    }

    /**
     * Get the scale animation timeline (used for Barba transitions)
     * @returns {gsap.core.Timeline}
     */
    function getScaleAnim() {
        return scaleAnim;
    }

    /**
     * Mega Menu - Toggle animation for hamburger menu
     */

    let isOpen = false;
    let isAnimating = false;
    let openMenuTimeline = null;
    let closeMenuTimeline = null;

    /**
     * Initialize mega menu toggle
     */
    function megaMenuToggle() {
        const hamburgerLink = document.querySelector(".hamburger_link");
        const megaMenu = document.querySelector(".mega_menu");
        const navLinks = document.querySelectorAll(".nav_link-wrapper .nav_link");
        const megaMenuCTA = document.querySelector(".mega_menu-cta");
        const megaMenuGradient = document.querySelector(".mega_menu-gradient");
        const clipPathCalc = "calc(50% + 39rem) 0%";

        gsap.set(megaMenu, {
            clipPath: `circle(0% at ${clipPathCalc})`,
            display: "none"
        });
        gsap.set(navLinks, { x: -40, opacity: 0 });
        gsap.set(megaMenuCTA, { opacity: 0 });
        gsap.set(megaMenuGradient, { opacity: 0 });

        isOpen = false;
        isAnimating = false;

        openMenuTimeline = gsap.timeline({ paused: true });
        closeMenuTimeline = gsap.timeline({ paused: true });

        closeMenuTimeline
            .to(megaMenu, {
                clipPath: `circle(0% at ${clipPathCalc})`,
                duration: 0.5,
                ease: "power4.inOut",
                onComplete: () => {
                    gsap.set(megaMenu, { display: "none" });
                    document.querySelector(".hamburger").classList.remove("is-active");
                    isAnimating = false;
                }
            });

        openMenuTimeline
            .set(megaMenu, { display: "flex" })
            .to(megaMenu, {
                clipPath: `circle(200% at ${clipPathCalc})`,
                duration: 0.5,
                ease: "power4.inOut",
                onComplete: () => {
                    isAnimating = false;
                }
            })
            .to(navLinks, {
                x: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
            }, "<0.4")
            .to(megaMenuCTA, {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out"
            }, "<0.4")
            .to(megaMenuGradient, {
                opacity: 1,
                duration: 1,
                ease: "power2.out",
            });

        const toggleMenu = () => {
            if (isAnimating) return;
            isAnimating = true;

            if (isOpen) {
                closeMenuTimeline.restart();
                document.body.classList.remove("no-scroll");
            } else {
                openMenuTimeline.restart();
                document.querySelector(".hamburger").classList.add("is-active");
                document.body.classList.add("no-scroll");
            }
            isOpen = !isOpen;
        };

        hamburgerLink.addEventListener("click", toggleMenu);
    }

    /**
     * Get menu state
     * @returns {boolean}
     */
    function getIsOpen() {
        return isOpen;
    }

    /**
     * Set menu state
     * @param {boolean} state 
     */
    function setIsOpen(state) {
        isOpen = state;
    }

    /**
     * Get close menu timeline
     * @returns {gsap.core.Timeline}
     */
    function getCloseMenuTimeline() {
        return closeMenuTimeline;
    }

    /**
     * Footer Animations - Footer text animation and copyright year
     */

    /**
     * Animate "Think Limitless" text in footer
     */
    function footerLimitless() {
        const thinkLimitless = document.querySelector(".think-limitless");
        if (!thinkLimitless) return;

        const splitLimitless = new SplitText(thinkLimitless, { type: "chars" });

        gsap.from(splitLimitless.chars, {
            y: "100%",
            stagger: 0.1,
            scrollTrigger: {
                trigger: thinkLimitless,
                start: "top 90%",
                toggleActions: "play none none none",
            }
        });
    }

    /**
     * Set current year in copyright
     */
    function copyYear() {
        const yearSpan = document.querySelector('.copy_year');
        if (yearSpan) {
            const currentYear = new Date().getFullYear();
            yearSpan.textContent = currentYear;
        }
    }

    /**
     * Hero Timeline Utility - Creates base timeline with autoAlpha for all pages
     * Ensures autoAlpha completes before page-specific animations run
     */

    /**
     * Create a hero timeline with the base autoAlpha animation
     * @returns {gsap.core.Timeline} Timeline with autoAlpha already added
     */
    function createHeroTimeline() {
        const tl = gsap.timeline();
        tl.fromTo(".main-wrapper", { autoAlpha: 0 }, { autoAlpha: 1, ease: "linear" });
        return tl;
    }

    /**
     * Home Hero Animation - Main homepage hero with cycling words
     */


    let homeHeroTl = null;
    let heroCycleCall = null;

    /**
     * Initialize home hero animation
     */
    function initHomeHeroAnimation() {
        const homeHeroChars = document.querySelector(".hero_anim-chars");
        if (!homeHeroChars) return;

        const splitHomeHeroChars = new SplitText(homeHeroChars, { type: "chars,words,lines" });

        homeHeroTl = createHeroTimeline();

        homeHeroTl.from(splitHomeHeroChars.chars, {
                opacity: 0,
                x: 16,
                y: "30%",
                filter: "blur(10px)",
                stagger: 0.03,
            })
            .add(() => {
                gsap.delayedCall(0.8, cycleHeroHeadingWords);
            });
    }

    /**
     * Cycle through hero heading words
     */
    function cycleHeroHeadingWords() {
        const words = [
            "Strategy", "Packaging", "Naming", "Branding", "Storytelling",
            "Experiences", "Partnerships", "Growth", "Impact", "Design"
        ];

        const headingWords = document.querySelector("#heading_keywords");
        if (!headingWords) return;

        let currentIndex = 0;

        const loopWords = () => {
            const nextWord = words[currentIndex];

            const charsOut = new SplitText(headingWords, { type: "chars" });
            const loopTl = gsap.timeline({
                onComplete: () => {
                    headingWords.textContent = nextWord;
                    const charsIn = new SplitText(headingWords, { type: "chars" });

                    gsap.fromTo(charsIn.chars, {
                        y: 20,
                        opacity: 0,
                    }, {
                        y: 0,
                        opacity: 1,
                        stagger: 0.03,
                        duration: 0.4,
                        ease: "power2.out"
                    });

                    currentIndex = (currentIndex + 1) % words.length;

                    heroCycleCall = gsap.delayedCall(0.8, loopWords);
                }
            });

            loopTl.to(charsOut.chars, {
                y: -20,
                opacity: 0,
                stagger: 0.03,
                duration: 0.4,
                ease: "power1.in"
            });
        };

        loopWords();
    }

    /**
     * Destroy home hero animation
     */
    function destroyHomeHeroAnimation() {
        if (homeHeroTl) homeHeroTl.kill();
        if (heroCycleCall) heroCycleCall.kill();
    }

    /**
     * Character Animations - Text reveal by characters
     */

    /**
     * Initialize character-based text animations
     */
    function initCharAnimations() {
        const animatedChars = document.querySelectorAll(".animated-chars");

        animatedChars.forEach((element) => {
            const splitChars = new SplitText(element, { type: "chars,words,lines" });

            gsap.from(splitChars.chars, {
                opacity: 0,
                x: 16,
                y: "30%",
                filter: "blur(10px)",
                stagger: 0.03,
                scrollTrigger: {
                    trigger: element,
                    start: "top 90%",
                    toggleActions: "play none none none",
                }
            });
        });
    }

    /**
     * Word Animations - Text reveal by words
     */

    /**
     * Initialize word-based text animations
     */
    function initWordAnimations() {
        const animatedWords = document.querySelectorAll(".animated-words");

        animatedWords.forEach((element) => {
            const splitWords = new SplitText(element, { type: "chars,words,lines" });

            gsap.from(splitWords.words, {
                opacity: 0,
                x: 16,
                y: "30%",
                filter: "blur(10px)",
                stagger: 0.03,
                scrollTrigger: {
                    trigger: element,
                    start: "top 90%",
                    toggleActions: "play none none none",
                }
            });
        });
    }

    /**
     * Line Animations - Text reveal by lines
     */

    /**
     * Initialize line-based text animations
     */
    function initLineAnimations() {
        const animatedLines = document.querySelectorAll(".animated-lines");

        animatedLines.forEach((element) => {
            const splitLines = new SplitText(element, { type: "chars,words,lines" });

            gsap.from(splitLines.lines, {
                opacity: 0,
                y: "80%",
                filter: "blur(10px)",
                stagger: 0.1,
                scrollTrigger: {
                    trigger: element,
                    start: "top 90%",
                    toggleActions: "play none none none",
                }
            });
        });
    }

    /**
     * Video Player - Showreel video playback and fullscreen
     */


    /**
     * Play showreel video
     */
    function playVideo() {
        const videoElement = document.querySelector('.showreel');
        if (videoElement) {
            videoElement.currentTime = 0;
            videoElement.play().catch(error => {
                console.error('Error playing video:', error);
            });
        }
    }

    /**
     * Initialize video with fullscreen capability
     */
    function startVideo() {
        const mobile = isMobile();

        const videoCursor = document.getElementById('videoCursor');
        const playPauseIcon = document.querySelector(".custom-video-cursor");
        const videoElement = document.querySelector('.showreel');

        if (!videoCursor || !videoElement) return;

        const pageWrapper = !mobile ? document.querySelector(".page-wrapper") : null;
        const originalContainer = !mobile ? videoElement.parentElement : null;
        const originalCursorContainer = !mobile ? videoCursor.parentElement : null;

        function enterFullscreen() {
            if (!mobile && videoElement.classList.contains("fullscreen-video")) return;

            if (!mobile) {
                const state = Flip.getState(videoElement);
                const cursorState = Flip.getState(playPauseIcon);

                pageWrapper.appendChild(videoElement);
                pageWrapper.appendChild(videoCursor);
                videoElement.classList.add("fullscreen-video");

                playPauseIcon.querySelector(".icon-play").style.display = "none";
                playPauseIcon.querySelector(".icon-close").style.display = "flex";
                videoCursor.classList.add("close");

                Flip.from(state, {
                    duration: 0.5,
                    ease: "power2.inOut",
                    absolute: true
                });

                Flip.from(cursorState, {
                    duration: 0.5,
                    ease: "power2.inOut",
                    absolute: true
                });

                document.body.classList.add("no-scroll");
                document.addEventListener("keydown", exitFullscreen);
            }

            if (mobile) {
                videoCursor.classList.add("close");
            }

            videoElement.currentTime = 0;
            videoElement.muted = false;
            videoElement.play();

            videoCursor.addEventListener("click", exitFullscreen);
        }

        function exitFullscreen(event) {
            if (!mobile && event.type === "keydown" && event.key !== "Escape") return;

            if (!mobile) {
                const state = Flip.getState(videoElement);
                const cursorState = Flip.getState(playPauseIcon);

                videoElement.classList.remove("fullscreen-video");
                playPauseIcon.querySelector(".icon-play").style.display = "flex";
                playPauseIcon.querySelector(".icon-close").style.display = "none";
                videoCursor.classList.remove("close");

                originalContainer.appendChild(videoElement);
                originalCursorContainer.appendChild(videoCursor);

                Flip.from(state, {
                    duration: 0.5,
                    ease: "power2.inOut",
                    absolute: true
                });

                Flip.from(cursorState, {
                    duration: 0.5,
                    ease: "power2.inOut",
                    absolute: true
                });

                document.body.classList.remove("no-scroll");
                document.removeEventListener("keydown", exitFullscreen);
            }

            if (mobile) {
                videoCursor.classList.remove("close");
            }

            videoElement.muted = true;
            videoCursor.removeEventListener("click", exitFullscreen);
        }

        // Attach the click listener **only once** to prevent duplicates
        videoCursor.removeEventListener("click", enterFullscreen);
        videoCursor.addEventListener("click", enterFullscreen);
    }

    /**
     * Cleanup video listeners
     */
    function destroyStartVideo() {
        document.getElementById('videoCursor');
    }

    /*
    This helper function makes a group of elements animate along the x-axis in a seamless, responsive loop.

    Features:
     - Uses xPercent so that even if the widths change (like if the window gets resized), it should still work in most cases.
     - When each item animates to the left or right enough, it will loop back to the other side
     - Optionally pass in a config object with values like draggable: true, center: true, speed (default: 1, which travels at roughly 100 pixels per second), paused (boolean), repeat, reversed, and paddingRight.
     - The returned timeline will have the following methods added to it:
       - next() - animates to the next element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
       - previous() - animates to the previous element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
       - toIndex() - pass in a zero-based index value of the element that it should animate to, and optionally pass in a vars object to control duration, easing, etc. Always goes in the shortest direction
       - current() - returns the current index (if an animation is in-progress, it reflects the final index)
       - times - an Array of the times on the timeline where each element hits the "starting" spot.
     */
    function horizontalLoop(items, config) {
        let timeline;
        items = gsap.utils.toArray(items);
        config = config || {};
        gsap.context(() => { // use a context so that if this is called from within another context or a gsap.matchMedia(), we can perform proper cleanup like the "resize" event handler on the window
            let onChange = config.onChange,
                lastIndex = 0,
                tl = gsap.timeline({
                    repeat: config.repeat, onUpdate: onChange && function () {
                        let i = tl.closestIndex();
                        if (lastIndex !== i) {
                            lastIndex = i;
                            onChange(items[i], i);
                        }
                    }, paused: config.paused, defaults: { ease: "none" }, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
                }),
                length = items.length,
                startX = items[0].offsetLeft,
                times = [],
                widths = [],
                spaceBefore = [],
                xPercents = [],
                curIndex = 0,
                indexIsDirty = false,
                center = config.center,
                pixelsPerSecond = (config.speed || 1) * 100,
                snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
                timeOffset = 0,
                container = center === true ? items[0].parentNode : gsap.utils.toArray(center)[0] || items[0].parentNode,
                totalWidth,
                getTotalWidth = () => items[length - 1].offsetLeft + xPercents[length - 1] / 100 * widths[length - 1] - startX + spaceBefore[0] + items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") + (parseFloat(config.paddingRight) || 0),
                populateWidths = () => {
                    let b1 = container.getBoundingClientRect(), b2;
                    items.forEach((el, i) => {
                        widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
                        xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / widths[i] * 100 + gsap.getProperty(el, "xPercent"));
                        b2 = el.getBoundingClientRect();
                        spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
                        b1 = b2;
                    });
                    gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
                        xPercent: i => xPercents[i]
                    });
                    totalWidth = getTotalWidth();
                },
                timeWrap,
                populateOffsets = () => {
                    timeOffset = center ? tl.duration() * (container.offsetWidth / 2) / totalWidth : 0;
                    center && times.forEach((t, i) => {
                        times[i] = timeWrap(tl.labels["label" + i] + tl.duration() * widths[i] / 2 / totalWidth - timeOffset);
                    });
                },
                getClosest = (values, value, wrap) => {
                    let i = values.length,
                        closest = 1e10,
                        index = 0, d;
                    while (i--) {
                        d = Math.abs(values[i] - value);
                        if (d > wrap / 2) {
                            d = wrap - d;
                        }
                        if (d < closest) {
                            closest = d;
                            index = i;
                        }
                    }
                    return index;
                },
                populateTimeline = () => {
                    let i, item, curX, distanceToStart, distanceToLoop;
                    tl.clear();
                    for (i = 0; i < length; i++) {
                        item = items[i];
                        curX = xPercents[i] / 100 * widths[i];
                        distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
                        distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
                        tl.to(item, { xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
                            .fromTo(item, { xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100) }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond)
                            .add("label" + i, distanceToStart / pixelsPerSecond);
                        times[i] = distanceToStart / pixelsPerSecond;
                    }
                    timeWrap = gsap.utils.wrap(0, tl.duration());
                },
                refresh = (deep) => {
                    let progress = tl.progress();
                    tl.progress(0, true);
                    populateWidths();
                    deep && populateTimeline();
                    populateOffsets();
                    deep && tl.draggable && tl.paused() ? tl.time(times[curIndex], true) : tl.progress(progress, true);
                },
                onResize = () => refresh(true),
                proxy;
            gsap.set(items, { x: 0 });
            populateWidths();
            populateTimeline();
            populateOffsets();
            window.addEventListener("resize", onResize);
            function toIndex(index, vars) {
                vars = vars || {};
                (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
                let newIndex = gsap.utils.wrap(0, length, index),
                    time = times[newIndex];
                if (time > tl.time() !== index > curIndex && index !== curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
                    time += tl.duration() * (index > curIndex ? 1 : -1);
                }
                if (time < 0 || time > tl.duration()) {
                    vars.modifiers = { time: timeWrap };
                }
                curIndex = newIndex;
                vars.overwrite = true;
                gsap.killTweensOf(proxy);
                return vars.duration === 0 ? tl.time(timeWrap(time)) : tl.tweenTo(time, vars);
            }
            tl.toIndex = (index, vars) => toIndex(index, vars);
            tl.closestIndex = setCurrent => {
                let index = getClosest(times, tl.time(), tl.duration());
                if (setCurrent) {
                    curIndex = index;
                    indexIsDirty = false;
                }
                return index;
            };
            tl.current = () => indexIsDirty ? tl.closestIndex(true) : curIndex;
            tl.next = vars => toIndex(tl.current() + 1, vars);
            tl.previous = vars => toIndex(tl.current() - 1, vars);
            tl.times = times;
            tl.progress(1, true).progress(0, true); // pre-render for performance
            if (config.reversed) {
                tl.vars.onReverseComplete();
                tl.reverse();
            }
            if (config.draggable && typeof (Draggable) === "function") {
                proxy = document.createElement("div");
                let wrap = gsap.utils.wrap(0, 1),
                    ratio, startProgress, draggable, lastSnap, initChangeX, wasPlaying,
                    align = () => tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio)),
                    syncIndex = () => tl.closestIndex(true);
                typeof (InertiaPlugin) === "undefined" && console.warn("InertiaPlugin required for momentum-based scrolling and snapping. https://greensock.com/club");
                draggable = Draggable.create(proxy, {
                    trigger: items[0].parentNode,
                    type: "x",
                    onPressInit() {
                        let x = this.x;
                        gsap.killTweensOf(tl);
                        wasPlaying = !tl.paused();
                        tl.pause();
                        startProgress = tl.progress();
                        refresh();
                        ratio = 1 / totalWidth;
                        initChangeX = (startProgress / -ratio) - x;
                        gsap.set(proxy, { x: startProgress / -ratio });
                    },
                    onDrag: align,
                    onThrowUpdate: align,
                    overshootTolerance: 0,
                    inertia: false,
                    snap(value) {
                        //note: if the user presses and releases in the middle of a throw, due to the sudden correction of proxy.x in the onPressInit(), the velocity could be very large, throwing off the snap. So sense that condition and adjust for it. We also need to set overshootTolerance to 0 to prevent the inertia from causing it to shoot past and come back
                        if (Math.abs(startProgress / -ratio - this.x) < 10) {
                            return lastSnap + initChangeX
                        }
                        let time = -(value * ratio) * tl.duration(),
                            wrappedTime = timeWrap(time),
                            snapTime = times[getClosest(times, wrappedTime, tl.duration())],
                            dif = snapTime - wrappedTime;
                        Math.abs(dif) > tl.duration() / 2 && (dif += dif < 0 ? tl.duration() : -tl.duration());
                        lastSnap = (time + dif) / tl.duration() / -ratio;
                        return lastSnap;
                    },
                    onThrowComplete: () => {
                        syncIndex();
                        wasPlaying && tl.play();
                        if (!wasPlaying) tl.play();
                    },
                    onRelease() {
                        syncIndex();
                        draggable.isThrowing && (indexIsDirty = true);
                        if (!tl.isActive()) {
                            gsap.delayedCall(4, () => tl.play());
                        }
                    }
                })[0];
                tl.draggable = draggable;
            }
            tl.closestIndex(true);
            lastIndex = curIndex;
            onChange && onChange(items[curIndex], curIndex);
            timeline = tl;
            return () => window.removeEventListener("resize", onResize); // cleanup
        });
        return timeline;
    }

    /**
     * Featured Work - Horizontal loop and FLIP animations
     */


    const featuredWorkLoopHandlers = new Map();

    /**
     * Initialize featured work horizontal loop
     */
    function featuredWorkLoop() {
        const wrapper = document.querySelector(".work_images-wrapper");
        if (!wrapper) return;

        let activeElement;
        const images = gsap.utils.toArray(".work_image");

        const loop = horizontalLoop(images, {
            draggable: true,
            inertia: false,
            repeat: -1,
            center: false,
            onChange: (element, index) => {
                activeElement && activeElement.classList.remove("active");
                element.classList.add("active");
                activeElement = element;
            },
        });

        images.forEach(image => {
            const mouseenter = () => gsap.to(loop, { timeScale: 0, ease: "power2.out", duration: 1, overwrite: true });
            const mouseleave = () => gsap.to(loop, { timeScale: 1, overwrite: true });

            image.addEventListener("mouseenter", mouseenter);
            image.addEventListener("mouseleave", mouseleave);

            featuredWorkLoopHandlers.set(image, { mouseenter, mouseleave });
        });
    }

    /**
     * Destroy featured work loop
     */
    function destroyFeaturedWorkLoop() {
        featuredWorkLoopHandlers.forEach((handlers, image) => {
            image.removeEventListener("mouseenter", handlers.mouseenter);
            image.removeEventListener("mouseleave", handlers.mouseleave);
        });
        featuredWorkLoopHandlers.clear();
    }

    /**
     * Animate work images with FLIP
     */
    function animateWorkImages() {
        const wrapper = document.querySelector(".work_images-wrapper");
        if (!wrapper) return;

        const images = document.querySelectorAll(".work_image");
        const firstImage = images[0];
        const secondImage = images[1];
        const title = document.querySelector(".our-work_title");
        const titleWrapper = document.querySelector(".our-work_title-wrapper");

        images.forEach((img, index) => {
            img.style.zIndex = images.length - index;
        });

        gsap.set(firstImage, { rotation: 6 });
        gsap.set(secondImage, { rotation: 3 });

        ScrollTrigger.create({
            trigger: ".our-work_block",
            start: "center 75%",
            once: true,
            onEnter: () => {
                const worksTl = gsap.timeline();

                worksTl.to(title, {
                    y: "-100%",
                    duration: 1,
                    ease: "power1.out"
                })
                    .to([firstImage, secondImage], {
                        rotation: 0,
                        duration: 1,
                        ease: "power1.out"
                    }, "<")
                    .set(title, { autoAlpha: 0 })
                    .set(titleWrapper, { autoAlpha: 0 })
                    .add(() => {
                        const state = Flip.getState(images);
                        wrapper.classList.add("flex-layout");

                        Flip.from(state, {
                            duration: 1,
                            ease: "power1.out",
                            stagger: 0.05,
                            onComplete: featuredWorkLoop
                        });
                    });
            }
        });
    }

    /**
     * Service Hover Animation - Expandable service elements
     */


    let serviceHoverCleanupFns = [];

    /**
     * Initialize service hover animation
     */
    function serviceHoverAnimation() {
        const elements = document.querySelectorAll(".services-element");
        const mobile = isMobile();

        elements.forEach((element) => {
            const serviceLine = element.querySelector(".service_line");
            const serviceDescription = element.querySelector(".service_description");
            const serviceImage = element.querySelector(".service_image");
            const serviceHeading = element.querySelector(".service_heading");
            const serviceNumber = element.querySelector(".service_number");

            element.style.height = "auto";
            let expandedHeight = element.offsetHeight;
            element.style.height = mobile ? "4.8rem" : "8.5rem";

            const floatImage = (event) => {
                const { clientX, clientY } = event;
                const { left, top, width, height } = element.getBoundingClientRect();

                let xMove = (clientX - (left + width / 2)) * 0.1;
                let yMove = (clientY - (top + height / 2)) * 0.1;

                gsap.to(serviceImage, { x: xMove, y: yMove, rotate: 12 + xMove * 0.1, duration: 0.3, ease: "power2.out" });
            };

            const onMouseEnter = () => {
                element.addEventListener("mousemove", floatImage);
                gsap.timeline({ defaults: { overwrite: true } })
                    .to(element, { height: expandedHeight, backgroundColor: "#2C1387", duration: 0.5, ease: "power2.out" })
                    .to(serviceHeading, { color: "#38C67F", duration: 0.5, ease: "power2.out" }, "<")
                    .to(serviceNumber, { color: "#38C67F", duration: 0.5, ease: "power2.out" }, "<")
                    .to(serviceImage, { opacity: 1, scale: 1, y: 0, rotate: 12, duration: 0.5, ease: "power2.out" }, "<")
                    .to(serviceLine, { width: mobile ? "70%" : "100%", duration: 0.5, ease: "power2.out" }, "<")
                    .to(serviceDescription, { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.1");
                if (!mobile && window.location.pathname === "/") {
                    gsap.timeline.call(() => ScrollTrigger && ScrollTrigger.refresh());
                }
            };

            const onMouseLeave = () => {
                gsap.timeline({ defaults: { overwrite: true } })
                    .to(element, { height: mobile ? '4.8rem' : '8.5rem', backgroundColor: "#5431D0", duration: 0.3, ease: "power2.out" })
                    .to(serviceHeading, { color: "#FEFEFE", duration: 0.3, ease: "power2.out" }, "<")
                    .to(serviceNumber, { color: "#FEFEFE", duration: 0.3, ease: "power2.out" }, "<")
                    .to(serviceImage, { opacity: 0, scale: 0.8, y: -10, rotate: 0, duration: 0.3, ease: "power2.out" }, "<")
                    .to(serviceLine, { width: "0%", duration: 0.3, ease: "power2.out" }, "<")
                    .to(serviceDescription, { opacity: 0, duration: 0 }, "<")
                    .call(() => {
                        element.removeEventListener("mousemove", floatImage);
                        gsap.to(serviceImage, { x: 0, y: -10, rotate: 0, duration: 0 });
                        if (!mobile && window.location.pathname === "/") {
                            ScrollTrigger && ScrollTrigger.refresh();
                        }
                    });
            };

            element.addEventListener("mouseenter", onMouseEnter);
            element.addEventListener("mouseleave", onMouseLeave);

            // Push cleanup function for this element
            serviceHoverCleanupFns.push(() => {
                element.removeEventListener("mouseenter", onMouseEnter);
                element.removeEventListener("mouseleave", onMouseLeave);
                element.removeEventListener("mousemove", floatImage);
            });
        });
    }

    /**
     * Destroy service hover animation
     */
    function destroyServiceHoverAnimation() {
        serviceHoverCleanupFns.forEach((fn) => fn());
        serviceHoverCleanupFns = [];
    }

    /**
     * Vision Section Animation - Our vision section with floating images
     */

    let onVisionMouseMove = null;
    let onVisionMouseLeave = null;
    let visionTl = null;

    /**
     * Initialize vision section animation
     */
    function visionSectionAnimation() {
        const visionSection = document.querySelector(".section_our-vision");
        if (!visionSection) return;

        const visionPara = visionSection.querySelector(".our-vision_content-wrapper p");
        const visionButton = visionSection.querySelector(".our-vision_content-wrapper .button");
        const visionImages = document.querySelectorAll(".our-vision_image");
        const visionLines = new SplitText(visionPara, { type: "lines" });

        visionTl = gsap.timeline({
            scrollTrigger: {
                trigger: visionSection,
                start: "top 70%",
                toggleActions: "play none none none",
            },
        });

        visionTl
            .from(visionLines.lines, {
                opacity: 0,
                y: "80%",
                filter: "blur(10px)",
                stagger: 0.1,
            })
            .from(visionImages, {
                opacity: 0,
                filter: "blur(10px)",
                stagger: 0.2,
            }, "-=0.2")
            .from(visionButton, {
                opacity: 0,
                y: "40%",
                filter: "blur(10px)",
            }, "-=0.2")
            .call(enableFloatingEffect);

        function enableFloatingEffect() {
            onVisionMouseMove = function (e) {
                const { clientX: x, clientY: y } = e;
                visionImages.forEach((image, index) => {
                    const movementX = (x / window.innerWidth - 0.5) * (20 + index * 5);
                    const movementY = (y / window.innerHeight - 0.5) * (20 + index * 5);
                    gsap.to(image, {
                        x: movementX,
                        y: movementY,
                        duration: 0.5,
                        ease: "power2.out",
                    });
                });
            };

            onVisionMouseLeave = function () {
                gsap.to(visionImages, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                });
            };

            visionSection.addEventListener("mousemove", onVisionMouseMove);
            visionSection.addEventListener("mouseleave", onVisionMouseLeave);
        }
    }

    /**
     * Destroy vision section animation
     */
    function destroyVisionSectionAnimation() {
        const visionSection = document.querySelector(".section_our-vision");

        if (!visionSection) return;

        if (onVisionMouseMove) {
            visionSection.removeEventListener("mousemove", onVisionMouseMove);
        }
        if (onVisionMouseLeave) {
            visionSection.removeEventListener("mouseleave", onVisionMouseLeave);
        }

        if (visionTl) {
            visionTl.kill();
            visionTl = null;
        }
    }

    /**
     * CTA Animation - Call-to-action section with text reveals
     */


    /**
     * Animate CTA section
     */
    function animateCTA() {
        const ctaWrapper = document.querySelector(".cta_text-wrapper");
        if (!ctaWrapper) return;

        const mobile = isMobile();

        const allParagraphs = Array.from(ctaWrapper.querySelectorAll(".cta_paragraph"));
        const visibleParagraphs = allParagraphs.filter(p => {
            if (mobile && p.classList.contains("desktop-hidden")) return true;
            if (!mobile && p.classList.contains("mobile-hidden")) return true;
            if (p.classList.contains("desktop-hidden") || p.classList.contains("mobile-hidden")) return false;
            return true;
        });

        // Apply SplitText once
        const splitCtaChars = new SplitText(visibleParagraphs, { type: "chars" });
        const ctaChars = splitCtaChars.chars;
        const paragraphs = splitCtaChars.elements;

        // Select images
        const images = [
            ctaWrapper.querySelector(".cta_span-image.is-one"),
            ctaWrapper.querySelector(".cta_span-image.is-two")
        ];

        // Timeline with ScrollTrigger
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ctaWrapper,
                start: "top 70%",
                toggleActions: "play none none none",
            }
        });

        // Define animation sequence
        const sequence = [
            { textIndex: 0, imageIndex: 0 },
            { textIndex: 1 },
            { textIndex: 2 },
            { imageIndex: 1 },
            { textIndex: 3 },
            { textIndex: 4 },
            { textIndex: 5 },
        ];

        sequence.forEach(({ textIndex, imageIndex }, i) => {
            if (textIndex !== undefined && paragraphs[textIndex]) {
                tl.from(ctaChars.filter(char => char.parentElement === paragraphs[textIndex]), {
                    opacity: 0,
                    x: 16,
                    y: "30%",
                    filter: "blur(10px)",
                    stagger: 0.02,
                }, i === 0 ? "+=0" : "-=0.4");
            }

            if (imageIndex !== undefined && images[imageIndex]) {
                tl.fromTo(images[imageIndex],
                    { clipPath: "inset(0 100% 0 0)" },
                    { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power2.out" },
                    "-=0.4"
                );
            }
        });
    }

    /**
     * Ticker Animations - Horizontal loop tickers for various sections
     */


    let aboutTickerLoops = [];
    let hopscotchTickerLoops = [];

    /**
     * Initialize about page tickers (brands, team, culture)
     */
    function brandTicker() {
        const elements = [
            { selector: ".brand_logo", reversed: false },
            { selector: ".team_ticker-wrapper.is-one .team_card", reversed: false },
            { selector: ".team_ticker-wrapper.is-two .team_card", reversed: true },
            { selector: ".culture_image", reversed: false }
        ];

        aboutTickerLoops = elements.map(({ selector, reversed }) => {
            const items = gsap.utils.toArray(selector);
            if (items.length === 0) return null;

            const loop = horizontalLoop(items, {
                draggable: false,
                inertia: false,
                repeat: -1,
                center: false,
                reversed
            });

            return loop;
        }).filter(Boolean);
    }

    /**
     * Destroy about page tickers
     */
    function destroyBrandTicker() {
        aboutTickerLoops.forEach(loop => {
            if (loop && typeof loop.kill === 'function') {
                loop.kill();
            }
        });
        aboutTickerLoops = [];
    }

    /**
     * Initialize case study ticker
     */
    let tickerLoops = [];

    function initHorizontalTicker(wrapperSelector, itemSelector) {
      const wrapper = document.querySelector(wrapperSelector);
      if (!wrapper) return;

      const items = gsap.utils.toArray(itemSelector);
      if (!items.length) return;

      const loop = horizontalLoop(items, {
        draggable: false,
        inertia: false,
        repeat: -1,
        center: false,
      });

      tickerLoops.push(loop);
      return loop;
    }

    function destroyHorizontalTickers() {
      tickerLoops.forEach(loop => loop.kill && loop.kill());
      tickerLoops = [];
    }



    /**
     * Initialize Hopscotch tickers (two tickers moving in opposite directions)
     */
    function hopscotchTicker() {
        const tickerOne = document.querySelector(".hopscotch_ticker.is-one");
        const tickerTwo = document.querySelector(".hopscotch_ticker.is-two");
        if (!tickerOne && !tickerTwo) return;

        const elements = [
            { selector: ".hopscotch_ticker.is-one .hopscotch_ticker-svg", reversed: false },
            { selector: ".hopscotch_ticker.is-two .hopscotch_ticker-svg", reversed: true },
        ];

        hopscotchTickerLoops = elements.map(({ selector, reversed }) => {
            const items = gsap.utils.toArray(selector);
            if (items.length === 0) return null;

            const loop = horizontalLoop(items, {
                draggable: false,
                inertia: false,
                repeat: -1,
                center: false,
                reversed
            });

            return loop;
        }).filter(Boolean);
    }

    /**
     * Destroy case study variant tickers
     */
    function destroyTickers() {
        hopscotchTickerLoops.forEach(loop => {
            if (loop && typeof loop.kill === 'function') {
                loop.kill();
            }
        });
        hopscotchTickerLoops = [];
    }

    let marqueeTweens$1 = [];

    /**
     * Initialize SVG marquee animation
     * @param {string} className - CSS class (without dot)
     */
    function initMarqueeSVG(className) {
      const elements = document.querySelectorAll(`.${className}`);
      if (!elements.length) return;

      elements.forEach((el) => {
        // prevent duplicate tween on same element
        if (marqueeTweens$1.some(t => t.targets().includes(el))) return;

        const tween = gsap.to(el, {
          x: "-100%",
          duration: 20,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % 100)
          }
        });

        marqueeTweens$1.push(tween);
      });
    }

    /**
     * Destroy ALL marquee tweens
     */
    function destroyMarqueeSVG() {
      marqueeTweens$1.forEach(tween => tween.kill());
      marqueeTweens$1 = [];
    }

    /**
     * Parallax Effect - Smooth parallax on images
     */


    /**
     * Apply parallax effect to images
     */
    function applyParallaxEffect() {
        const smoother = getSmoother();
        if (smoother) {
            smoother.effects(".parallax-image", { speed: "auto" });
        }
    }

    /**
     * Scrolling Text Animation - Horizontal scroll on scroll
     */

    /**
     * Animate horizontal scrolling text
     */
    function animateScrollingText() {
        const scrollTextWrapper = document.querySelector(".scroll_text-wrapper");
        if (!scrollTextWrapper) return;

        const textWidth = scrollTextWrapper.scrollWidth;

        gsap.to(scrollTextWrapper, {
            x: -textWidth + window.innerWidth,
            ease: "none",
            scrollTrigger: {
                trigger: scrollTextWrapper,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }

    /**
     * SVG Path Drawing - Brandemic logo draw animation
     */

    /**
     * Animate SVG paths with draw effect
     */
    function animateSvgPaths() {
        const paths = document.querySelectorAll(".brandemic-logo-draw .brandemic_svg-path");

        paths.forEach((path) => {
            gsap.from(path, {
                duration: 2,
                drawSVG: 0,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: path,
                    start: "top 50%",
                },
            });
        });
    }

    /**
     * Tools Swiper - Coverflow effect swiper for tools section
     */

    let toolsSwiperInstance = null;

    /**
     * Initialize tools swiper
     */
    function initToolsSwiperScripts() {
        toolsSwiperInstance = new Swiper('.is-tools', {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: "auto",
            loop: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            coverflowEffect: {
                rotate: 50,
                stretch: 50,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            },
        });
    }

    /**
     * Destroy tools swiper instance
     */
    function destroyToolsSwiperScripts() {
        if (toolsSwiperInstance && toolsSwiperInstance.destroy) {
            toolsSwiperInstance.destroy(true, true);
            toolsSwiperInstance = null;
        }
    }

    /**
     * Testimonials Swiper - Creative effect swiper for testimonials
     */

    let testimonialsSwiperInstance = null;

    /**
     * Initialize testimonials swiper
     */
    function initTestimonialsSwiperScripts() {
        testimonialsSwiperInstance = new Swiper('.is-testimonials', {
            slidesPerView: 1,
            direction: 'horizontal',
            centeredSlides: true,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            effect: "creative",
            creativeEffect: {
                prev: {
                    shadow: true,
                    translate: [0, 0, -400],
                },
                next: {
                    translate: ["100%", 0, 0],
                },
            },
            navigation: {
                nextEl: '.testimonials-next',
                prevEl: '.testimonials-prev',
            },
        });
    }

    /**
     * Destroy testimonials swiper instance
     */
    function destroyTestimonialsSwiperScripts() {
        if (testimonialsSwiperInstance && testimonialsSwiperInstance.destroy) {
            testimonialsSwiperInstance.destroy(true, true);
            testimonialsSwiperInstance = null;
        }
    }

    /**
     * Load FeedSpring Instagram script
     */
    function loadFeedSpring() {
        let script = document.createElement("script");
        script.src = "https://scripts.feedspring.com/instagram-attrs.js";
        script.async = true;
        script.defer = true;

        // Remove existing script if present
        let oldScript = document.querySelector('script[src="https://scripts.feedspring.com/instagram-attrs.js"]');
        if (oldScript) oldScript.remove();

        document.head.appendChild(script);
    }

    let accordionListeners = [];

    function initAccordion(acc, panels) {
        const mobile = isMobile();
        for (let i = 0; i < acc.length; i++) {
            const handler = function () {
                for (let j = 0; j < panels.length; j++) {
                    if (j !== i) {
                        panels[j].style.maxHeight = null;
                        acc[j].classList.remove("active");
                    }
                }
                this.classList.toggle("active");
                const panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                }
                else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                    if (typeof ScrollTrigger !== "undefined" && !mobile) {
                        ScrollTrigger.refresh();
                    }
                }
                
            };
            acc[i].addEventListener("click", handler);
            accordionListeners.push({ el: acc[i], handler });
        }
    }

    function destroyAccordionListeners() {
        accordionListeners.forEach(({ el, handler }) => {
            el.removeEventListener("click", handler);
        });
        accordionListeners = [];
    }

    function lineAnimation() {
        gsap.fromTo(
            '.accordion',
            { clipPath: "polygon(0 0, 0% 0, 0% 100%, 0 100%)" },
            {
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                duration: 1,
                stagger: 0.2,
                ease: "power1.out",
                scrollTrigger: {
                    trigger: '.accordions',
                    start: "top 70%",
                },
            }
        );
    }


    function initAccordionComponents() {
        const accordions = document.querySelectorAll(".accordion_toggle");
        const panels = document.querySelectorAll(".accordion_panel");
        
        initAccordion(accordions, panels);

    }
    function destroyAccordionComponents() {
        destroyAccordionListeners();
    }

    /**
     * Home Page - Initialize and destroy animations
     */

    /**
     * Initialize all home page animations
     */
    function initHomeAnimations() {
        initHomeHeroAnimation();
        initCharAnimations();
        initWordAnimations();
        initLineAnimations();
        playVideo();
        startVideo();
        animateWorkImages();    
        applyParallaxEffect();
        serviceHoverAnimation();
        visionSectionAnimation();
        animateSvgPaths();
        brandTicker();
        animateScrollingText();
        animateCTA();
        initAccordionComponents();
        lineAnimation();
        loadFeedSpring();
        initToolsSwiperScripts();
        initTestimonialsSwiperScripts();
    }

    /**
     * Destroy all home page animations
     */
    function destroyHomeAnimations() {
        destroyHomeHeroAnimation();
        destroyStartVideo();
        destroyFeaturedWorkLoop();
        destroyServiceHoverAnimation();
        destroyVisionSectionAnimation();
        destroyToolsSwiperScripts();
        destroyTestimonialsSwiperScripts();
        destroyAccordionComponents();
        destroyBrandTicker();
    }

    /**
     * Hero Animation with Floating Images
     * Shared animation for pages with image grid hero sections
     */


    let heroTl$2 = null;

    function initHeroAnimation() {
        heroTl$2 = createHeroTimeline();

        const splitTag = new SplitText(".hero-tl-0", { type: "chars,words,lines" });
        const splitHeadline = new SplitText(".hero-tl-1", { type: "chars,words,lines" });
        const splitPara = new SplitText(".hero-tl-2", { type: "chars,words,lines" });
        const leftImages = ['.animated_hero-image.is-one', '.animated_hero-image.is-two', '.animated_hero-image.is-three'];
        const rightImages = ['.animated_hero-image.is-four', '.animated_hero-image.is-five', '.animated_hero-image.is-six'];

        heroTl$2.from(splitTag.chars, {
                opacity: 0,
                x: 16,
                y: "30%",
                filter: "blur(10px)",
                stagger: 0.02,
            })
            .from(splitHeadline.chars, {
                opacity: 0,
                x: 16,
                y: "30%",
                filter: "blur(10px)",
                stagger: 0.03,
            }, "-=0.5")
            .from(splitPara.words, {
                opacity: 0,
                x: 16,
                y: "30%",
                filter: "blur(10px)",
                stagger: 0.03,
            }, "-=0.5")
            .fromTo(leftImages, {
                x: -200,
                y: -100,
                scale: 0.5,
                rotation: -45,
                opacity: 0,
            }, {
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 1.5,
                ease: "power3.out",
                stagger: 0.2
            }, "<")
            .fromTo(rightImages, {
                x: 200,
                y: -100,
                scale: 0.5,
                rotation: 45,
                opacity: 0,
            }, {
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 1.5,
                ease: "power3.out",
                stagger: 0.2
            }, "-=1.3")
            .to(".scroll-down", {
                opacity: 1,
                duration: 1,
                ease: "power3.out"
            }, "-=1.3")
            .add(() => initHeroFloatingEffect());
    }

    function initHeroFloatingEffect() {
        const floatTargets = [
            { selector: '.is-one', xFactor: 20, yFactor: 10, rotFactor: 5 },
            { selector: '.is-two', xFactor: 15, yFactor: 20, rotFactor: -6 },
            { selector: '.is-three', xFactor: 25, yFactor: 15, rotFactor: 4 },
            { selector: '.is-four', xFactor: -20, yFactor: 18, rotFactor: -5 },
            { selector: '.is-five', xFactor: -15, yFactor: 10, rotFactor: 6 },
            { selector: '.is-six', xFactor: -25, yFactor: 15, rotFactor: -4 },
        ];

        const wrapper = document.querySelector(".section-hero");
        if (!wrapper) return;

        wrapper.addEventListener("mousemove", (e) => {
            const { clientX, clientY } = e;
            const { width, height, left, top } = wrapper.getBoundingClientRect();
            const x = (clientX - left - width / 2) / width;
            const y = (clientY - top - height / 2) / height;

            floatTargets.forEach(({ selector, xFactor, yFactor, rotFactor }) => {
                gsap.to(selector, {
                    x: x * xFactor,
                    y: y * yFactor,
                    rotation: x * rotFactor,
                    duration: 0.6,
                    ease: "power2.out"
                });
            });
        });

        wrapper.addEventListener("mouseleave", () => {
            floatTargets.forEach(({ selector }) => {
                gsap.to(selector, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });
            });
        });
    }

    function destroyHeroAnimation() {
        if (heroTl$2) heroTl$2.kill();
    }

    /**
     * Milestones Animation - Animated milestone blocks
     */

    /**
     * Animate milestone blocks
     */
    function animateMilestones() {
        gsap.utils.toArray(".milestone_block").forEach((block, index) => {
            const line = block.querySelector(".milestone_line");
            const number = block.querySelector(".milestone_number");
            const text = block.querySelector("p");

            gsap.timeline({
                scrollTrigger: {
                    trigger: block,
                    start: "top 70%",
                    toggleActions: "play none none none",
                }
            })
                .from(line, { scaleY: 0, transformOrigin: "bottom", duration: 0.5, ease: "power2.out" })
                .from([number, text], { opacity: 0, y: 20, duration: 0.5, stagger: 0.3 }, "-=0.2");
        });
    }

    /**
     * Process Section Animation - Scroll-pinned process with Observer
     */


    let processTl = null;

    /**
     * Initialize scroll pin observer for process section
     */
    function scrollPinObserver() {
        if (isMobile()) return;

        let headings = gsap.utils.toArray(".process_heading"),
            descriptions = gsap.utils.toArray(".process_description"),
            images = gsap.utils.toArray(".process_image"),
            splitHeadings = headings.map(heading =>
                new SplitText(heading, { type: "chars,words,lines", linesClass: "clip-text" })
            ),
            splitDescriptions = descriptions.map(desc =>
                new SplitText(desc, { type: "lines, words", linesClass: "clip-line" })
            ),
            currentIndex = 0,
            animating;

        splitHeadings.forEach((split, i) => {
            gsap.set(split.chars, {
                autoAlpha: i === 0 ? 1 : 0,
                yPercent: i === 0 ? 0 : 150
            });
        });

        splitDescriptions.forEach((split, i) => {
            gsap.set(split.words, {
                autoAlpha: i === 0 ? 1 : 0,
                yPercent: i === 0 ? 0 : 100
            });
        });

        images.forEach((img, i) => {
            gsap.set(img, {
                autoAlpha: i === 0 ? 1 : 0,
            });
        });

        function gotoSection(index, direction) {
            if (index < 0 || index >= headings.length) {
                intentObserver.disable();
                return;
            }

            animating = true;
            let fromTop = direction === -1,
                dFactor = fromTop ? -1 : 1,
                tl = gsap.timeline({
                    defaults: { duration: 1.25, ease: "power1.inOut" },
                    onComplete: () => animating = false
                });

            let currentHeadingSplit = splitHeadings[currentIndex];
            let nextHeadingSplit = splitHeadings[index];

            let currentDescSplit = splitDescriptions[currentIndex];
            let nextDescSplit = splitDescriptions[index];

            let currentImage = images[currentIndex];
            let nextImage = images[index];

            // Heading animation
            tl.to(currentHeadingSplit.chars, {
                autoAlpha: 0,
                yPercent: -150 * dFactor,
                duration: 1,
                ease: "power2",
                stagger: 0.01
            }, 0);

            tl.fromTo(nextHeadingSplit.chars, {
                autoAlpha: 0,
                yPercent: 150 * dFactor
            }, {
                autoAlpha: 1,
                yPercent: 0,
                duration: 1,
                ease: "power2",
                stagger: 0.02
            }, 0.2);

            // Description animation
            tl.to(currentDescSplit.words, {
                autoAlpha: 0,
                yPercent: -100 * dFactor,
                duration: 0.8,
                ease: "power2",
                stagger: 0.01
            }, 0);

            tl.fromTo(nextDescSplit.words, {
                autoAlpha: 0,
                yPercent: 100 * dFactor
            }, {
                autoAlpha: 1,
                yPercent: 0,
                duration: 0.8,
                ease: "power2",
                stagger: 0.01
            }, 0.25);

            // Images animation
            tl.to(currentImage, {
                autoAlpha: 0,
                duration: 1,
                ease: "power2.inOut"
            }, 0);

            tl.fromTo(nextImage, {
                autoAlpha: 0,
            }, {
                autoAlpha: 1,
                duration: 1,
                ease: "power2.out"
            }, 0.3);

            currentIndex = index;
        }

        let intentObserver = Observer.create({
            type: "wheel,touch,pointer",
            wheelSpeed: -1,
            onDown: () => !animating && gotoSection(currentIndex - 1, -1),
            onUp: () => !animating && gotoSection(currentIndex + 1, 1),
            tolerance: 10,
            preventDefault: true,
            onEnable(self) {
                ScrollTrigger.normalizeScroll(false);
            },
            onDisable(self) {
                ScrollTrigger.normalizeScroll(true);
            }
        });
        intentObserver.disable();

        ScrollTrigger.create({
            trigger: ".section_process-desktop",
            pin: true,
            start: "top top",
            end: "+=10",
            onEnter: (self) => {
                if (intentObserver.isEnabled) { return; }
                self.scroll(self.start + 1);
                intentObserver.enable();
            },
            onEnterBack: (self) => {
                if (intentObserver.isEnabled) { return; }
                self.scroll(self.end - 1);
                intentObserver.enable();
            },
        });
    }

    /**
     * Destroy scroll pin observer
     */
    function destroyScrollPinObserver() {
        Observer.getAll().forEach(observer => {
            observer.kill();
        });
    }

    /**
     * Initialize service process horizontal scroll
     */
    function serviceProcessScroll() {
        if (isMobile()) return;

        let processWrapper = document.querySelector(".service_process-contents");
        if (!processWrapper) return;

        processTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".section-service-process",
                start: "center center",
                end: "+=1500",
                scrub: true,
                pin: true,
                anticipatePin: 1
            },
            defaults: { ease: "none" }
        });

        processTl.fromTo(processWrapper, { x: 0 }, { x: -(processWrapper.offsetWidth - 1248) });
    }

    /**
     * Destroy service process scroll
     */
    function destroyServiceProcessScroll() {
        if (processTl) {
            processTl.kill();
            processTl = null;
        }
    }

    /**
     * Process Swiper - Mobile swiper for process section
     */


    let processSwiperInstance = null;

    /**
     * Initialize process swiper (mobile only)
     */
    function initProcessSwiper() {
        if (isMobile()) {
            processSwiperInstance = new Swiper('.is-process', {
                slidesPerView: 1,
                direction: 'horizontal',
                spaceBetween: 30,
                navigation: {
                    nextEl: '.process-next',
                    prevEl: '.process-prev',
                },
            });
        }
    }

    /**
     * Destroy process swiper instance
     */
    function destroyProcessSwiper() {
        if (processSwiperInstance && processSwiperInstance.destroy) {
            processSwiperInstance.destroy(true, true);
            processSwiperInstance = null;
        }
    }

    let scrollArrowTL = null;

    function initScrollArrows() {

      if (scrollArrowTL) {
        scrollArrowTL.kill();
        scrollArrowTL = null;
      }

      const arrow1 = document.querySelector(".arrow-1");
      const arrow2 = document.querySelector(".arrow-2");

      if (!arrow1 || !arrow2) return;

      scrollArrowTL = gsap.timeline({ repeat: -1 });

      scrollArrowTL
        .fromTo(arrow1,
          { y: 0, opacity: 0 },
          { y: 20, opacity: 1, duration: 0.5, ease: "power2.out" }
        )

        .to({}, { duration: 0.4 })

        .fromTo(arrow2,
          { y: 0, opacity: 0 },
          { y: 18, opacity: 1, duration: 0.5, ease: "power2.out" }
        )

        .to(arrow1, {
          opacity: 0,
          duration: 0.4,
          ease: "power1.out"
        })

        .to(arrow2, {
          opacity: 0,
          duration: 0.4,
          ease: "power1.out"
        })

        .set([arrow1, arrow2], { y: 0 });
    }

    function destroyScrollArrows() {
      if (scrollArrowTL) {
        scrollArrowTL.kill();
        scrollArrowTL = null;
      }
    }

    /**
     * About Page - Initialize and destroy animations
     */

    /**
     * Initialize all about page animations
     */
    function initAboutAnimations() {
        initHeroAnimation();
        initScrollArrows();
        animateMilestones();
        scrollPinObserver();
        brandTicker();
        initAccordionComponents();
        lineAnimation();
        initCharAnimations();
        initLineAnimations();
        applyParallaxEffect();
        animateSvgPaths();
        initProcessSwiper();
    }

    /**
     * Destroy all about page animations
     */
    function destroyAboutAnimations() {
        destroyHeroAnimation();
        destroyScrollPinObserver();
        destroyProcessSwiper();
        destroyBrandTicker();
        destroyAccordionComponents();
        destroyScrollArrows();
    }

    /**
     * HPI Hero Animation - Generic hero page intro animation
     * Used on Portfolio and Case Study pages
     */


    let heroTl$1 = null;

    /**
     * Initialize HPI hero animation
     */
    function initHPIHeroAnimation() {
        heroTl$1 = createHeroTimeline();

        const heroHeadline = document.querySelector(".hero-timeline-1");
        const heroPara = document.querySelector(".hero-timeline-2");

        if (!heroHeadline) return;

        const splitHeroHeadline = new SplitText(heroHeadline, { type: "chars,words,lines" });
        const splitHeroPara = heroPara ? new SplitText(heroPara, { type: "chars,words,lines" }) : null;

        heroTl$1.from(splitHeroHeadline.chars, {
                opacity: 0,
                x: 16,
                y: "30%",
                filter: "blur(10px)",
                stagger: 0.03,
            });

        if (splitHeroPara) {
            heroTl$1.from(splitHeroPara.words, {
                opacity: 0,
                x: 16,
                y: "30%",
                filter: "blur(10px)",
                stagger: 0.03,
            }, "-=0.5");
        }

        heroTl$1.fromTo(".hero-timeline-3", {
            clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
        }, {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 0.8,
            ease: "power1.inOut",
        }, "-=0.2");
    }

    /**
     * Destroy HPI hero animation
     */
    function destroyHPIHeroAnimation() {
        if (heroTl$1) heroTl$1.kill();
    }

    /**
     * Portfolio Filter - FLIP-based filtering for portfolio items
     */


    let filterPortfolioCleanupFns = [];

    /**
     * Initialize portfolio filter
     */
    function initFilterPortfolio() {
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

                const matches = activeCategories.some(cat => itemCategories.includes(cat));
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
    function destroyFilterPortfolio() {
        filterPortfolioCleanupFns.forEach(fn => fn());
        filterPortfolioCleanupFns = [];
    }

    /**
     * Portfolio Page - Initialize and destroy animations
     */


    /**
     * Initialize all portfolio page animations
     */
    function initPortfolioAnimations() {
        initHPIHeroAnimation();
        initCharAnimations();
        animateScrollingText();
        visionSectionAnimation();
        applyParallaxEffect();
        animateSvgPaths();
        initFilterPortfolio();
        animateCTA();
    }

    /**
     * Destroy all portfolio page animations
     */
    function destroyPortfolioAnimations() {
        destroyHPIHeroAnimation();
        destroyVisionSectionAnimation();
        destroyFilterPortfolio();
    }

    /**
     * Contact Hero Animation - Contact page hero with floating images and greeting cycle
     */


    let contactHeroTl = null;
    let contactCycleCall = null;

    /**
     * Initialize contact hero animation
     */
    function initContactHeroAnimation() {
        contactHeroTl = createHeroTimeline();

        const splitContactHeroHeadline = new SplitText(".contact_hero-tl-1", { type: "chars,words,lines" });
        const splitContactHeroPara = new SplitText(".contact_hero-tl-2", { type: "chars,words,lines" });
        const leftImages = ['.is-one', '.is-two', '.is-three'];
        const rightImages = ['.is-four', '.is-five', '.is-six'];

        contactHeroTl.from(splitContactHeroHeadline.chars, {
                opacity: 0,
                x: 16,
                y: "30%",
                filter: "blur(10px)",
                stagger: 0.03,
            })
            .from(splitContactHeroPara.words, {
                opacity: 0,
                x: 16,
                y: "30%",
                filter: "blur(10px)",
                stagger: 0.03,
            }, "-=0.5")
            .fromTo(".contact_hero-tl-3", {
                opacity: 0,
            }, {
                opacity: 1,
                duration: 0.8,
                ease: "power1.inOut",
            }, "-=0.2")
            .fromTo(leftImages, {
                x: -200,
                y: -100,
                scale: 0.5,
                rotation: -45,
                opacity: 0,
            }, {
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 1.5,
                ease: "power3.out",
                stagger: 0.2
            }, "<")
            .fromTo(rightImages, {
                x: 200,
                y: -100,
                scale: 0.5,
                rotation: 45,
                opacity: 0,
            }, {
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 1.5,
                ease: "power3.out",
                stagger: 0.2
            }, "-=1.3")
            .to(".scroll-down", {
                opacity: 1,
                duration: 1,
                ease: "power3.out"
            }, "-=1.3")
            .add(() => cycleHeadingWords())
            .add(() => initContactHeroFloatingEffect());
    }

    /**
     * Initialize floating effect for contact hero images
     */
    function initContactHeroFloatingEffect() {
        const floatTargets = [
            { selector: '.is-one', xFactor: 20, yFactor: 10, rotFactor: 5 },
            { selector: '.is-two', xFactor: 15, yFactor: 20, rotFactor: -6 },
            { selector: '.is-three', xFactor: 25, yFactor: 15, rotFactor: 4 },
            { selector: '.is-four', xFactor: -20, yFactor: 18, rotFactor: -5 },
            { selector: '.is-five', xFactor: -15, yFactor: 10, rotFactor: 6 },
            { selector: '.is-six', xFactor: -25, yFactor: 15, rotFactor: -4 },
            { selector: '.contact_hero-tl-3', xFactor: 60, yFactor: 40, rotFactor: 0 },
        ];

        const wrapper = document.querySelector(".section_contact-hero");
        if (!wrapper) return;

        wrapper.addEventListener("mousemove", (e) => {
            const { clientX, clientY } = e;
            const { width, height, left, top } = wrapper.getBoundingClientRect();
            const x = (clientX - left - width / 2) / width;
            const y = (clientY - top - height / 2) / height;

            floatTargets.forEach(({ selector, xFactor, yFactor, rotFactor }) => {
                gsap.to(selector, {
                    x: x * xFactor,
                    y: y * yFactor,
                    rotation: x * rotFactor,
                    duration: 0.6,
                    ease: "power2.out"
                });
            });
        });

        wrapper.addEventListener("mouseleave", () => {
            floatTargets.forEach(({ selector }) => {
                gsap.to(selector, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });
            });
        });
    }

    /**
     * Cycle through greeting words in different languages
     */
    function cycleHeadingWords() {
        const words = [
            "Namaste,",
            "Bonjour,",
            "Hej,",
            "Ciao,",
            "Hallo,",
            "안녕하세요,",
            "Hola,",
            "Hello,",
            "こんにちは,",
            "Marhaba,",
        ];

        const greetingText = document.querySelector("#greeting-text");
        if (!greetingText) return;

        let currentIndex = 0;

        const loop = () => {
            const nextWord = words[currentIndex];

            const charsOut = new SplitText(greetingText, { type: "chars" });
            const tl = gsap.timeline({
                onComplete: () => {
                    greetingText.textContent = nextWord;
                    const charsIn = new SplitText(greetingText, { type: "chars" });

                    gsap.fromTo(charsIn.chars, {
                        y: 20,
                        opacity: 0,
                    }, {
                        y: 0,
                        opacity: 1,
                        stagger: 0.03,
                        duration: 0.5,
                        ease: "power2.out"
                    });

                    currentIndex = (currentIndex + 1) % words.length;

                    contactCycleCall = gsap.delayedCall(2.5, loop);
                }
            });

            tl.to(charsOut.chars, {
                y: -20,
                opacity: 0,
                stagger: 0.03,
                duration: 0.4,
                ease: "power1.in"
            });
        };

        loop();
    }

    /**
     * Destroy contact hero animation
     */
    function destroyContactHeroAnimation() {
        if (contactHeroTl) contactHeroTl.kill();
        if (contactCycleCall) contactCycleCall.kill();
    }

    /**
     * Contact Page - Initialize and destroy animations
     */


    /**
     * Initialize all contact page animations
     */
    function initContactAnimations() {
        initCharAnimations();
        initContactHeroAnimation();
        initScrollArrows();

    }

    /**
     * Destroy all contact page animations
     */
    function destroyContactAnimations() {
        destroyContactHeroAnimation();
        destroyScrollArrows();
    }

    /**
     * Gallery Images Animation
     * Note: This function is referenced but not defined in the original code
     * Add your implementation here
     */

    /**
     * Animate gallery images
     */
    function animateGalleryImages() {
        // TODO: Implement gallery image animation
        // This function is called in case study but wasn't defined in the original code
        const galleryImages = document.querySelectorAll(".gallery_image");
        
        if (galleryImages.length === 0) return;

        galleryImages.forEach((image) => {
            gsap.from(image, {
                opacity: 0,
                scale: 0.9,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: image,
                    start: "top 85%",
                    toggleActions: "play none none none",
                }
            });
        });
    }

    /**
     * HappyFeet Case Study - Curved Text Animation
     */

    let curvedTextInstance = null;

    class CurvedTextAnimation {
        constructor() {
            this.text = 'Socks that define you';
            this.waveWidth = 250;
            this.waveHeight = 250;
            this.speed = 1;
            this.direction = 'rtl';
            this.animationEnabled = true;
            
            this.path = document.getElementById('wavePath');
            this.textPath = document.getElementById('textPath');
            this.svg = document.querySelector('.curved-text-svg');
            
            this.offset = 0;
            this.patternLength = 0;
            this.rafId = null;
            this.resizeHandler = this.handleResize.bind(this);
            
            this.init();
        }

        init() {
            const separator = ' • ';
            const singlePattern = this.text + separator;
            const repeatedText = singlePattern.repeat(20);
            this.textPath.textContent = repeatedText;
            
            setTimeout(() => {
                this.measureText();
                this.generateWavePath();
                
                if (this.animationEnabled) {
                    this.animate();
                }
            }, 100);
            
            window.addEventListener('resize', this.resizeHandler);
        }

        handleResize() {
            this.measureText();
            this.generateWavePath();
        }

        measureText() {
            try {
                const separator = ' • ';
                const singlePattern = this.text + separator;
                const tempText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                tempText.textContent = singlePattern;
                tempText.setAttribute('class', 'curved-text');
                this.svg.appendChild(tempText);
                const singleBBox = tempText.getBBox();
                this.patternLength = singleBBox.width;
                this.svg.removeChild(tempText);
            } catch (e) {
                this.patternLength = 500;
            }
        }

        generateWavePath() {
            const svgWidth = this.svg.clientWidth;
            const midPoint = this.waveHeight / 2;
            const amplitude = this.waveHeight / 4;
            
            const totalWidth = svgWidth + this.patternLength * 3;
            const cycles = Math.ceil(totalWidth / this.waveWidth);
            
            let pathData = `M -${this.waveWidth * 4} ${midPoint}`;
            
            for (let i = 0; i < cycles + 8; i++) {
                const x = (i * this.waveWidth) - (this.waveWidth * 4);
                const controlX = x + this.waveWidth / 2;
                
                if (i === 0) {
                    pathData += ` Q ${controlX} ${midPoint + amplitude}, ${x + this.waveWidth} ${midPoint}`;
                } else {
                    pathData += ` T ${x + this.waveWidth} ${midPoint}`;
                }
            }
            
            this.path.setAttribute('d', pathData);
        }

        animate() {
            const animateFrame = () => {
                if (!this.animationEnabled) return;
                
                const direction = this.direction === 'rtl' ? 1 : -1;
                this.offset += (0.8 * this.speed * direction);
                
                if (this.offset >= this.patternLength) {
                    this.offset = 0;
                } else if (this.offset <= -this.patternLength) {
                    this.offset = 0;
                }
                
                this.textPath.setAttribute('startOffset', this.offset);
                this.rafId = requestAnimationFrame(animateFrame);
            };
            
            this.rafId = requestAnimationFrame(animateFrame);
        }

        destroy() {
            this.animationEnabled = false;
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
            }
            window.removeEventListener('resize', this.resizeHandler);
        }
    }

    /**
     * Initialize HappyFeet curved text animation
     */
    function initHappyFeetAnimation() {
        const svg = document.querySelector('.curved-text-svg');
        if (!svg) return; // Guard: skip if elements don't exist
        
        curvedTextInstance = new CurvedTextAnimation();
    }

    /**
     * Destroy HappyFeet animation
     */
    function destroyHappyFeetAnimation() {
        if (curvedTextInstance) {
            curvedTextInstance.destroy();
            curvedTextInstance = null;
        }
    }

    // Habitus SVG Scroll Animation

    let habitusInstances = [];
    let habitusActive = false;

    function initHabitusSVG() {
      if (habitusActive) return;

      const svgs = document.querySelectorAll(".habitus_svg");
      if (!svgs.length) return;

      habitusActive = true;

      gsap.set(".habitus_svg path, .habitus_svg line, .habitus_svg circle", {
        drawSVG: "0%",
      });

      svgs.forEach((svg) => {
        const line = svg.querySelector(".is-line");
        if (!line) return;

        const primary = svg.querySelector(".is-primary");
        const remainingPaths = svg.querySelectorAll(
          "path:not(.is-line):not(.is-primary)"
        );
        const circles = svg.querySelectorAll("circle");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: svg,
            start: "top 80%",
            end: "bottom 50%",
            scrub: true,
          }
        });

        // 1️⃣ Driver line (solo)
        tl.to(line, {
          drawSVG: "100%",
          ease: "none",
        });

        // 2️⃣ Rest of SVG (paths + circles together)
        if (primary) {
          tl.to(primary, {
            drawSVG: "100%",
            ease: "none",
          },
          ">");
        }

        if (remainingPaths.length) {
          tl.to(
            remainingPaths,
            {
              drawSVG: "100%",
              ease: "none",
              stagger: 0.07,
            },
            "<"
          );
        }

        if (circles.length) {
          tl.to(
            circles,
            {
              drawSVG: "100%",
              ease: "none",
              stagger: 0.1,
            }
          );
        }

        habitusInstances.push({
          timeline: tl,
          scrollTrigger: tl.scrollTrigger,
        });
      });

      ScrollTrigger.refresh();
    }

    function destroyHabitusSVG() {
      if (!habitusActive) return;

      habitusInstances.forEach(({ timeline, scrollTrigger }) => {
        timeline?.kill();
        scrollTrigger?.kill();
      });

      habitusInstances = [];
      habitusActive = false;
    }

    let gyglTextPathTween = null;
    let gyglTextPathEl = null;

    function initGyglTextPathAnimation() {
      gyglTextPathEl = document.querySelector("#text-path");
      if (!gyglTextPathEl) return;

      // prevent duplicate init
      if (gyglTextPathTween) return;

      gyglTextPathTween = gsap.to(gyglTextPathEl, {
        duration: 40,
        repeat: -1,
        ease: "linear",
        attr: { startOffset: "100%" }
      });
    }

    function destroyGyglTextPathAnimation() {
      if (!gyglTextPathEl) return;

      if (gyglTextPathTween) {
        gyglTextPathTween.kill();
        gyglTextPathTween = null;
      }

      gyglTextPathEl = null;
    }

    // Marquee SVG animation
    let marqueeTweens = [];
    let marqueeActive = false;

    function initSkaiMarqueeSVG() {
      if (marqueeActive) return;

      const svgs = document.querySelectorAll(".marquee_text-svg");
      if (!svgs.length) return;

      const wrapper = svgs[0].parentElement;
      if (!wrapper) return;

      const speed = 80; // px per second
      const totalWidth = wrapper.scrollWidth;

      marqueeActive = true;
      marqueeTweens = [];

      svgs.forEach((svg) => {
        const startX = svg.offsetLeft;

        const tween = gsap.to(svg, {
          x: -totalWidth,
          duration: totalWidth / speed,
          ease: "linear",
          repeat: -1,
          onRepeat: () => {
            gsap.set(svg, { x: startX });
          },
        });

        marqueeTweens.push({ svg, startX, tween });
      });
    }

    function destroySkaiMarqueeSVG() {
      if (!marqueeActive) return;

      marqueeTweens.forEach(({ svg, startX, tween }) => {
        tween.kill();
        gsap.set(svg, { x: startX });
      });

      marqueeTweens = [];
      marqueeActive = false;
    }

    let rotateGroupTween = null;
    let rotateGroupEls = null;

    function initFloutRotateGroupAnimation() {
      rotateGroupEls = document.querySelectorAll(".rotate-group");
      if (!rotateGroupEls.length) return;

      // prevent duplicate init
      if (rotateGroupTween) return;

      rotateGroupTween = gsap.to(rotateGroupEls, {
        rotation: 360,
        duration: 25,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
        transformBox: "fill-box"
      });
    }

    function destroyFloutRotateGroupAnimation() {
      if (!rotateGroupEls || !rotateGroupEls.length) return;

      if (rotateGroupTween) {
        rotateGroupTween.kill();
        rotateGroupTween = null;
      }

      rotateGroupEls = null;
    }

    function initCasePreviewIframe() {
      // Guard 1: Ensure section exists
      const section = document.querySelector(".case-preview_screen");
      if (!section) return;

      // Guard 2: Ensure link element exists
      const linkElement = section.querySelector(".web_preview-link");
      if (!linkElement) return;

      let url = linkElement.textContent.trim();
      if (!url) return;

      // Guard 3: Ensure iframe exists
      const iframe = section.querySelector("iframe");
      if (!iframe) return;

      // Guard 4: Add protocol if missing
      if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }

      // Prevent unnecessary reassignments
      if (iframe.src === url) return;

      iframe.src = url;
    }

    /**
     * Case Study Page - Initialize and destroy animations
     */

    /**
     * Initialize all case study page animations
     */
    function initCaseStudyAnimations() {
        initHPIHeroAnimation();
        applyParallaxEffect();
        initCharAnimations();
        initLineAnimations();
        featuredWorkLoop();
        animateCTA();
        animateGalleryImages();

        // Variant animations (element-guarded)
        // Case Study ticker
        initHorizontalTicker(".case_studies-ticker-element", ".case_study-ticker-image");
        // LivX ticker
        initHorizontalTicker(".is-livx-texts", ".livx_ticker-text");
        hopscotchTicker();
        initHappyFeetAnimation();
        initHabitusSVG();
        initGyglTextPathAnimation();
        initFloutRotateGroupAnimation();
        initSkaiMarqueeSVG();
        initMarqueeSVG("blitz-text-svg");
        initMarqueeSVG("gygl-marquee-svg");
        initCasePreviewIframe();
    }

    /**
     * Destroy all case study page animations
     */
    function destroyCaseStudyAnimations() {
        destroyHPIHeroAnimation();
        destroyTickers();
        destroyHorizontalTickers();
        destroyHappyFeetAnimation();
        destroyHabitusSVG();
        destroyGyglTextPathAnimation();
        destroySkaiMarqueeSVG();
        destroyFloutRotateGroupAnimation();
        destroyMarqueeSVG();
    }

    /**
     * Featured Swiper - Swiper for featured projects
     */

    let featuredSwiperInstance = null;

    /**
     * Initialize featured swiper
     */
    function initFeaturedSwiper() {
        featuredSwiperInstance = new Swiper('.is-featured-swiper', {
            slidesPerView: 1,
            direction: 'horizontal',
            spaceBetween: 20,
            loop: true,
            navigation: {
                nextEl: '.featured-next',
                prevEl: '.featured-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 38,
                }
            }
        });
    }

    /**
     * Destroy featured swiper instance
     */
    function destroyFeaturedSwiper() {
        if (featuredSwiperInstance && featuredSwiperInstance.destroy) {
            featuredSwiperInstance.destroy(true, true);
            featuredSwiperInstance = null;
            console.log("Featured swiper destroyed");
        }
    }

    /**
     * Service Page - Initialize and destroy animations
     */


    /**
     * Initialize all service page animations
     */
    function initServiceAnimations() {
        initHeroAnimation();
        initScrollArrows();
        initAccordionComponents();
        lineAnimation();
        animateWorkImages();
        initCharAnimations();
        animateSvgPaths();
        initFeaturedSwiper();
        serviceProcessScroll();
        serviceHoverAnimation();
        initTestimonialsSwiperScripts();
    }

    /**
     * Destroy all service page animations
     */
    function destroyServiceAnimations() {
        destroyHeroAnimation();
        destroyAccordionComponents();
        destroyFeaturedSwiper();
        destroyServiceProcessScroll();
        destroyServiceHoverAnimation();
        destroyFeaturedWorkLoop();
        destroyTestimonialsSwiperScripts();
        destroyScrollArrows();
    }

    /**
     * Thank You Hero Animation - Thank you page hero
     */


    let thankHeroTl = null;

    /**
     * Initialize thank you hero animation
     */
    function initThankHeroAnimation() {
        thankHeroTl = createHeroTimeline();

        const splitThankHeroHeadline = new SplitText(".thank_hero-tl-1", { type: "chars,words,lines" });
        const splitThankHeroPara = new SplitText(".thank_hero-tl-2", { type: "chars,words,lines" });

        thankHeroTl.from(splitThankHeroHeadline.chars, {
                opacity: 0,
                x: 16,
                y: "30%",
                filter: "blur(10px)",
                stagger: 0.02,
            })
            .from(splitThankHeroPara.words, {
                opacity: 0,
                x: 16,
                y: "30%",
                filter: "blur(10px)",
                stagger: 0.03,
            }, "-=0.5")
            .from(".thank_hero-tl-3", {
                opacity: 0,
                duration: 1,
                ease: "power3.out",
            }, "-=1.3");
    }

    /**
     * Destroy thank you hero animation
     */
    function destroyThankHeroAnimation() {
        if (thankHeroTl) thankHeroTl.kill();
    }

    /**
     * Thank You Page - Initialize and destroy animations
     */


    /**
     * Initialize all thank you page animations
     */
    function initThankAnimations() {
        initThankHeroAnimation();
    }

    /**
     * Destroy all thank you page animations
     */
    function destroyThankAnimations() {
        destroyThankHeroAnimation();
    }

    /**
     * Blog Hero Animation - Hero intro animation for blog pages
     * Similar to HPI Hero but without image animation
     */


    let heroTl = null;

    /**
     * Initialize Blog hero animation
     */
    function initBlogHeroAnimation() {
        heroTl = createHeroTimeline();

        const heroHeadline = document.querySelector(".hero-timeline-1");
        const heroPara = document.querySelector(".hero-timeline-2");
        const blogCards = document.querySelectorAll(".related_blog-item");

        if (!heroHeadline) return;

        const splitHeroHeadline = new SplitText(heroHeadline, { type: "chars,words,lines" });
        const splitHeroPara = heroPara ? new SplitText(heroPara, { type: "chars,words,lines" }) : null;

        heroTl.from(splitHeroHeadline.chars, {
                opacity: 0,
                x: 16,
                y: "30%",
                filter: "blur(10px)",
                stagger: 0.03,
            });

        if (splitHeroPara) {
            heroTl.from(splitHeroPara.words, {
                opacity: 0,
                x: 16,
                y: "30%",
                filter: "blur(10px)",
                stagger: 0.03,
            }, "-=0.5");
        }
        if (blogCards.length) {
            heroTl.from(blogCards, {
                opacity: 0,
                y: 30,
                filter: "blur(8px)",
                stagger: 0.2,
                duration: 1,
                ease: "power2.out",
            }, "-=0.3");
        }
    }

    /**
     * Destroy Blog hero animation
     */
    function destroyBlogHeroAnimation() {
        if (heroTl) heroTl.kill();
    }

    /**
     * Blog Page - Initialize and destroy animations
     */


    /**
     * Initialize all blog page animations
     */
    function initBlogAnimations() {
        initBlogHeroAnimation();
        animateCTA();
    }

    /**
     * Destroy all blog page animations
     */
    function destroyBlogAnimations() {
        destroyBlogHeroAnimation();
    }

    /**
     * Share Button - Native share or copy URL to clipboard
     */

    let shareButtons = [];

    /**
     * Handle share button click
     * Uses Web Share API on supported devices, fallback to clipboard copy
     */
    function handleShare(e) {
        e.preventDefault();
        
        const shareData = {
            title: document.title,
            text: document.querySelector('meta[name="description"]')?.content || '',
            url: window.location.href
        };

        // Use native share if available (primarily mobile)
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            navigator.share(shareData).catch((err) => {
                // User cancelled or share failed - fallback to clipboard
                if (err.name !== 'AbortError') {
                    copyToClipboard(shareData.url, e.currentTarget);
                }
            });
        } else {
            // Fallback: copy URL to clipboard
            copyToClipboard(shareData.url, e.currentTarget);
        }
    }

    /**
     * Copy URL to clipboard and show feedback
     */
    function copyToClipboard(url, button) {
        navigator.clipboard.writeText(url).then(() => {
            showCopyFeedback(button, true);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                showCopyFeedback(button, true);
            } catch (err) {
                showCopyFeedback(button, false);
            }
            
            document.body.removeChild(textArea);
        });
    }

    /**
     * Show visual feedback after copy action
     */
    function showCopyFeedback(button, success) {
        const originalText = button.textContent;
        const feedbackText = success ? 'Link Copied!' : 'Copy Failed';
        
        button.textContent = feedbackText;
        button.classList.add('is-copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('is-copied');
        }, 2000);
    }

    /**
     * Initialize share button functionality
     */
    function initShareButton() {
        shareButtons = document.querySelectorAll('.blog_share');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', handleShare);
        });
    }

    /**
     * Destroy share button event listeners
     */
    function destroyShareButton() {
        shareButtons.forEach(button => {
            button.removeEventListener('click', handleShare);
        });
        shareButtons = [];
    }

    /**
     * Table of Contents - Dynamically generates TOC from H2 headings
     * Includes sticky sidebar functionality using ScrollTrigger pin
     */


    // Store click handlers for cleanup
    let clickHandlers = [];
    let sideInfoPin = null;

    // Mobile drawer state
    let mobileTocOpen = false;
    let mobileTocHandlers = {
        wrapperClick: null,
        outsideClick: null,
    };

    /**
     * Generate a URL-friendly slug from text
     * @param {string} text 
     * @returns {string}
     */
    function slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Initialize Table of Contents
     * Fetches H2 tags from .blog_content and creates anchor links in .toc_lists
     */
    function initTableOfContents() {
        const blogContent = document.querySelector('.blog_content');
        const tocContainer = document.querySelector('.toc_lists');

        if (!blogContent || !tocContainer) return;

        // Get all H2 headings inside blog content
        const headings = blogContent.querySelectorAll('h2');

        if (headings.length === 0) return;

        // Clear existing TOC links
        tocContainer.innerHTML = '';

        // Reset handlers array
        clickHandlers = [];

        headings.forEach((heading, index) => {
            // Generate or use existing ID for the heading
            if (!heading.id) {
                const slug = slugify(heading.textContent);
                heading.id = slug || `heading-${index}`;
            }

            // Create anchor link
            const link = document.createElement('p');
            link.className = 'toc_list-link';
            link.classList.add('link-hover-ix');
            link.textContent = heading.textContent;

            // Create click handler
            const clickHandler = () => {
                const smoother = getSmoother();
                if (smoother) {
                    // Use ScrollSmoother's scrollTo method
                    smoother.scrollTo(heading, true, 'top top+=100');
                } else {
                    // Fallback for non-smooth scroll
                    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            };

            // Add event listener
            link.addEventListener('click', clickHandler);

            // Store handler for cleanup
            clickHandlers.push({ element: link, handler: clickHandler });

            // Append link to TOC container
            tocContainer.appendChild(link);
        });

        // Initialize sticky sidebar (desktop) or mobile drawer
        initStickySidebar();
        initMobileTocDrawer();
    }

    /**
     * Initialize sticky sidebar using ScrollTrigger pin
     * Works with ScrollSmoother where CSS sticky doesn't
     */
    function initStickySidebar() {
        // Skip sticky on mobile
        if (isMobile()) return;

        const contentWrapper = document.querySelector('.blog_content-wrapper');
        const sideInfo = document.querySelector('.blog_side-info-wrapper');

        if (!contentWrapper || !sideInfo) return;

        sideInfoPin = ScrollTrigger.create({
            trigger: sideInfo,
            start: 'top top+=100', // Adjust offset based on nav height
            endTrigger: contentWrapper,
            end: 'bottom bottom',
            pin: true,
            pinSpacing: false,
        });
    }

    /**
     * Destroy sticky sidebar
     */
    function destroyStickySidebar() {
        if (sideInfoPin) {
            sideInfoPin.kill();
            sideInfoPin = null;
        }
    }

    /**
     * Open mobile TOC drawer with animation
     */
    function openMobileToc() {
        const tocLists = document.querySelector('.toc_lists');
        if (!tocLists || mobileTocOpen) return;

        mobileTocOpen = true;
        tocLists.style.display = 'flex';

        gsap.fromTo(tocLists, 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
    }

    /**
     * Close mobile TOC drawer with animation
     */
    function closeMobileToc() {
        const tocLists = document.querySelector('.toc_lists');
        if (!tocLists || !mobileTocOpen) return;

        gsap.to(tocLists, {
            y: 20,
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => {
                tocLists.style.display = 'none';
                mobileTocOpen = false;
            }
        });
    }

    /**
     * Initialize mobile TOC drawer functionality
     * Opens/closes the TOC list on mobile devices
     */
    function initMobileTocDrawer() {
        // Only initialize on mobile
        if (!isMobile()) return;

        const tocWrapper = document.querySelector('.blog_toc-wrapper');
        const tocLists = document.querySelector('.toc_lists');

        if (!tocWrapper || !tocLists) return;

        // Toggle drawer on wrapper click
        mobileTocHandlers.wrapperClick = (e) => {
            // Don't toggle if clicking on a link inside
            if (e.target.closest('.toc_list-link')) return;

            if (mobileTocOpen) {
                closeMobileToc();
            } else {
                openMobileToc();
            }
        };

        // Close drawer when clicking outside
        mobileTocHandlers.outsideClick = (e) => {
            if (mobileTocOpen && !tocWrapper.contains(e.target)) {
                closeMobileToc();
            }
        };

        // Add close handler to TOC links
        clickHandlers.forEach(({ element }) => {
            element.onclick;
            element.addEventListener('click', () => {
                if (isMobile()) {
                    closeMobileToc();
                }
            });
        });

        tocWrapper.addEventListener('click', mobileTocHandlers.wrapperClick);
        document.addEventListener('click', mobileTocHandlers.outsideClick);
    }

    /**
     * Destroy mobile TOC drawer
     */
    function destroyMobileTocDrawer() {
        const tocWrapper = document.querySelector('.blog_toc-wrapper');

        if (tocWrapper && mobileTocHandlers.wrapperClick) {
            tocWrapper.removeEventListener('click', mobileTocHandlers.wrapperClick);
        }

        if (mobileTocHandlers.outsideClick) {
            document.removeEventListener('click', mobileTocHandlers.outsideClick);
        }

        mobileTocHandlers.wrapperClick = null;
        mobileTocHandlers.outsideClick = null;
        mobileTocOpen = false;
    }

    /**
     * Destroy Table of Contents
     * Removes event listeners and cleans up
     */
    function destroyTableOfContents() {
        // Kill sticky sidebar and mobile drawer
        destroyStickySidebar();
        destroyMobileTocDrawer();

        // Remove all click handlers
        clickHandlers.forEach(({ element, handler }) => {
            element.removeEventListener('click', handler);
        });

        // Clear handlers array
        clickHandlers = [];
    }

    /**
     * Blog Post Page (CMS) - Initialize and destroy animations
     */


    let blogPostTl = null;

    /**
     * Initialize all blog post page animations
     */
    function initBlogPostAnimations() {
        blogPostTl = createHeroTimeline();
        animateSvgPaths();
        initShareButton();
        animateCTA();
        initTableOfContents();
    }

    /**
     * Destroy all blog post page animations
     */
    function destroyBlogPostAnimations() {
        if (blogPostTl) blogPostTl.kill();
        destroyShareButton();
        destroyTableOfContents();
    }

    /**
     * Barba.js Configuration - Page transitions and view management
     */


    /**
     * Initialize Barba.js with all transitions and views
     */
    function initBarba() {
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

    /**
     * Button Fill Hover - Radial fill effect on buttons
     */

    /**
     * Initialize button fill hover effect
     */
    function buttonFillHover() {
        document.querySelectorAll(".button.is-fill").forEach(button => {
            const flair = button.querySelector(".button__flair");

            button.addEventListener("mouseenter", (e) => {
                const { left, top } = button.getBoundingClientRect();
                gsap.set(flair, {
                    x: e.clientX - left,
                    y: e.clientY - top,
                    scale: 0
                });

                gsap.to(flair, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            button.addEventListener("mousemove", (e) => {
                const { left, top } = button.getBoundingClientRect();
                gsap.to(flair, {
                    x: e.clientX - left,
                    y: e.clientY - top,
                    duration: 0.2,
                    ease: "power3.out"
                });
            });

            button.addEventListener("mouseleave", () => {
                gsap.to(flair, {
                    scale: 0,
                    duration: 0.3,
                    ease: "power2.inOut"
                });
            });
        });
    }

    /**
     * Navigation Hover Animations - Link hover effects
     */

    /**
     * Initialize sub navigation hover animation
     */
    function initNavHoverAnimation() {
        const allBlocks = document.querySelectorAll('.nav_link-block');
        
        allBlocks.forEach(block => {
            const arrow = block.querySelector('.nav_arrow-icon','.nav_link-block-services');
            const link = block.querySelector('.nav_link');

            block.addEventListener('mouseenter', () => {
                // Fade out other blocks
                allBlocks.forEach(otherBlock => {
                    if (otherBlock !== block) {
                        gsap.to(otherBlock, { opacity: 0.4, duration: 0.3, overwrite: true });
                    }
                });

                // Animate current block
                gsap.to(arrow, { opacity: 1, x: 0, duration: 0.3 });
                gsap.to(link, { left: 30, opacity: 1, duration: 0.3 });
            });

            block.addEventListener('mouseleave', () => {
                // Restore opacity to all blocks
                allBlocks.forEach(otherBlock => {
                    gsap.to(otherBlock, { opacity: 1, duration: 0.3 });
                });

                // Reset current block
                gsap.to(arrow, { opacity: 0, x: -30, duration: 0.3 });
                gsap.to(link, { left: 0, duration: 0.3 });
            });
        });
    }

    /**
     * Initialize sub-menu navigation hover (Services dropdown)
     */
    function initSubMenuNavHover() {
        const serviceBlock = document.querySelector('.nav_link-block-services');
        if (!serviceBlock) return;

        const allBlocks = document.querySelectorAll('.nav_link-block');
        const serviceArrow = serviceBlock.querySelector('.nav_arrow-icon');
        const subNavWrapper = serviceBlock.querySelector('.sub_nav-wrapper');
        const subNav = serviceBlock.querySelector('.nav_link');
        const subNavLinks = subNavWrapper.querySelectorAll('.sub_nav-link');

        serviceBlock.addEventListener('mouseenter', () => {
            // Fade out other blocks
            allBlocks.forEach(otherBlock => {
                if (otherBlock !== serviceBlock) {
                    gsap.to(otherBlock, { opacity: 0.4, duration: 0.3, overwrite: true });
                }
            });

            gsap.to(serviceArrow, { opacity: 1, x: 0, duration: 0.3 });
            gsap.set(subNavLinks, { x: -20, opacity: 0, display: "block" });
            gsap.to(subNav, { left: 30, opacity: 1, duration: 0.3 });
            gsap.to(subNavLinks, {
                x: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                overwrite: true,
            });
        });

        serviceBlock.addEventListener('mouseleave', () => {
            // Restore opacity to all blocks
            allBlocks.forEach(otherBlock => {
                gsap.to(otherBlock, { opacity: 1, duration: 0.3 });
            });

            gsap.to(serviceArrow, { opacity: 0, x: -30, duration: 0.3 });
            gsap.to(subNav, { left: 0, duration: 0.3 });
            gsap.to(subNavLinks, {
                x: -20,
                opacity: 0,
                duration: 0.3,
                stagger: { each: 0.05, from: "end" },
                ease: "power2.out",
                overwrite: true,
                onComplete: () => {
                    gsap.set(subNavLinks, { display: "none" });
                }
            });
        });
        // Add hover effect for individual submenu items
        subNavLinks.forEach(subLink => {
            subLink.addEventListener('mouseenter', () => {
                // Fade out other submenu links
                subNavLinks.forEach(otherLink => {
                    if (otherLink !== subLink) {
                        gsap.to(otherLink, { opacity: 0.4, duration: 0.3 });
                    }
                });
            });

            subLink.addEventListener('mouseleave', () => {
                // Restore opacity to all submenu links
                subNavLinks.forEach(otherLink => {
                    gsap.to(otherLink, { opacity: 1, duration: 0.3 });
                });
            });
        });
    }

    /**
     * Brandemic - Main Entry Point
     * 
     * This is the main entry point for all animations and interactions.
     * The code is organized into modular components for better maintainability.
     * 
     * Structure:
     * - /core       - Core functionality (GSAP, Barba, ScrollSmoother, Webflow)
     * - /components - Reusable UI components (cursor, navigation, buttons, video, swipers)
     * - /animations - Animation modules (text, scroll, SVG, sections, hero)
     * - /pages      - Page-specific animation orchestration
     * - /footer     - Footer animations
     * - /utils      - Utility functions
     */


    /**
     * Main initialization function
     * Called when DOM is ready and fonts are loaded
     */
    function init() {
        const mobile = isMobile();

        // Initialize Barba.js for page transitions
        initBarba();

        // Initialize smooth scrolling
        initSmoothScroller();

        // Desktop-only features
        if (!mobile) {
            window.addEventListener("load", () => {
                ScrollTrigger.refresh();
            });

            customCursorInit();
            mouseHover();
            buttonFillHover();
        }

        // Navigation
        megaMenuToggle();
        initNavHoverAnimation();
        initSubMenuNavHover();

        // Footer
        footerLimitless();
        copyYear();
    }

    /**
     * Bootstrap the application
     */
    document.addEventListener("DOMContentLoaded", (event) => {
        document.fonts.ready.then(() => {
            // Register GSAP plugins
            registerGSAPPlugins();

            // Initialize the app
            init();
        });
    });

})();
