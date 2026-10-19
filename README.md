# MaxImpress

Official website: https://maximpress.web.app/

Version 11.13 is the current complete website. Its deployable files are in `site/`.
Run `npx firebase-tools deploy --only hosting --project maximpress` to publish the
verified site to Firebase Hosting. Firebase serves the original 27.85 MB portfolio
video directly, so the primary website no longer needs a cross-host video route.
No page or video content is changed.
GitHub Pages publishes the same design and navigation as a secondary mirror, with
noindex metadata to keep the Firebase homepage as the intended search result.

The homepage alone is indexable at the primary address. All inner pages remain
accessible through normal navigation and use noindex,follow. This reduces the
number of pages eligible to rank and does not force a particular Google ranking.

Official profiles:
- https://www.instagram.com/maximpressocial/
- https://x.com/maximpressocial

Visible changes to the supplied ZIP are limited to a small official-profile section
at the bottom of About Us. All other HTML bodies, CSS, JS, images and video are
preserved. Hidden metadata, sitemap, robots.txt and favicon references support the
MaxImpress identity. Prior versions are recoverable in Git history.
