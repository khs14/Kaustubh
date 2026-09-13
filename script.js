// === GSAP Page Load Animation ===
function loadinganimation() {
  gsap.from("#page1 h1", {
    y: 100,
    opacity: 0,
    delay: 0.1,
    duration: 0.9,
    stagger: 0.3,
  });
  gsap.from("#about", {
    scale: 0.9,
    opacity: 0,
    delay: 0.9,
    duration: 0.3,
  });
}
loadinganimation();

// === TAB FUNCTIONALITY ===
var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(element, tabname) {
  for (let tablink of tablinks) tablink.classList.remove("active-link");
  for (let tabcontent of tabcontents) tabcontent.classList.remove("active-tab");

  element.classList.add("active-link");
  document.getElementById(tabname).classList.add("active-tab");
}

// === BURGER MENU ===
const burgerMenu = document.getElementById('burger-menu');
const navContainer = document.getElementById('nav-container');
const menuOverlay = document.getElementById('menu-overlay');

function toggleMenu() {
  burgerMenu.classList.toggle('active');
  navContainer.classList.toggle('active');
  menuOverlay.classList.toggle('active');
  document.body.style.overflow = navContainer.classList.contains('active') ? 'hidden' : '';
}

burgerMenu.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', toggleMenu);

const navLinks = document.querySelectorAll('.nav-container nav ul li a');
navLinks.forEach(link => {
  link.addEventListener('click', function() {
    if (window.innerWidth <= 768) toggleMenu();
  });
});

// === PRELOADER ===
if (window.innerWidth > 768) {
  const preloader = document.getElementById('preloader');
  const main = document.getElementById('main');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');

  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    progressFill.style.width = progress + '%';
    progressText.textContent = `INITIALIZING... ${progress}%`;
    if (progress >= 100) clearInterval(interval);
  }, 200);

  setTimeout(() => {
    preloader.style.opacity = '0';
    preloader.style.visibility = 'hidden';
    main.style.opacity = '1';
  }, 2000);
}

// === LAZY-LOADED SPLINE VIEWERS ===
// Spline scenes are heavy (large runtime + WASM) so we:
//   1. Skip them entirely on small/mobile screens.
//   2. Only load the viewer script + scene once the container
//      actually scrolls near the viewport.
//   3. Load the runtime script once and reuse it for every scene.

const SPLINE_VIEWER_SRC = 'https://unpkg.com/@splinetool/viewer@1.10.29/build/spline-viewer.js';
const SPLINE_MIN_WIDTH = 769; // matches the >768 breakpoint used elsewhere on this page

let splineScriptPromise = null;

function loadSplineRuntime() {
  if (!splineScriptPromise) {
    splineScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = SPLINE_VIEWER_SRC;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return splineScriptPromise;
}

function mountSplineViewer(container) {
  const url = container.getAttribute('data-spline-url');
  if (!url || container.dataset.loaded === 'true') return;
  container.dataset.loaded = 'true';

  loadSplineRuntime()
    .then(() => {
      const viewer = document.createElement('spline-viewer');
      viewer.setAttribute('url', url);
      viewer.style.width = '100%';
      viewer.style.height = '100%';
      container.innerHTML = '';
      container.appendChild(viewer);
    })
    .catch(() => {
      // Runtime failed to load (offline, blocked, etc.) — just leave the
      // placeholder in place instead of leaving a broken/half-loaded scene.
      container.classList.add('spline-failed');
    });
}

function initLazySplineViewers() {
  const containers = document.querySelectorAll('.spline-lazy');
  if (!containers.length) return;

  // On small screens, skip the heavy 3D runtime but show a static fallback
  // image (if provided) instead of leaving an empty gap in the layout.
  if (window.innerWidth < SPLINE_MIN_WIDTH) {
    containers.forEach(el => {
      const fallbackSrc = el.getAttribute('data-fallback-img');
      if (fallbackSrc) {
        const img = document.createElement('img');
        img.src = fallbackSrc;
        img.alt = '';
        img.loading = 'lazy';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '12px';
        el.innerHTML = '';
        el.appendChild(img);
        el.classList.add('spline-fallback-img');
      } else {
        el.classList.add('spline-disabled');
      }
    });
    return;
  }

  if (!('IntersectionObserver' in window)) {
    // Fallback: just load them straight away.
    containers.forEach(mountSplineViewer);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          mountSplineViewer(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '200px 0px', threshold: 0.1 }
  );

  containers.forEach(el => observer.observe(el));
}

initLazySplineViewers();

// === FORM SUBMISSION ===
const scriptURL = 'https://script.google.com/macros/s/AKfycbzMBDvdMzSuhwK_JD5KXSlOAGVlg3Ltq4ptgcXUUm_b-wLoVWkXM7xFAzY2NcA5oI2Hwg/exec';
const form = document.forms['submit-to-google-sheet'];
const msg = document.createElement('p'); // message element
msg.id = "form-message";
msg.style.color = "lightgreen";
msg.style.fontSize = "1rem";
msg.style.marginTop = "10px";
form.appendChild(msg);

form.addEventListener('submit', e => {
  e.preventDefault();
  msg.textContent = "Submitting...";

  fetch(scriptURL, { method: 'POST', mode: 'no-cors', body: new FormData(form) })
    .then(() => {
      msg.textContent = "✅ Message sent successfully!";
      form.reset();
      setTimeout(() => msg.textContent = "", 4000);
    })
    .catch(error => {
      console.error('Error!', error.message);
      msg.textContent = "❌ Something went wrong. Please try again.";
    });
});
