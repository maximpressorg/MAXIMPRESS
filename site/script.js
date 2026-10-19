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


// Version 10.5: reliable dropdown interaction + topic FAQ accordions
(() => {
  const dropdowns = [...document.querySelectorAll('.nav-dropdown')];
  const desktop = () => window.innerWidth > 900;

  const setOpen = (drop, open) => {
    const toggle = drop.querySelector('.nav-dropdown-toggle');
    drop.classList.toggle('open', open);
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
  };

  const resetState = (drop) => {
    drop.dataset.pinned = 'false';
    drop.dataset.suppressHover = 'false';
  };

  const closeDrop = (drop) => {
    setOpen(drop, false);
    resetState(drop);
  };

  const closeOthers = (except) => {
    dropdowns.forEach((drop) => {
      if (drop !== except) closeDrop(drop);
    });
  };

  dropdowns.forEach((drop) => {
    const toggle = drop.querySelector('.nav-dropdown-toggle');
    if (!toggle) return;
    resetState(drop);

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!desktop()) {
        const willOpen = !drop.classList.contains('open');
        closeOthers(drop);
        setOpen(drop, willOpen);
        return;
      }

      // On desktop the menu may already be open because of hover. The first
      // click pins it open; the second click closes it even while the pointer
      // is still over the control.
      const pinned = drop.dataset.pinned === 'true';
      if (pinned) {
        drop.dataset.pinned = 'false';
        drop.dataset.suppressHover = 'true';
        setOpen(drop, false);
      } else {
        closeOthers(drop);
        drop.dataset.pinned = 'true';
        drop.dataset.suppressHover = 'false';
        setOpen(drop, true);
      }
    });

    drop.addEventListener('mouseenter', () => {
      if (!desktop() || drop.dataset.suppressHover === 'true') return;
      closeOthers(drop);
      setOpen(drop, true);
    });

    drop.addEventListener('mouseleave', () => {
      if (!desktop()) return;
      drop.dataset.suppressHover = 'false';
      if (drop.dataset.pinned !== 'true') setOpen(drop, false);
    });
  });

  document.addEventListener('click', (event) => {
    dropdowns.forEach((drop) => {
      if (!drop.contains(event.target)) closeDrop(drop);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') dropdowns.forEach(closeDrop);
  });

  window.addEventListener('resize', () => {
    dropdowns.forEach(closeDrop);
  });

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        openItem.classList.remove('open');
        const openButton = openItem.querySelector('.faq-question');
        if (openButton) openButton.setAttribute('aria-expanded','false');
      });
      if (!isOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded','true');
      }
    });
  });
})();



// Version 10.2: Articles mega-menu + nested mobile article categories.
(() => {
  document.querySelectorAll('.article-category-toggle').forEach((toggle) => {
    toggle.addEventListener('click', (event) => {
      if (window.innerWidth > 900) return;
      event.preventDefault();
      event.stopPropagation();
      const group = toggle.closest('.article-menu-group');
      if (!group) return;
      const open = group.classList.toggle('subopen');
      toggle.setAttribute('aria-expanded', String(open));
    });
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      document.querySelectorAll('.article-menu-group.subopen').forEach(g => g.classList.remove('subopen'));
      document.querySelectorAll('.article-category-toggle').forEach(b => b.setAttribute('aria-expanded','false'));
    }
  });
})();


// Version 11.8: slide-up contact flyout + inline service acknowledgement
(() => {
  const X_DM_URL = 'https://x.com/messages/compose?recipient_id=1582710858614018050';
  const INSTAGRAM_DM_URL = 'https://ig.me/m/maximpressocial';
  const EMAIL_URL = 'mailto:MAXIMPRESS.org@gmail.com?subject=MaxImpress%20Inquiry';

  const ensureModal = () => {
    let wrap = document.getElementById('maximpress-global-modal');
    if (wrap) return wrap;
    wrap = document.createElement('div');
    wrap.id = 'maximpress-global-modal';
    wrap.className = 'mi-global-modal';
    wrap.setAttribute('aria-hidden','true');
    wrap.innerHTML = '<div class="mi-global-modal-backdrop" data-mi-close></div><section class="mi-global-modal-card" role="dialog" aria-modal="true" aria-labelledby="miGlobalModalTitle"><button class="mi-global-modal-close" type="button" aria-label="Close" data-mi-close>×</button><div id="mi-global-modal-content"></div></section>';
    document.body.appendChild(wrap);
    wrap.querySelectorAll('[data-mi-close]').forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && wrap.classList.contains('open')) closeModal(); });
    return wrap;
  };

  function closeModal() {
    const wrap = document.getElementById('maximpress-global-modal');
    if (!wrap) return;
    wrap.classList.remove('open');
    wrap.setAttribute('aria-hidden','true');
    document.body.classList.remove('mi-modal-open');
  }

  const showContent = (html) => {
    const wrap = ensureModal();
    const content = wrap.querySelector('#mi-global-modal-content');
    content.innerHTML = html;
    wrap.classList.add('open');
    wrap.setAttribute('aria-hidden','false');
    document.body.classList.add('mi-modal-open');
    setTimeout(() => wrap.querySelector('button, a, input')?.focus(), 30);
    return {wrap, content};
  };

  const xIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
  const instagramIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.7" r="1.15" fill="currentColor"/></svg>';
  const mailIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5h18v13H3z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m4.5 7 7.5 6 7.5-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const ensureContactFlyout = () => {
    let flyout = document.getElementById('maximpress-contact-flyout');
    if (flyout) return flyout;
    flyout = document.createElement('div');
    flyout.id = 'maximpress-contact-flyout';
    flyout.className = 'mi-contact-flyout';
    flyout.setAttribute('aria-hidden','true');
    flyout.innerHTML = `
      <a class="mi-contact-flyout-option mi-contact-flyout-x" href="${X_DM_URL}" target="_blank" rel="noopener noreferrer">
        <span class="mi-contact-brand-icon">${xIcon}</span><strong>Contact us on X</strong>
      </a>
      <a class="mi-contact-flyout-option mi-contact-flyout-instagram" href="${INSTAGRAM_DM_URL}" target="_blank" rel="noopener noreferrer">
        <span class="mi-contact-brand-icon">${instagramIcon}</span><strong>Contact us on Instagram</strong>
      </a>
      <a class="mi-contact-flyout-option mi-contact-flyout-mail" href="${EMAIL_URL}">
        <span class="mi-contact-brand-icon">${mailIcon}</span><strong>Contact us by Mail</strong>
      </a>`;
    document.body.appendChild(flyout);
    flyout.querySelector('[data-contact-close]')?.addEventListener('click', closeContactFlyout);
    flyout.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setTimeout(closeContactFlyout, 120)));
    return flyout;
  };

  function closeContactFlyout() {
    const flyout = document.getElementById('maximpress-contact-flyout');
    if (!flyout) return;
    flyout.classList.remove('open');
    flyout.setAttribute('aria-hidden','true');
    document.querySelectorAll('.floating-contact-btn').forEach(btn => btn.setAttribute('aria-expanded','false'));
  }

  window.openMaxImpressContactMenu = function() {
    const flyout = ensureContactFlyout();
    const willOpen = !flyout.classList.contains('open');
    closeContactFlyout();
    if (willOpen) {
      flyout.classList.add('open');
      flyout.setAttribute('aria-hidden','false');
      document.querySelectorAll('.floating-contact-btn').forEach(btn => btn.setAttribute('aria-expanded','true'));
    }
    return false;
  };

  const SERVICE_MAP = {
    website: {name:'Website Development', next:'website-project-brief.html'},
    intelligence: {name:'Custom Social Intelligence', next:'intelligence-request.html'},
    'digital-identity': {name:'Launch Your Digital Identity', next:'digital-identity-brief.html'},
    'social-management': {name:'Full Social Media Management', next:'social-media-management-brief.html'}
  };
  const ALLOWED_NEXT = ['website-project-brief.html','intelligence-request.html','digital-identity-brief.html','social-media-management-brief.html'];

  window.openServiceAcknowledgement = function(source) {
    let url;
    try { url = new URL(source || 'service-terms.html', location.href); } catch (_) { url = new URL('service-terms.html', location.href); }
    const q = url.searchParams;
    const service = q.get('service') || 'website';
    const cfg = SERVICE_MAP[service] || SERVICE_MAP.website;
    const plan = q.get('plan') || '';
    const requestedNext = q.get('next') || cfg.next;
    const next = ALLOWED_NEXT.includes(requestedNext) ? requestedNext : cfg.next;
    const PLAN_LABELS = {
      standard:'Standard', advanced:'Advanced / Custom',
      'creator-foundation':'Creator Foundation · $500/month',
      'creator-growth':'Creator Growth Ecosystem · $1,000/month',
      'creator-complete':'Complete Creator Management · $1,500/month',
      'brand-social':'Brand Social Management · $600/month',
      'brand-growth':'Brand Growth & Marketing · $1,500/month',
      organization:'Organization Social Management · $800–$2,000/month'
    };
    const planLabel = plan ? (PLAN_LABELS[plan] || plan) : '';
    const serviceLabel = planLabel ? `${cfg.name} · ${planLabel}` : cfg.name;

    const {content} = showContent(`
      <span class="mi-modal-kicker">BEFORE YOU CONTINUE</span>
      <h2 id="miGlobalModalTitle">Service acknowledgement</h2>
      <div class="mi-service-chip">${serviceLabel}</div>
      <p class="mi-modal-copy">One quick confirmation keeps the scope clear before you open the project brief.</p>
      <div class="mi-ack-summary">
        <p><b>Service outcomes can vary.</b> Platform-controlled results, rankings, monetization, reach, earnings, leads or conversions are not guaranteed.</p>
        <p><b>Final scope is confirmed after review.</b> Custom work, third-party costs and additional requirements are confirmed before work begins.</p>
        <p><b>Keep sensitive credentials private.</b> Use official delegation or access methods where available.</p>
      </div>
      <label class="mi-agree-all"><input id="miAgreeAll" type="checkbox"><span><strong>Agree to all</strong><small>I understand the service limitations and have reviewed the <a href="privacy-policy.html" target="_blank" rel="noopener">Privacy Policy</a> and <a href="terms-and-conditions.html" target="_blank" rel="noopener">Terms &amp; Conditions</a>.</small></span></label>
      <button class="primary-btn mi-ack-continue" id="miAckContinue" type="button" disabled>Agree &amp; Continue <b>→</b></button>`);

    const check = content.querySelector('#miAgreeAll');
    const go = content.querySelector('#miAckContinue');
    check.addEventListener('change', () => { go.disabled = !check.checked; });
    go.addEventListener('click', () => {
      if (!check.checked) return;
      sessionStorage.setItem(`maximpress_consent_${service}`, new Date().toISOString());
      if (plan) {
        sessionStorage.setItem(`maximpress_plan_${service}`, plan);
        if (service === 'website') sessionStorage.setItem('maximpress_website_plan', plan);
      }
      const suffix = plan ? `?plan=${encodeURIComponent(plan)}` : '';
      location.href = next + suffix;
    });
    return false;
  };

  // Contact links open the compact flyout; service requests retain the acknowledgement modal.
  document.addEventListener('click', (event) => {
    const a = event.target.closest('a');
    if (!a) {
      if (!event.target.closest?.('#maximpress-contact-flyout')) closeContactFlyout();
      return;
    }
    const raw = a.getAttribute('href') || '';
    const isFloatingContact = a.classList.contains('floating-contact-btn');
    const isContactPageLink = /(^|\/)contact-us\.html(?:[?#].*)?$/.test(raw);
    if (isFloatingContact || isContactPageLink) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.openMaxImpressContactMenu();
      return;
    }
    if (/service-terms\.html(?:\?|$)/.test(raw)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.openServiceAcknowledgement(raw);
    }
  }, true);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeContactFlyout();
  });

  // Best-effort portfolio autoplay with sound. Browsers may block unmuted autoplay on a first visit.
  const portfolioVideo = document.querySelector('[data-portfolio-autoplay]');
  if (portfolioVideo) {
    portfolioVideo.muted = false;
    portfolioVideo.volume = 1;
    const addSoundFallback = () => {
      if (document.getElementById('mi-video-sound-fallback')) return;
      const wrap = portfolioVideo.closest('.portfolio-intro-video');
      if (!wrap) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.id = 'mi-video-sound-fallback';
      button.className = 'mi-video-sound-fallback';
      button.textContent = 'Tap for sound';
      button.addEventListener('click', () => {
        portfolioVideo.muted = false;
        portfolioVideo.volume = 1;
        portfolioVideo.play().catch(() => {});
        button.remove();
      });
      wrap.appendChild(button);
    };
    portfolioVideo.play().catch(() => {
      portfolioVideo.muted = true;
      portfolioVideo.play().catch(() => {});
      addSoundFallback();
      const enableOnGesture = () => {
        portfolioVideo.muted = false;
        portfolioVideo.volume = 1;
        portfolioVideo.play().catch(() => {});
        document.getElementById('mi-video-sound-fallback')?.remove();
        ['pointerdown','touchstart','keydown'].forEach(type => document.removeEventListener(type, enableOnGesture, true));
      };
      ['pointerdown','touchstart','keydown'].forEach(type => document.addEventListener(type, enableOnGesture, true));
    });
  }
})();
