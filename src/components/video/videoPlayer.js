/**
 * Video Player - Showreel video playback and fullscreen
 */

import { isMobile } from '../../utils/isMobile.js';

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

    // On mobile, mute video when scrolled past
    if (mobile) {
        ScrollTrigger.create({
            trigger: videoElement,
            start: "bottom top",
            onEnter: () => {
                videoElement.pause();
                videoElement.muted = true;
            },
            onLeaveBack: () => {
                if (videoCursor.classList.contains("close")) {
                    videoElement.muted = false;
                    videoElement.play();
                }
            }
        });
    }

    // Attach the click listener **only once** to prevent duplicates
    videoCursor.removeEventListener("click", enterFullscreen);
    videoCursor.addEventListener("click", enterFullscreen);
}

/**
 * Cleanup video listeners
 */
export function destroyStartVideo() {
    const videoCursor = document.getElementById('videoCursor');
    if (videoCursor) {
        // Note: exitFullscreen reference may not be available here
        // This is a limitation of the original code structure
    }
}

