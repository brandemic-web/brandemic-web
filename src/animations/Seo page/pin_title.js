gsap.registerPlugin(ScrollTrigger);

// Webflow uses its own scroll wrapper — tell ScrollTrigger about it
ScrollTrigger.defaults({
  scroller: "body"
});

window.Webflow && window.Webflow.push(function () {
  
  let servicesWrapper = document.querySelector(".services-wrapper");
  let heading = document.querySelector(".services_offering-heading");

  ScrollTrigger.create({
    trigger: ".services_offering-wrapper",
    start: "top top",
    end: () => "+=" + (servicesWrapper.offsetHeight - heading.offsetHeight),
    pin: ".services_offering-heading",
    pinSpacing: false,
    markers: true, // remove once working
  });

});