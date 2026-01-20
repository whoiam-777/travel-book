(() => {
  const CONFIG = {
    price: "12 900 ₸",
    paymentUrl: "",
    whatsappUrl: "",
    telegramUrl: "",
    email: "hello@example.com"
  };

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  const setTextAll = (selector, text) => {
    $$(selector).forEach(el => el.textContent = text);
  };

  const setHrefAll = (selector, href) => {
    $$(selector).forEach(el => el.setAttribute("href", href));
  };

  const setupConfigBindings = () => {
    setTextAll("[data-price-inline]", CONFIG.price);
    setTextAll("[data-price-block]", CONFIG.price);

    const yearEl = document.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const emailLinkEls = $$("[data-email-link]");
    emailLinkEls.forEach(el => {
      el.textContent = CONFIG.email;
      el.setAttribute("href", `mailto:${CONFIG.email}`);
    });

    if (CONFIG.whatsappUrl) setHrefAll("[data-wa]", CONFIG.whatsappUrl);
    if (CONFIG.telegramUrl) setHrefAll("[data-tg]", CONFIG.telegramUrl);
  };

  const setupMobileNav = () => {
    if (!navToggle) return;

    navToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (e) => {
      const isOpen = document.body.classList.contains("nav-open");
      if (!isOpen) return;
      const target = e.target;
      if (!(target instanceof Element)) return;

      const clickedLink = target.closest(".nav-link");
      const clickedToggle = target.closest("[data-nav-toggle]");
      const clickedNav = target.closest("[data-nav]");

      if (clickedLink) {
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
        return;
      }
      if (clickedToggle || clickedNav) return;

      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  };

  const setupSmoothAnchors = () => {
    document.addEventListener("click", (e) => {
      const a = (e.target instanceof Element) ? e.target.closest("a[href^='#']") : null;
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      const headerH = header ? header.getBoundingClientRect().height : 0;
      const y = window.scrollY + target.getBoundingClientRect().top - (headerH + 12);

      window.scrollTo({ top: y, behavior: "smooth" });
    });
  };

  const setupReveal = () => {
    const items = $$(".reveal");
    if (!items.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(el => io.observe(el));
  };

  const setupCookie = () => {
    const cookie = document.querySelector("[data-cookie]");
    const accept = document.querySelector("[data-cookie-accept]");
    const close = document.querySelector("[data-cookie-close]");
    if (!cookie) return;

    const KEY = "tb_cookie_ok";
    const ok = localStorage.getItem(KEY) === "1";

    if (!ok) cookie.hidden = false;

    const hide = () => { cookie.hidden = true; };

    accept?.addEventListener("click", () => {
      localStorage.setItem(KEY, "1");
      hide();
    });

    close?.addEventListener("click", hide);
  };

  const setupForms = () => {
    const wire = (formId) => {
      const form = document.getElementById(formId);
      if (!form) return;

      form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const success = form.querySelector(".form-success");
        if (success) {
          success.hidden = false;
          setTimeout(() => { success.hidden = true; }, 5000);
        }

        form.reset();
      });
    };

    wire("leadForm");
    wire("questionForm");
  };

  const setupPayment = () => {
    const payBtn = document.querySelector("[data-pay-button]");
    const modal = document.querySelector("[data-modal]");
    const modalCloseEls = $$("[data-modal-close]");

    const openModal = () => {
      if (!modal) return;
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
      if (!modal) return;
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    modalCloseEls.forEach(el => el.addEventListener("click", closeModal));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    payBtn?.addEventListener("click", (e) => {
      e.preventDefault();

      if (CONFIG.paymentUrl && CONFIG.paymentUrl.trim().length > 0) {
        window.open(CONFIG.paymentUrl, "_blank", "noopener,noreferrer");
        return;
      }

      openModal();
    });
  };

  setupConfigBindings();
  setupMobileNav();
  setupSmoothAnchors();
  setupReveal();
  setupCookie();
  setupForms();
  setupPayment();
})();

