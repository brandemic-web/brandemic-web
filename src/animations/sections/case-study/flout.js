let rotateGroupTween = null;
let rotateGroupEls = null;

export function initFloutRotateGroupAnimation() {
  rotateGroupEls = document.querySelectorAll('[data-anim-attr="rotate-group"]');
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

export function destroyFloutRotateGroupAnimation() {
  if (!rotateGroupEls || !rotateGroupEls.length) return;

  if (rotateGroupTween) {
    rotateGroupTween.kill();
    rotateGroupTween = null;
  }

  rotateGroupEls = null;
}
