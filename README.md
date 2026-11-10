# Kaustubh Hari Sethi: Personal Portfolio

Source code for **[kaustubhsethi.com](https://kaustubhsethi.com)**, my personal portfolio. I'm an AI/ML engineer and researcher.

The site is **plain HTML, CSS and JavaScript**: no framework, no build step and no `npm install`. Open `index.html` in a browser and it runs. It's hosted for free on GitHub Pages with a custom domain.

If you're building your own portfolio, feel free to use this repo for inspiration. The sections below explain how each feature works, so you can borrow ideas without reading every line of code.

---

## Contents

- [Project structure](#project-structure)
- [Running it locally](#running-it-locally)
- [Features and how they work](#features-and-how-they-work)
  - [Page-load animation (GSAP)](#1-page-load-animation-gsap)
  - [Burger menu for mobile](#2-burger-menu-for-mobile)
  - [Tabbed About section](#3-tabbed-about-section)
  - [Skills explorer (data-driven)](#4-skills-explorer-data-driven)
  - [Animated night sky on a canvas](#5-animated-night-sky-on-a-canvas)
  - [Career Highlights modal](#6-career-highlights-modal)
  - [Image zoom modal](#7-image-zoom-modal)
  - [Project cards with hover overlay](#8-project-cards-with-hover-overlay)
  - [Contact form → Google Sheets (no backend)](#9-contact-form--google-sheets-no-backend)
  - ["Ask AI about me" footer links](#10-ask-ai-about-me-footer-links)
  - [Responsive layout](#11-responsive-layout)
  - [Accessibility](#12-accessibility)
  - [SEO and link previews](#13-seo-and-link-previews)
  - [Performance](#14-performance)
- [Deploying on GitHub Pages](#deploying-on-github-pages)
- [Using this as a template](#using-this-as-a-template)
- [Credits](#credits)

---

## Project structure

```
├── index.html          # All page content and markup, plus the image zoom modal script
├── style.css           # All styles, grouped into commented sections
├── script.js           # Animations, tabs, menu, modals, skills explorer, night sky, form
├── skills-data.js      # The skills list (edit this file, not the code, to change skills)
├── images/             # WebP images for the site, plus PNGs for the favicon and link previews
├── ResumeKaustubh.pdf  # The file behind the "Download Resume" button
├── CNAME               # Custom domain for GitHub Pages
├── robots.txt          # Lets search engines crawl the site and points them to the sitemap
└── sitemap.xml         # Page list for search engines
```

`index.html` is split into clearly labelled sections (`<!-- === ABOUT SECTION === -->` and so on). `style.css` uses the same headings, so it's easy to jump between the markup and styles for one feature.

## Running it locally

Download or clone the repo:

```bash
git clone https://github.com/khs14/Kaustubh.git
```

**Simplest way:** open the `Kaustubh` folder and double-click `index.html`. It opens in your browser, and that's all you need to see the site.

**Optional: use a local web server.** If you have Python installed, you can serve the folder instead:

```bash
cd Kaustubh && python3 -m http.server 8000
```

Then open <http://localhost:8000>. This loads the page over `http://` like the live site does. That can matter if you add `fetch()` calls or paths that start with `/`, and it lets you test on your phone over the same Wi-Fi.

---

## Features and how they work

### 1. Page-load animation (GSAP)

**File:** `script.js` → `loadinganimation()`

GSAP is loaded from a CDN. `gsap.from()` sets the start state of an animation (for example "100px lower and invisible") and animates to the element's normal CSS state:

```js
gsap.from("#page1 h1", { y: 100, opacity: 0, duration: 0.9, stagger: 0.3 });
gsap.from(".hero-subtitle p", { y: 20, opacity: 0, delay: 0.6, stagger: 0.15 });
gsap.from("#about", { scale: 0.9, opacity: 0, delay: 1.1, duration: 0.3 });
```

`stagger` makes several elements animate one after another instead of all at once. Increasing `delay` values set the order: the name appears first, then the subtitle lines, then the About section.

If the GSAP script fails to load (the CDN is down or blocked), `loadinganimation()` returns early. The page then appears without the intro animation, but everything else in `script.js` still runs.

### 2. Burger menu for mobile

**Files:** `index.html` (`#burger-menu`, `#menu-overlay`), `script.js` → `toggleMenu()`, `style.css` → _BURGER MENU_

A single function toggles an `active` class on three elements: the burger icon (which animates into an ✕), the nav panel (which slides in) and a dark overlay behind it. CSS handles all the visuals. JavaScript only adds and removes classes.

- `document.body.style.overflow = 'hidden'` stops the page scrolling behind the open menu.
- Clicking the overlay or a nav link closes the menu.
- Nav links only close the menu at mobile widths (`window.innerWidth <= 768`).

### 3. Tabbed About section

**Files:** `index.html` (`.tab-titles`, `.tab-contents`), `script.js` → `opentab()`

Each tab title calls `opentab(this, 'section-id')`. The function removes `active-link` and `active-tab` from all tabs, then adds them back to the clicked title and its content panel. In CSS, `.tab-contents` is hidden by default and `.active-tab` shows it with a short opacity fade.

The tab titles sit in a CSS grid where every tab has the same width: 4×2 on desktop and 2×4 at mid widths.

### 4. Skills explorer (data-driven)

**Files:** `skills-data.js` (data), `script.js` → `buildSkillsExplorer()`, `style.css` → _SKILLS EXPLORER_

This is the feature most worth copying. Instead of hard-coding skill badges in HTML, every skill is stored as data together with **where it was used**:

```js
const SKILL_GROUPS = {
  Languages: {
    Python: [
      ["work", "ISRO", "NLP and extractive QA pipelines"],
      [
        "project",
        "Offensive Check",
        "CNN text classifier",
        "https://offensive-check.streamlit.app/",
      ],
      // [type, place, how it was used, optional link]
    ],
  },
};
```

On page load the script:

1. Creates a heading per category and a clickable "chip" per skill.
2. Shows a **count badge** on each chip (the number of places the skill was used) and sorts chips by that count, most-used first.
3. When you click a chip, it enters **focus mode**. A `skill-focused` class on the container hides every other chip with CSS and shows a panel listing each place: a coloured type label (Work / Project / Education / Activity), the place name (linked if a URL is given) and how the skill was used.
4. Clicking the chip again clears the selection.

Why it's built this way:

- **Content is separate from code.** Adding a skill means adding one line to `skills-data.js`. Counts, sorting and the panel update automatically.
- **Show, don't claim.** Visitors see evidence for each skill instead of a "Python 90%" bar.
- **Safe rendering.** Text goes through `escapeHTML()` before it's inserted with `innerHTML`.
- **Accessible.** Chips are real `<button>`s with `aria-pressed`, and the panel has `aria-live="polite"` so screen readers announce changes.

### 5. Animated night sky on a canvas

**File:** `script.js` → the `NIGHT SKY` block, `style.css` → _ABOUT SECTION IMAGE_

The About image is a beach at night. A transparent `<canvas>` is laid exactly over it with `position: absolute` and draws twinkling stars and an occasional shooting star.

How it works:

- **Positions are fractions, not pixels.** Each star is stored as `[x, y]` between 0 and 1 (for example `[0.55, 0.17]`), and the meteor paths the same way. They were picked from empty patches of sky, so stars never land on the palm tree or clouds. Because they're fractions, they stay lined up at any screen size.
- **Sharp on high-DPI screens.** The canvas is sized to `width × devicePixelRatio` (capped at 2) and scaled back with `ctx.setTransform`, so it's sharp on retina displays.
- **Natural twinkling.** Each star drifts towards a random brightness over a random time (300 ms–2.2 s), using smoothstep easing. A small sine shimmer, occasional flares and short bursts of cross-shaped light rays sit on top. About 18% of stars are "big" and brighter. Colours vary slightly between white, cool and warm tints.
- **Cheap glow.** The soft halo is a radial gradient drawn **once** to a 64×64 off-screen canvas and reused with `drawImage` for every star. That's much faster than building a gradient per star per frame.
- **Shooting star.** Every 5 seconds a meteor runs along one of 12 preset paths (never the same one twice in a row). It's a line with a gradient tail, ease-out motion and a fade in and out.
- **Only runs when needed.**
  - An `IntersectionObserver` starts the `requestAnimationFrame` loop only while the canvas is on screen.
  - A `visibilitychange` listener pauses it when the browser tab is hidden.
  - A `ResizeObserver` resizes the canvas when its size changes.
- **Respects reduced motion.** With `prefers-reduced-motion: reduce`, the stars are drawn once as a still image and nothing animates.

The same `createNightSky()` function runs on every `.night-sky` canvas, so the sky also appears on the enlarged image in the zoom modal.

### 6. Career Highlights modal

**Files:** `index.html` (`#highlights-overlay`), `script.js` → `openHighlights()` / `closeHighlights()`, `style.css` → _CAREER HIGHLIGHTS_

- Clicking the button adds an `active` class to a full-screen overlay, and CSS fades it in.
- The modal closes with the ✕ button, a click on the dark backdrop or the **Escape** key.
- `onclick="event.stopPropagation()"` on the modal box stops clicks inside it from closing it.
- The modal has `role="dialog"`, `aria-modal="true"` and `aria-labelledby`, so screen readers announce it properly.
- **The star icon on the button** is animated with pure CSS and two keyframe animations:
  - `starSpin`: rests, then does one full turn with a slight overshoot (a `cubic-bezier` easing above 1).
  - `starBreatheLight`: a "breathing" glow made of `brightness()` and stacked `drop-shadow()` filters. The filter functions are listed in the same order in every keyframe so the browser can blend between them smoothly.
  - On hover or focus the star keeps spinning at full glow. With reduced motion turned on it just glows steadily.

### 7. Image zoom modal

**Files:** `index.html` (inline script at the bottom, `#image-overlay`), `style.css` → _IMAGE HOVER + ZOOM BUTTON_ / _IMAGE ZOOM MODAL_

- Any image wrapped in `.image-zoom-wrap` gets a coloured fade and an "enlarge" button on hover. Add the `.orange` class to the wrapper for the orange colour theme (used in Contact).
- `openImageModal(btn)` copies the image's `currentSrc` and `alt` into a single shared modal, so you don't need one modal per image. It also copies the colour theme, and adds the night sky only if the source image has one.
- **Focus handling:** keyboard users get focus moved to the close button, and it returns to the zoom button afterwards. Mouse users don't get focus returned, so the hover fade doesn't stay stuck on.
- On touch screens the hover effect and zoom button are hidden (`@media (hover: none), (max-width: 768px)`).

### 8. Project cards with hover overlay

**Files:** `index.html` (`.work-list`, `.work`, `.layer`), `style.css` → _PROJECTS_

- **Layout:** `.work-list` is a wrapping flexbox (`flex: 1 1 280px; max-width: 380px` per card). Without any media queries this gives 3 cards per row on desktop, 2 on tablets (with the third centred) and 1 on phones.
- **Hover effect:** `.layer` is a gradient panel at the bottom of the card with `height: 0`. On hover the image scales up to 1.1 and the layer grows to `height: 100%`, showing the title, description and link.
- **Keyboard support:** the same effect also triggers on `:focus-within`, so tabbing to a card's link opens its overlay.
- **Touch screens** have no hover, so `@media (hover: none)` shows the title, description and link permanently below the image instead.

### 9. Contact form → Google Sheets (no backend)

**Files:** `index.html` (`#contact-form`), `script.js` → _FORM SUBMISSION_

The form saves messages to a Google Sheet through a **Google Apps Script web app**, so there's no server to host.

```js
fetch(scriptURL, { method: "POST", mode: "no-cors", body: new FormData(form) });
```

- `e.preventDefault()` keeps the user on the page, and a status message shows "Submitting…", then a success or error message.
- `mode: 'no-cors'` lets the request reach Apps Script, which doesn't send CORS headers. The trade-off is that the script can't read the response, so "success" means the request was sent without a network error.
- The input `name` attributes (`Name`, `email`, `Message`) must match the column headers in the sheet.

To set up your own, create a Google Sheet, add an Apps Script that appends `e.parameter` values as a new row and deploy it as a web app ("Anyone" access). Then replace `scriptURL` with your deployment URL. Search for "submit HTML form to Google Sheets Apps Script" for step-by-step guides.

### 10. "Ask AI about me" footer links

**Files:** `index.html` (`.ask-ai` in the footer), `style.css` → _FOOTER_

The footer has a row of links to ChatGPT, Claude, Perplexity and Grok. Each one opens a new chat with a starting prompt already filled in, asking the AI to visit the site, summarise my background, projects and skills, and then answer the visitor's questions. A recruiter gets a quick summary and can ask follow-ups like "Is he a fit for an ML role?"

**How it works:** these AI sites read a starting prompt from the URL, so each link is just a normal `<a>` with the prompt URL-encoded in the `q` parameter. No JavaScript is needed:

```html
<a href="https://chatgpt.com/?q=Visit%20https%3A%2F%2Fkaustubhsethi.com%20and%20give%20me..." target="_blank" rel="noopener noreferrer">ChatGPT</a>
```

| Service | Link format |
|---|---|
| ChatGPT | `https://chatgpt.com/?q=<prompt>` |
| Claude | `https://claude.ai/new?q=<prompt>` |
| Perplexity | `https://www.perplexity.ai/search?q=<prompt>` |
| Grok | `https://grok.com/?q=<prompt>` |

To make the encoded prompt, run `encodeURIComponent("your prompt")` in the browser console and paste the result after `?q=`.

**Details:**
- **Disclaimer:** a small, quiet note says AI answers may be inaccurate and points visitors to the portfolio itself or the contact section.
- **Layout:** the four buttons are equal width (a CSS grid with `repeat(4, minmax(0, 1fr))`).
- **Hover animations:** the pills lift, turn green and glow on hover or keyboard focus, and press down when clicked. The sparkle icon spins when you hover over the section.
- **Twinkle:** the sparkle does a slow, soft twinkle on a 6-second loop. It rests for most of the cycle, so it adds a bit of life without pulling attention from the page.
- **Touch screens:** no lift on tap (`@media (hover: none)`), so a pill doesn't stay raised.
- **Phones:** the links switch to an even 2×2 grid with bigger tap targets.
- **Reduced motion:** the twinkle, spin and lift are turned off and only the colours change.
- **Caveat:** these URL formats aren't official APIs and can change, and some services may ask visitors to log in. Click each link now and then to check it still works.

### 11. Responsive layout

**File:** `style.css` → _TABLET VIEW_, _MOBILE VIEW_

- **Breakpoints:** desktop by default, a narrower two-column layout from 769px to 1199px, tablet styles at 768px and below, phone styles at 600px and below, and an extra fix at 360px so the longest tab names still fit on very small phones.
- Sizes use `clamp()` (for example `gap: clamp(20px, 3vw, 40px)`), so spacing and type scale smoothly between breakpoints.
- Features check what the device can do (`@media (hover: none)`), not only how wide the screen is. A large tablet still gets touch-friendly cards.

### 12. Accessibility

Things that help keyboard and screen-reader users:

- A `<main>` landmark, `lang="en"` and real `<button>` elements for interactive controls.
- `aria-label` on icon-only buttons and links, and `aria-hidden` on decorative SVGs and canvases.
- Visible `:focus-visible` outlines, and keyboard-reachable project overlays.
- `prefers-reduced-motion` turns off spinning, twinkling and zoom animations.
- Text colours chosen for contrast. For example, the green on dark tab labels is about 13:1, well above the 4.5:1 minimum.

### 13. SEO and link previews

**File:** `index.html` `<head>`, `robots.txt`, `sitemap.xml`

- A descriptive `<title>`, meta description and canonical URL.
- **Open Graph and Twitter Card** tags, so links shared on LinkedIn, X, WhatsApp and similar apps show a rich preview. The preview image is a **1200×630 PNG**, because LinkedIn doesn't reliably show WebP previews.
- **JSON-LD structured data** (`schema.org/Person`) with name, job title, universities and social profiles. This helps Google connect the site to the person.
- `robots.txt` and `sitemap.xml` for crawlers, plus Google Analytics (gtag.js).

### 14. Performance

- Images are **WebP** and use `loading="lazy"`. Project images are 1200×1200 with `aspect-ratio: 1 / 1` set, so the layout doesn't jump while they load.
- Icons are **inline SVGs** (shapes from Font Awesome Free) instead of a whole icon font. They size with `font-size` and take the text colour.
- Earlier versions used heavy 3D Spline embeds. These were replaced with static images and a lightweight canvas animation.
- The only external script is GSAP. `skills-data.js` loads before `script.js` because the explorer reads `SKILL_GROUPS`.

---

## Deploying on GitHub Pages

1. Push the repo to GitHub.
2. Go to **Settings → Pages**, choose "Deploy from a branch", then pick `main` and `/ (root)`.
3. For a custom domain:
   - Put the domain in the `CNAME` file.
   - Point your DNS at GitHub Pages: `A` records to GitHub's IPs, or a `CNAME` record to `<username>.github.io`.
   - Turn on "Enforce HTTPS".

Every push to `main` redeploys the site automatically.

## Using this as a template

You're welcome to learn from this code and reuse techniques. If you build your own site from it, please:

1. **Replace all personal content:** name, text, images, resume, links, analytics ID (`G-…`), the Apps Script URL, meta tags, JSON-LD and `CNAME`.
2. **Edit `skills-data.js`** with your own skills and places. No code changes are needed.
3. **Swap the About image.** If you keep the night sky, update `STAR_SPOTS` and `METEOR_PATHS` in `script.js` to fractions that fall on empty sky in _your_ image. A quick way is to temporarily log `offsetX / width` and `offsetY / height` on click.
4. **Update the "Ask AI about me" prompt** in the footer links so it points to your own site and name.
5. Change the accent colours in `style.css`: green (`#00ff88`) for About, coral and orange for Projects and Contact, and purple for the contact buttons.

## Credits

- Animations: [GSAP](https://gsap.com/)
- Icons: shapes from [Font Awesome Free](https://fontawesome.com/) (CC BY 4.0)
- Designed and built by **Kaustubh Hari Sethi**. Find me on [LinkedIn](https://www.linkedin.com/in/kaustubh-hari-sethi/), [GitHub](https://github.com/khs14) or [X](https://twitter.com/CodesKhs).
