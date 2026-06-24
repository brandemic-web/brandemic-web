// Marquee SVG animation
let marqueeTweens = [];
let marqueeActive = false;

export function initSkaiMarqueeSVG() {
  if (marqueeActive) return;

  const svgs = document.querySelectorAll('[data-anim-attr="marquee_text-svg"]');
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

export function destroySkaiMarqueeSVG() {
  if (!marqueeActive) return;

  marqueeTweens.forEach(({ svg, startX, tween }) => {
    tween.kill();
    gsap.set(svg, { x: startX });
  });

  marqueeTweens = [];
  marqueeActive = false;
}
