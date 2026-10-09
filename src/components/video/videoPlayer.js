/**
 * Video Player - Showreel video playback and fullscreen
 */

import { isMobile } from '../../utils/isMobile.js';

// Tracks the currently-bound fullscreen handlers so destroyStartVideo() can
// actually remove them instead of silently no-op'ing (see destroyStartVideo).
let activeVideoCursor = null;
let activeEnterFullscreen = null;
let activeExitFullscreen = null;

/**
 * Play showreel video
 */
export function playVideo() {
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
export function startVideo() {
    // Ensure any previously-bound listeners (from a prior startVideo() call)
    // are removed first, so repeated calls never stack duplicate handlers.
    destroyStartVideo();

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

    // // On mobile, mute video when scrolled past
    // if (mobile) {
    //     ScrollTrigger.create({
    //         trigger: videoElement,
    //         start: "bottom top",
    //         onEnter: () => {
    //             videoElement.pause();
    //             videoElement.muted = true;
    //         },
    //         onLeaveBack: () => {
    //             if (videoCursor.classList.contains("close")) {
    //                 videoElement.muted = false;
    //                 videoElement.play();
    //             }
    //         }
    //     });
    // }

    videoCursor.addEventListener("click", enterFullscreen);

    // Track these so destroyStartVideo() can remove the exact same references.
    activeVideoCursor = videoCursor;
    activeEnterFullscreen = enterFullscreen;
    activeExitFullscreen = exitFullscreen;
}

/**
 * Cleanup video listeners
 */
export function destroyStartVideo() {
    if (activeVideoCursor) {
        if (activeEnterFullscreen) {
            activeVideoCursor.removeEventListener("click", activeEnterFullscreen);
        }
        if (activeExitFullscreen) {
            activeVideoCursor.removeEventListener("click", activeExitFullscreen);
        }
    }
    if (activeExitFullscreen) {
        document.removeEventListener("keydown", activeExitFullscreen);
    }

    activeVideoCursor = null;
    activeEnterFullscreen = null;
    activeExitFullscreen = null;
}

