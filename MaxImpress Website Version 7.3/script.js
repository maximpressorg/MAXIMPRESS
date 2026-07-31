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
