gsap.registerPlugin(ScrollTrigger);

// Pin the heading for the duration of the services wrapper scroll
ScrollTrigger.create({
  trigger: ".services_offering-wrapper",
  start: "top top",          // when the wrapper hits the top of viewport
  end: () => `+=${document.querySelector(".services-wrapper").offsetHeight}`, // unpin after full services list has scrolled
  pin: ".services_offering-heading",
  pinSpacing: false,         // don't push content down — heading overlaps naturally
  anticipatePin: 1,          // smooths out the pin moment
});