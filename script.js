const btn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav-links");

if (btn && nav) {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Open menu");
    });
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !btn.contains(event.target)) {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Open menu");
    }
  });
}

// Reviews screenshot lightbox
const reviewLightbox = document.getElementById("reviewLightbox");
if (reviewLightbox) {
  const lightboxImage = reviewLightbox.querySelector("img");
  const closeReviewLightbox = () => {
    reviewLightbox.classList.remove("open");
    reviewLightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-review-image]").forEach((button) => {
    button.addEventListener("click", () => {
      lightboxImage.src = button.dataset.reviewImage;
      reviewLightbox.classList.add("open");
      reviewLightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  const closeButton = reviewLightbox.querySelector(".review-lightbox-close");
  if (closeButton) closeButton.addEventListener("click", closeReviewLightbox);
  reviewLightbox.addEventListener("click", (event) => {
    if (event.target === reviewLightbox) closeReviewLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && reviewLightbox.classList.contains("open")) closeReviewLightbox();
  });
}

// Discreet Choose Plan guidance on hover/focus/touch.
(() => {
  const buttons = [...document.querySelectorAll('[data-plan-help="true"]')];
  if (!buttons.length) return;

  const tooltip = document.createElement("div");
  tooltip.className = "plan-help-tooltip";
  tooltip.id = "choose-plan-help";
  tooltip.setAttribute("role", "tooltip");
  tooltip.innerHTML = "<strong>Before you continue:</strong> Choose Plan opens our official X messages. Your selected plan message is copied automatically — paste it in the DM so we know exactly which service you want.";
  document.body.appendChild(tooltip);

  let hideTimer;
  const place = (button) => {
    const r = button.getBoundingClientRect();
    const margin = 10;
    const w = Math.min(340, window.innerWidth - 28);
    tooltip.style.width = w + "px";
    tooltip.style.left = Math.max(14, Math.min(window.innerWidth - w - 14, r.left + (r.width - w) / 2)) + "px";
    tooltip.classList.add("show");
    const h = tooltip.offsetHeight;
    let top = r.top - h - margin;
    if (top < 12) top = Math.min(window.innerHeight - h - 12, r.bottom + margin);
    tooltip.style.top = top + "px";
  };
  const show = (button, autoHide = false) => {
    clearTimeout(hideTimer);
    place(button);
    if (autoHide) hideTimer = setTimeout(() => tooltip.classList.remove("show"), 2200);
  };
  const hide = () => {
    clearTimeout(hideTimer);
    tooltip.classList.remove("show");
  };

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => show(button));
    button.addEventListener("mouseleave", hide);
    button.addEventListener("focus", () => show(button));
    button.addEventListener("blur", hide);
    button.addEventListener("touchstart", () => show(button, true), { passive: true });
    button.addEventListener("click", () => show(button, true));
  });

  window.addEventListener("resize", hide);
  window.addEventListener("scroll", hide, { passive: true });
})();
