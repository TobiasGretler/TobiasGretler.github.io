/**
 * Site scripts (based on PhotoFolio v1.2.0 by BootstrapMade.com)
 * Template URL: https://bootstrapmade.com/photofolio-bootstrap-photography-website-template/
 * License: https://bootstrapmade.com/license/
 */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  // ---------------------------------------------------------------------------
  // Preloader
  // ---------------------------------------------------------------------------
  function initPreloader() {
    const preloader = $("#preloader");
    if (!preloader) return;

    window.addEventListener("load", () => {
      setTimeout(() => preloader.classList.add("loaded"), 1000);
      setTimeout(() => preloader.remove(), 2000);
    });
  }

  // ---------------------------------------------------------------------------
  // Mobile navigation
  // ---------------------------------------------------------------------------
  function initMobileNav() {
    const showIcon = $(".mobile-nav-show");
    const hideIcon = $(".mobile-nav-hide");

    const isOpen = () => document.body.classList.contains("mobile-nav-active");

    const toggleNav = () => {
      document.body.classList.toggle("mobile-nav-active");
      showIcon?.classList.toggle("d-none");
      hideIcon?.classList.toggle("d-none");
    };

    // Burger / close button
    $$(".mobile-nav-toggle").forEach((button) =>
      button.addEventListener("click", (event) => {
        event.preventDefault();
        toggleNav();
      })
    );

    // Close the menu after clicking an in-page (#hash) link
    $$("#navbar a").forEach((link) => {
      if (!link.hash || !$(link.hash)) return;
      link.addEventListener("click", () => isOpen() && toggleNav());
    });

    // Dropdowns only act as accordions while the mobile menu is open
    $$(".navbar .dropdown > a").forEach((link) =>
      link.addEventListener("click", (event) => {
        if (!isOpen()) return;
        event.preventDefault();

        link.classList.toggle("active");
        link.nextElementSibling?.classList.toggle("dropdown-active");

        const indicator = $(".dropdown-indicator", link);
        indicator?.classList.toggle("bi-chevron-up");
        indicator?.classList.toggle("bi-chevron-down");
      })
    );
  }

  // ---------------------------------------------------------------------------
  // Scroll-to-top button
  // ---------------------------------------------------------------------------
  function initScrollTop() {
    const button = $(".scroll-top");
    if (!button) return;

    const update = () => button.classList.toggle("active", window.scrollY > 100);

    window.addEventListener("load", update);
    document.addEventListener("scroll", update, { passive: true });

    button.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---------------------------------------------------------------------------
  // Lightbox (GLightbox)
  // ---------------------------------------------------------------------------
  function initLightbox() {
    if (typeof GLightbox === "undefined" || !$(".glightbox")) return;
    GLightbox({ selector: ".glightbox" });
  }

  // ---------------------------------------------------------------------------
  // Sliders (Swiper)
  // ---------------------------------------------------------------------------
  const SWIPER_DEFAULTS = {
    speed: 600,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    slidesPerView: "auto",
    pagination: { el: ".swiper-pagination", type: "bullets", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
  };

  function initSwiper(selector, overrides = {}) {
    if (typeof Swiper === "undefined" || !$(selector)) return;
    new Swiper(selector, { ...SWIPER_DEFAULTS, ...overrides });
  }

  function initSliders() {
    // One slide at a time
    initSwiper(".slides-1");

    // Three slides on desktop, one on mobile
    initSwiper(".slides-3", {
      breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 40 },
        1200: { slidesPerView: 3 },
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Animation on scroll (AOS)
  // ---------------------------------------------------------------------------
  function initAOS() {
    window.addEventListener("load", () => {
      window.AOS?.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    initPreloader();
    initMobileNav();
    initScrollTop();
    initLightbox();
    initSliders();
    initAOS();
  });
})();
