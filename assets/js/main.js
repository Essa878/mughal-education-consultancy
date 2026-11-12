/* ==========================================================================
   Mughal Education Consultants — shared site behaviour
   Header, mobile menu, contact links, reveal animations, cookie notice.
   ========================================================================== */

(function () {
  "use strict";

  var CONFIG = window.MT_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Contact details -------------------------------------------------
     Values live in config.js so the owner only edits one file.            */
  function digits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function hydrateContactDetails() {
    if (CONFIG.phone) {
      document.querySelectorAll("[data-phone]").forEach(function (el) {
        el.textContent = CONFIG.phone;
      });
    }
    if (CONFIG.phoneE164) {
      document.querySelectorAll("[data-phone-link]").forEach(function (el) {
        el.setAttribute("href", "tel:" + CONFIG.phoneE164.replace(/\s/g, ""));
      });
    }
    if (CONFIG.email) {
      document.querySelectorAll("[data-email]").forEach(function (el) {
        el.textContent = CONFIG.email;
      });
      document.querySelectorAll("[data-email-link]").forEach(function (el) {
        el.setAttribute("href", "mailto:" + CONFIG.email);
      });
    }
    if (CONFIG.location) {
      document.querySelectorAll("[data-location]").forEach(function (el) {
        el.textContent = CONFIG.location;
      });
    }

    var number = digits(CONFIG.whatsapp);
    if (!number) return;

    var messages = {
      study:
        "Hello Mughal Education Consultants, I am interested in studying in North Cyprus. Please provide information about universities, admission requirements and application procedures.",
      travel:
        "Hello Mughal Education Consultants, I would like information about your international travel services.",
      general: "Hello Mughal Education Consultants, I would like some information please."
    };

    document.querySelectorAll("[data-wa]").forEach(function (el) {
      var kind = el.getAttribute("data-wa") || "general";
      var text = messages[kind] || messages.general;
      el.setAttribute("href", "https://wa.me/" + number + "?text=" + encodeURIComponent(text));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }

  /* ---- Header ---------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var ticking = false;

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        header.classList.toggle("is-stuck", window.scrollY > 8);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Mobile menu ----------------------------------------------------- */
  function initMobileMenu() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;

    var panel = menu.querySelector(".mobile-menu__panel");
    var scrim = menu.querySelector(".mobile-menu__scrim");
    var closeBtn = menu.querySelector(".mobile-menu__close");
    var lastFocused = null;

    function focusable() {
      return Array.prototype.slice
        .call(panel.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'))
        .filter(function (el) {
          return el.offsetParent !== null;
        });
    }

    function openMenu() {
      lastFocused = document.activeElement;
      menu.classList.add("is-open");
      menu.removeAttribute("aria-hidden");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open", "is-locked");
      window.setTimeout(function () {
        var first = focusable()[0];
        if (first) first.focus();
      }, 60);
    }

    function closeMenu(returnFocus) {
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open", "is-locked");
      if (returnFocus !== false) {
        if (lastFocused && lastFocused.focus) lastFocused.focus();
        else toggle.focus();
      }
    }

    toggle.addEventListener("click", function () {
      if (menu.classList.contains("is-open")) closeMenu();
      else openMenu();
    });

    if (closeBtn) closeBtn.addEventListener("click", function () { closeMenu(); });
    if (scrim) scrim.addEventListener("click", function () { closeMenu(); });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { closeMenu(false); });
    });

    document.addEventListener("keydown", function (event) {
      if (!menu.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;

      var items = focusable();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1300 && menu.classList.contains("is-open")) {
        closeMenu(false);
      }
    });
  }

  /* ---- Reveal on scroll ------------------------------------------------ */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (!("IntersectionObserver" in window) || reduceMotion) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    // Gentle stagger for cards inside the same grid.
    items.forEach(function (el) {
      var siblings = el.parentElement ? el.parentElement.querySelectorAll(":scope > [data-reveal]") : [];
      var index = Array.prototype.indexOf.call(siblings, el);
      if (index > 0) el.style.setProperty("--reveal-delay", Math.min(index, 3) * 90 + "ms");
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Cookie notice --------------------------------------------------- */
  function initCookies() {
    var bar = document.querySelector(".cookie-bar");
    if (!bar) return;

    var key = "mt-cookie-consent";
    var stored = null;
    try { stored = window.localStorage.getItem(key); } catch (e) { stored = null; }

    if (stored) return;

    bar.hidden = false;
    document.body.classList.add("has-cookies");
    window.setTimeout(function () { bar.classList.add("is-visible"); }, 900);

    function dismiss(value) {
      try { window.localStorage.setItem(key, value); } catch (e) { /* storage blocked */ }
      bar.classList.remove("is-visible");
      document.body.classList.remove("has-cookies");
      window.setTimeout(function () { bar.hidden = true; }, 420);
    }

    bar.querySelectorAll("[data-cookie-choice]").forEach(function (button) {
      button.addEventListener("click", function () {
        dismiss(button.getAttribute("data-cookie-choice") || "accepted");
      });
    });
  }

  /* ---- Print / save as PDF -------------------------------------------- */
  function initPrint() {
    document.querySelectorAll("[data-print]").forEach(function (button) {
      button.addEventListener("click", function () {
        window.print();
      });
    });
  }

  /* ---- Footer year ----------------------------------------------------- */
  function initYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = year;
    });
  }

  /* ---- Optional analytics --------------------------------------------- */
  function initAnalytics() {
    if (!CONFIG.analyticsId) return;
    var id = CONFIG.analyticsId;
    if (!/^G-[A-Z0-9]+$/i.test(id)) return;

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", id, { anonymize_ip: true });
  }

  function init() {
    hydrateContactDetails();
    initHeader();
    initMobileMenu();
    initReveal();
    initCookies();
    initPrint();
    initYear();
    initAnalytics();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
