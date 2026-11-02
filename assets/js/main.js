/* ==========================================================================
   Vikram Sethu — Portfolio scripts
   Every block checks that its library / element exists, so this one file
   is safe to load on all pages.
   ========================================================================== */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Theme (dark / light) ---------- */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");

  function setThemeIcon() {
    if (!themeBtn) return;
    const isLight = root.getAttribute("data-theme") === "light";
    themeBtn.innerHTML = isLight ? '<i class="bi bi-moon-stars"></i>' : '<i class="bi bi-sun"></i>';
  }
  setThemeIcon();

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked */ }
      setThemeIcon();
    });
  }

  /* ---------- Preloader ---------- */
  // main.js is injected after footer.html loads, so "load" may already have fired
  function onPageLoad() {
    const loader = $(".preloader");
    if (loader) setTimeout(() => loader.classList.add("hide"), 400);
    heroIntro();
  }
  if (document.readyState === "complete") onPageLoad();
  else window.addEventListener("load", onPageLoad);

  /* ---------- Footer year ---------- */
  $$(".js-year").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Navbar ---------- */
  const nav = $(".site-nav");
  const onScroll = () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
    updateBackToTop();
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  // close mobile menu after picking a link
  $$(".site-nav .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const collapse = $("#mainNav");
      if (collapse && collapse.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(collapse).hide();
      }
    });
  });

  /* ---------- Back to top + scroll progress ---------- */
  const backBtn = $(".back-to-top");
  const progressCircle = backBtn ? $(".bt-progress", backBtn) : null;
  const circumference = 2 * Math.PI * 25;
  if (progressCircle) {
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;
  }

  function updateBackToTop() {
    if (!backBtn) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? window.scrollY / max : 0;
    backBtn.classList.toggle("show", window.scrollY > 400);
    if (progressCircle) progressCircle.style.strokeDashoffset = circumference * (1 - pct);
  }

  if (backBtn) backBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  onScroll();

  /* ---------- Custom cursor ---------- */
  const dot = $(".cursor-dot");
  const ring = $(".cursor-ring");
  if (finePointer && dot && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      document.body.classList.add("cursor-ready");
    });
    (function follow() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(follow);
    })();
    document.addEventListener("mouseleave", () => document.body.classList.remove("cursor-ready"));

    $$("a, button, .work-card, .filter-btn, label, .tool-card").forEach((el) => {
      el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer) {
    $$(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- AOS ---------- */
  if (window.AOS) {
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true, offset: 60 });
  }

  /* ---------- Hero intro (GSAP) ---------- */
  function heroIntro() {
    if (!window.gsap) return;
    const hero = $(".hero, .page-header");
    if (!hero) return;

    const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.5 });
    if (hero.classList.contains("hero")) {
      tl.from(".hero-title .line > span", { yPercent: 110, duration: 1.2, stagger: 0.12 })
        .from(".hero-badge, .hero-typed, .hero-text, .hero-btns, .hero-meta", { y: 30, opacity: 0, duration: 0.9, stagger: 0.1 }, "-=0.8")
        .from(".hero-img-wrap", { scale: 0.85, opacity: 0, duration: 1.3 }, "-=1.2")
        .from(".float-card, .rotate-badge", { scale: 0, opacity: 0, duration: 0.8, stagger: 0.15, ease: "back.out(1.7)" }, "-=0.7");
    } else {
      tl.from(".page-header .eyebrow, .page-header h1, .breadcrumb-c", { y: 60, opacity: 0, duration: 1.1, stagger: 0.12 })
        .from(".page-header .bg-word", { opacity: 0, scale: 0.9, duration: 1.4 }, "-=1");
    }

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      $$(".page-header .bg-word").forEach((el) => {
        gsap.to(el, { xPercent: -15, ease: "none", scrollTrigger: { trigger: el.closest("section"), start: "top top", end: "bottom top", scrub: true } });
      });
      $$(".parallax-img").forEach((el) => {
        gsap.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: el, scrub: true } });
      });
    }
  }

  /* ---------- Typed text ---------- */
  const typedEl = $("#typed");
  if (typedEl && window.Typed) {
    new Typed(typedEl, {
      strings: ["Brand Identity Designer", "UI / UX Designer", "Packaging Artist", "Motion Graphics Creator"],
      typeSpeed: 60,
      backSpeed: 35,
      backDelay: 1800,
      loop: true,
    });
  }

  /* ---------- Counters ---------- */
  const counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseFloat(el.dataset.count);
        const duration = 2000;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * end);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = end;
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => io.observe(c));
  }

  /* ---------- Skill bars ---------- */
  const bars = $$(".skill-bar span[data-width]");
  if (bars.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.width = entry.target.dataset.width + "%";
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    bars.forEach((b) => io.observe(b));
  }

  /* ---------- Testimonials slider ---------- */
  if ($(".testimonial-swiper") && window.Swiper) {
    new Swiper(".testimonial-swiper", {
      loop: true,
      speed: 800,
      spaceBetween: 24,
      grabCursor: true,
      autoplay: { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: ".swiper-pagination", clickable: true },
      breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } },
    });
  }

  /* ---------- Tilt cards ---------- */
  if (finePointer && window.VanillaTilt) {
    VanillaTilt.init($$("[data-tilt]"), { max: 8, speed: 600, glare: true, "max-glare": 0.15 });
  }

  /* ---------- Lightbox ---------- */
  if (window.GLightbox) {
    GLightbox({ selector: ".glightbox", touchNavigation: true, loop: true });
  }

  /* ---------- Portfolio filter (Isotope) ---------- */
  const grid = $(".portfolio-grid");
  if (grid && window.Isotope) {
    const iso = new Isotope(grid, {
      itemSelector: ".grid-item",
      percentPosition: true,
      masonry: { columnWidth: ".grid-sizer" },
      transitionDuration: "0.7s",
    });

    if (window.imagesLoaded) imagesLoaded(grid).on("progress", () => iso.layout());

    // fill in item counts on filter buttons
    $$(".filter-btn").forEach((btn) => {
      const count = $(".count", btn);
      if (!count) return;
      const f = btn.dataset.filter;
      count.textContent = f === "*" ? $$(".grid-item", grid).length : $$(".grid-item" + f, grid).length;
    });

    $$(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        iso.arrange({ filter: btn.dataset.filter });
      });
    });
  }

  /* ---------- Toast ---------- */
  function showToast(msg) {
    const toast = $(".toast-c");
    if (!toast) return;
    $(".toast-msg", toast).textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 4000);
  }

  /* ---------- Contact form → WhatsApp ---------- */
  const WHATSAPP_NUMBER = "919345369440"; // country code + number, no "+" or spaces
  const form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      const val = (sel) => $(sel, form).value.trim();
      const budget = $("input[name=budget]:checked", form);
      const lines = [
        "*New Project Enquiry*",
        "",
        "*Name:* " + val("#cName"),
        "*Email:* " + val("#cEmail"),
        val("#cPhone") ? "*Phone:* " + val("#cPhone") : null,
        "*Service:* " + val("#cService"),
        budget ? "*Budget:* " + $(`label[for="${budget.id}"]`, form).textContent : null,
        "",
        "*Message:*",
        val("#cMsg"),
      ].filter((l) => l !== null);

      const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      // new tab; fall back to the same tab if a popup blocker stops it
      const win = window.open(url, "_blank");
      if (win) win.opener = null;
      else location.href = url;

      form.reset();
      form.classList.remove("was-validated");
      showToast("Opening WhatsApp… just tap Send to reach me.");
    });
  }

  /* ---------- Newsletter ---------- */
  $$(".newsletter").forEach((nl) => {
    nl.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("input", nl);
      if (!input.checkValidity()) { input.reportValidity(); return; }
      input.value = "";
      showToast("Subscribed! Watch your inbox for design goodies.");
    });
  });
})();
