const btn=document.querySelector(".menu-btn");
const nav=document.querySelector(".nav-links");
if(btn&&nav){
  btn.addEventListener("click",()=>{
    const open=nav.classList.toggle("open");
    btn.setAttribute("aria-expanded",String(open));
  });
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
}
// Reviews screenshot lightbox
const reviewLightbox = document.getElementById('reviewLightbox');
if (reviewLightbox) {
  const lightboxImage = reviewLightbox.querySelector('img');
  const closeReviewLightbox = () => {
    reviewLightbox.classList.remove('open');
    reviewLightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-review-image]').forEach((button) => {
    button.addEventListener('click', () => {
      lightboxImage.src = button.dataset.reviewImage;
      reviewLightbox.classList.add('open');
      reviewLightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  reviewLightbox.querySelector('.review-lightbox-close').addEventListener('click', closeReviewLightbox);
  reviewLightbox.addEventListener('click', (event) => {
    if (event.target === reviewLightbox) closeReviewLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && reviewLightbox.classList.contains('open')) closeReviewLightbox();
  });
}
\n\n// Version 9.4: discreet Choose Plan guidance on hover/focus/touch.\n(() => {\n  const buttons = [...document.querySelectorAll('[data-plan-help="true"]')];\n  if (!buttons.length) return;\n\n  const tooltip = document.createElement('div');\n  tooltip.className = 'plan-help-tooltip';\n  tooltip.id = 'choose-plan-help';\n  tooltip.setAttribute('role', 'tooltip');\n  tooltip.innerHTML = '<strong>Before you continue:</strong> Choose Plan opens our official X messages. Your selected plan message is copied automatically — paste it in the DM so we know exactly which service you want.';\n  document.body.appendChild(tooltip);\n\n  let hideTimer;\n  const place = (button) => {\n    const r = button.getBoundingClientRect();\n    const margin = 10;\n    const w = Math.min(340, window.innerWidth - 28);\n    tooltip.style.width = w + 'px';\n    tooltip.style.left = Math.max(14, Math.min(window.innerWidth - w - 14, r.left + (r.width - w) / 2)) + 'px';\n    tooltip.classList.add('show');\n    const h = tooltip.offsetHeight;\n    let top = r.top - h - margin;\n    if (top < 12) top = Math.min(window.innerHeight - h - 12, r.bottom + margin);\n    tooltip.style.top = top + 'px';\n  };\n  const show = (button, autoHide = false) => {\n    clearTimeout(hideTimer);\n    place(button);\n    if (autoHide) hideTimer = setTimeout(() => tooltip.classList.remove('show'), 2200);\n  };\n  const hide = () => { clearTimeout(hideTimer); tooltip.classList.remove('show'); };\n\n  buttons.forEach((button) => {\n    button.addEventListener('mouseenter', () => show(button));\n    button.addEventListener('mouseleave', hide);\n    button.addEventListener('focus', () => show(button));\n    button.addEventListener('blur', hide);\n    button.addEventListener('touchstart', () => show(button, true), { passive: true });\n    button.addEventListener('click', () => show(button, true));\n  });\n\n  window.addEventListener('resize', hide);\n  window.addEventListener('scroll', hide, { passive: true });\n})();\n