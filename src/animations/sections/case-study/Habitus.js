// Habitus SVG Scroll Animation

let habitusInstances = [];
let habitusActive = false;

export function initHabitusSVG() {
  if (habitusActive) return;

  const svgs = document.querySelectorAll('[data-anim-attr="habitus_svg"]');
  if (!svgs.length) return;

  habitusActive = true;

  gsap.set(".habitus_svg path, .habitus_svg line, .habitus_svg circle", {
    drawSVG: "0%",
  });

  svgs.forEach((svg) => {
    const line = svg.querySelector('[data-anim-attr="is-line"]');
    if (!line) return;

    const primary = svg.querySelector('[data-anim-attr="is-primary"]');
    const remainingPaths = svg.querySelectorAll(
      "path:not([data-anim-attr=\"is-line\"]):not([data-anim-attr=\"is-primary\"])"
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

export function destroyHabitusSVG() {
  if (!habitusActive) return;

  habitusInstances.forEach(({ timeline, scrollTrigger }) => {
    timeline?.kill();
    scrollTrigger?.kill();
  });

  habitusInstances = [];
  habitusActive = false;
}
