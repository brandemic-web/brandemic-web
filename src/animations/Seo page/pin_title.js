gsap.registerPlugin(ScrollTrigger);

let servicesWrapper = document.querySelector(".services-wrapper");
let heading = document.querySelector(".services_offering-heading");

ScrollTrigger.create({
  trigger: ".services_offering-wrapper",
  start: "top top",
  end: () => "+=" + (servicesWrapper.offsetHeight - heading.offsetHeight),
  pin: ".services_offering-heading",
  pinSpacing: false,
  markers: true, // ← add this temporarily to debug, remove once working
});