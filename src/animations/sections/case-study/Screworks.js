let screworksTween = null;
let screworksActive = false;

export function initScreworksSVG() {
  if (screworksActive) return;

  const el = document.querySelector('[data-anim-attr="is-animating-screworks-svg"]');
  if (!el) return;

  screworksActive = true;

  screworksTween = gsap.to(el, {
    rotation: 360,
    duration: 16,
    repeat: -1,
    ease: "none",
    transformOrigin: "50% 50%"
  });
}

export function destroyScreworksSVG() {
  if (!screworksActive) return;

  screworksTween?.kill();
  screworksTween = null;
  screworksActive = false;
}