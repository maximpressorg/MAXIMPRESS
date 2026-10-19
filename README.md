# MaxImpress

Official website: https://maximpress.pages.dev/

Version 11.13 is the current complete website. Its deployable files are in `site/`.
Upload the contents of that directory to the existing free Cloudflare Pages project.
GitHub Pages publishes the same design and navigation as a secondary mirror, with
noindex metadata to keep the Cloudflare homepage as the intended search result.

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
