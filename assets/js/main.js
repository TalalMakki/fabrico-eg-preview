(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===== Language toggle (AR default / EN) ===== */
  var LANG_KEY = "fabrico-lang";
  var TRANSLATE_ATTRS = ["alt", "aria-label", "placeholder", "title", "content"];

  function translateEl(el, lang) {
    if (el.hasAttribute("data-en-html")) {
      if (!el.hasAttribute("data-ar-html")) el.setAttribute("data-ar-html", el.innerHTML);
      el.innerHTML = lang === "en" ? el.getAttribute("data-en-html") : el.getAttribute("data-ar-html");
    } else if (el.hasAttribute("data-en")) {
      if (!el.hasAttribute("data-ar")) el.setAttribute("data-ar", el.textContent);
      el.textContent = lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-ar");
    }
    TRANSLATE_ATTRS.forEach(function (attr) {
      var enAttr = "data-en-" + attr;
      if (!el.hasAttribute(enAttr)) return;
      var arAttr = "data-ar-" + attr;
      if (!el.hasAttribute(arAttr)) el.setAttribute(arAttr, el.getAttribute(attr) || "");
      el.setAttribute(attr, lang === "en" ? el.getAttribute(enAttr) : el.getAttribute(arAttr));
    });
  }

  function applyLanguage(lang) {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("data-current-lang", lang);
    document.body.classList.toggle("lang-en", lang === "en");

    document.querySelectorAll(
      "[data-en], [data-en-html], [data-en-alt], [data-en-aria-label], [data-en-placeholder], [data-en-title], [data-en-content]"
    ).forEach(function (el) { translateEl(el, lang); });

    document.querySelectorAll(".lang-toggle").forEach(function (btn) {
      btn.textContent = lang === "ar" ? "EN" : "عربي";
    });

    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  var savedLang = "ar";
  try { savedLang = localStorage.getItem(LANG_KEY) || "ar"; } catch (e) {}
  applyLanguage(savedLang);

  document.querySelectorAll(".lang-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-current-lang") || "ar";
      applyLanguage(current === "ar" ? "en" : "ar");
    });
  });

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

      var currentLang = document.documentElement.getAttribute("data-current-lang") || "ar";
      var lines;
      if (currentLang === "en") {
        lines = ["Hello Fabrico,"];
        if (name) lines.push("Name: " + name);
        if (fabric) lines.push("Interested in fabric: " + fabric);
        if (msg) lines.push("Message: " + msg);
        if (!name && !fabric && !msg) lines.push("I'd like to ask about your fabrics and wholesale prices.");
      } else {
        lines = ["مرحباً فابريكو،"];
        if (name) lines.push("الاسم: " + name);
        if (fabric) lines.push("مهتم بقماش: " + fabric);
        if (msg) lines.push("الرسالة: " + msg);
        if (!name && !fabric && !msg) lines.push("حاب أستفسر عن أقمشتكم وأسعار الجملة.");
      }

      var text = encodeURIComponent(lines.join("\n"));
      window.open("https://wa.me/201044888184?text=" + text, "_blank", "noopener");
    });
  }

  /* Current year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
