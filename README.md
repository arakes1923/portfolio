# Vikram Sethu — Graphic Designer Portfolio

Static multipage portfolio built with HTML, CSS, Bootstrap 5 and vanilla JavaScript. All libraries load from CDN — no build step.

## Folder structure

```
Aravinth/
├── index.html          Home
├── about.html          About (skills, tools, experience, awards)
├── portfolio.html      Portfolio (filterable masonry grid + lightbox)
├── contact.html        Contact (form, map, FAQ)
├── README.md
└── assets/
    ├── css/
    │   └── style.css   All custom styles (theme tokens at the top)
    ├── js/
    │   └── main.js     All interactions (safe to load on every page)
    └── images/
        └── favicon.svg Put your real project images here
```

## Run

Use the VS Code **Live Server** extension (or any local server). Opening `index.html` directly (`file://`) will not work, because the common `head.html` and `footer.html` are loaded with `fetch()`.

## Shared head & footer

- `head.html` — favicon, fonts, Bootstrap, icons, AOS and `style.css`. Every page fetches it from a small script in its `<head>`. Each page keeps its own `<title>`, `description`, theme script and page-only CSS (Swiper on Home, GLightbox on Portfolio).
- `nav.html` — the navbar. Each page has `<div id="nav"></div>`. The current page's link gets the `active` class automatically.
- `footer.html` — the site footer. Each page has `<div id="footer"></div>`.
- The script at the bottom of each page fills `#nav` and `#footer`, then loads `main.js`.

## Libraries (CDN)

| Library | Used for |
|---|---|
| Bootstrap 5.3.3 + Bootstrap Icons | Grid, navbar, tabs, accordion, icons |
| AOS 2.3.4 | Scroll reveal animations |
| GSAP 3.12.5 + ScrollTrigger | Hero intro, parallax heading text |
| Typed.js 2.1.0 | Typing effect on home hero |
| Swiper 11 | Testimonials slider |
| Isotope + imagesLoaded | Portfolio filter / masonry |
| GLightbox 3.3.0 | Portfolio image popup |

## Replacing the dummy data

- **Name / email / phone** — search `Vikram`, `hello@vikramsethu.design`, `+91 98765 43210` across the 4 HTML files.
- **Images** — currently `picsum.photos` / `pravatar.cc` placeholders. Drop real images into `assets/images/` and update the `src` (and `href` for lightbox items on the portfolio page).
- **Portfolio categories** — each `.grid-item` has a class (`branding`, `uiux`, `packaging`, `print`, `illustration`, `motion`) that must match a filter button's `data-filter`.
- **Typing words** — `strings` array in `assets/js/main.js`.
- **Colors / fonts** — edit the CSS variables in `:root` at the top of `style.css`.
- **Contact form** — front-end only. Hook it up to Formspree / EmailJS / your backend at the `TODO` in `main.js`.
- **Map** — change the `q=` value in the iframe `src` on `contact.html`.
