(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Preloader */
  window.addEventListener("load", function () {
    var pre = document.getElementById("preloader");
    if (!pre) return;
    setTimeout(function () { pre.classList.add("done"); }, reduceMotion ? 0 : 500);
  });

  /* Sticky header state */
  var header = document.getElementById("site-header");
  var homeSection = document.getElementById("home");
  if (header && homeSection) {
    var onScroll = function () {
      var trigger = homeSection.offsetHeight - 90;
      if (window.scrollY > trigger) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Mobile nav */
  var menuToggle = document.getElementById("menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var mobileClose = document.getElementById("mobile-nav-close");
  function openMobile() {
    mobileNav.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMobile() {
    mobileNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", openMobile);
    mobileClose.addEventListener("click", closeMobile);
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMobile);
    });
  }

  /* Marquee: duplicate content once for seamless loop */
  document.querySelectorAll(".marquee-track").forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  /* Scroll reveal */
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(function (el, i) {
      el.style.setProperty("--i", i % 6);
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* WhatsApp inquiry form -> deep link, no backend required */
  var form = document.getElementById("inquiry-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#inq-name").value.trim();
      var fabric = form.querySelector("#inq-fabric").value;
      var msg = form.querySelector("#inq-message").value.trim();

      var lines = ["مرحباً فابريكو،"];
      if (name) lines.push("الاسم: " + name);
      if (fabric) lines.push("مهتم بقماش: " + fabric);
      if (msg) lines.push("الرسالة: " + msg);
      if (!name && !fabric && !msg) lines.push("حاب أستفسر عن أقمشتكم وأسعار الجملة.");

      var text = encodeURIComponent(lines.join("\n"));
      window.open("https://wa.me/201044888184?text=" + text, "_blank", "noopener");
    });
  }

  /* Current year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
