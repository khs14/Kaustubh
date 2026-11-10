// === GSAP Page Load Animation ===
function loadinganimation() {
  // If the GSAP script didn't load (CDN down or blocked), skip the intro
  // animation instead of stopping the rest of this file
  if (typeof gsap === "undefined") return;
  gsap.from("#page1 h1", {
    y: 100,
    opacity: 0,
    delay: 0.1,
    duration: 0.9,
    stagger: 0.3,
  });
  // Subheading lines fade up one after another as the name settles
  gsap.from(".hero-subtitle p", {
    y: 20,
    opacity: 0,
    delay: 0.6,
    duration: 0.6,
    stagger: 0.15,
    ease: "power2.out",
  });
  gsap.from("#about", {
    scale: 0.9,
    opacity: 0,
    delay: 1.1,
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

// === CAREER HIGHLIGHTS MODAL ===
const highlightsOverlay = document.getElementById('highlights-overlay');

function openHighlights() {
  highlightsOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeHighlights(event) {
  // If this was triggered by clicking inside the modal itself, ignore it
  if (event && event.target !== highlightsOverlay && event.type === 'click') {
    return;
  }
  highlightsOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && highlightsOverlay.classList.contains('active')) {
    closeHighlights();
  }
});

// === SKILLS EXPLORER ===
// The skill list lives in skills-data.js (loaded before this file).

(function buildSkillsExplorer() {
  const skillsTab = document.getElementById("skills");
  const groupsEl = document.getElementById("skill-groups");
  const panelEl = document.getElementById("skill-panel");
  if (!skillsTab || !groupsEl || !panelEl || typeof SKILL_GROUPS === "undefined") return;

  const TYPE_LABEL = { work: "Work", project: "Project", education: "Education", activity: "Activity" };
  const TYPE_ORDER = ["work", "project", "education", "activity"];

  function escapeHTML(s) {
    return s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  // Back to the full list: every chip and heading visible, box hidden
  function clearSkill() {
    groupsEl.querySelectorAll(".skill-chip").forEach(c => {
      c.classList.remove("selected");
      c.setAttribute("aria-pressed", "false");
    });
    groupsEl.querySelectorAll(".skill-group").forEach(g => g.classList.remove("active-group"));
    skillsTab.classList.remove("skill-focused");
    panelEl.innerHTML = "";
  }

  // Focus on one skill: only its chip and the evidence box stay visible
  function showSkill(name, places, chip) {
    clearSkill();
    chip.classList.add("selected");
    chip.setAttribute("aria-pressed", "true");
    chip.closest(".skill-group").classList.add("active-group");
    skillsTab.classList.add("skill-focused");

    const sorted = [...places].sort((a, b) => TYPE_ORDER.indexOf(a[0]) - TYPE_ORDER.indexOf(b[0]));
    const items = sorted.map(([type, place, how, url]) => {
      const title = url
        ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${escapeHTML(place)}</a>`
        : escapeHTML(place);
      return `<div class="skill-place">
          <span class="place-type ${type}">${TYPE_LABEL[type]}</span>
          <div><span class="place-name">${title}</span><span class="place-how">${escapeHTML(how)}</span></div>
        </div>`;
    }).join("");

    panelEl.innerHTML = `<p class="skill-panel-title">${escapeHTML(name)}
        <span>· used in ${places.length} ${places.length === 1 ? "place" : "places"}</span></p>${items}`;
  }

  for (const [group, skills] of Object.entries(SKILL_GROUPS)) {
    const section = document.createElement("div");
    section.className = "skill-group";
    section.innerHTML = `<p class="skill-group-title">${group}</p><div class="skill-chips"></div>`;
    const chipsEl = section.querySelector(".skill-chips");

    // Strongest skills first
    const ordered = Object.entries(skills).sort((a, b) => b[1].length - a[1].length);
    for (const [name, places] of ordered) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "skill-chip";
      chip.setAttribute("aria-pressed", "false");
      chip.innerHTML = `${escapeHTML(name)} <span class="skill-count">${places.length}</span><span class="skill-close" aria-hidden="true">×</span>`;
      // Click to focus on a skill; click it again to go back to all skills
      chip.addEventListener("click", () => {
        if (chip.classList.contains("selected")) clearSkill();
        else showSkill(name, places, chip);
      });
      chipsEl.appendChild(chip);
    }
    groupsEl.appendChild(section);
  }
})();
// === NIGHT SKY: twinkling stars + shooting star over the About image ===
// Used on the About image and on its enlarged (modal) version.
// Positions are fractions of the image size, picked from the open black sky
// so nothing lands on the palm tree, clouds, birds or sun — they line up at
// any screen size.
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const STAR_SPOTS = [
    [0.5517, 0.1711],
    [0.965, 0.14],
    [0.9933, 0.0689],
    [0.6767, 0.0556],
    [0.3083, 0.1156],
    [0.35, 0.5644],
    [0.7283, 0.3556],
    [0.535, 0.3867],
    [0.5283, 0.6556],
    [0.76, 0.3222],
    [0.5917, 0.0244],
    [0.605, 0.1911],
    [0.8417, 0.0667],
    [0.49, 0.1467],
    [0.6783, 0.4444],
    [0.2333, 0.4889],
    [0.475, 0.4711],
    [0.3967, 0.0133],
    [0.965, 0.3622],
    [0.8783, 0.06],
    [0.6717, 0.1178],
    [0.43, 0.3933],
    [0.5317, 0.0956],
    [0.5833, 0.3],
    [0.9267, 0.0289],
    [0.5617, 0.2533],
    [0.3867, 0.2267],
    [0.5867, 0.5067],
    [0.5867, 0.0956],
    [0.2167, 0.0311],
    [0.7933, 0.1644],
    [0.855, 0.1467],
    [0.75, 0.2067],
    [0.815, 0.5756],
    [0.8917, 0.2933],
    [0.5033, 0.5822],
    [0.1783, 0.0956],
    [0.4583, 0.0178],
    [0.4433, 0.0933],
    [0.3783, 0.0756],
    [0.4067, 0.1244],
    [0.7617, 0.12],
    [0.1433, 0.4333],
    [0.48, 0.2756],
    [0.62, 0.3733],
    [0.81, 0.3156],
    [0.9017, 0.1756],
    [0.6633, 0.3689],
    [0.2267, 0.4089],
    [0.1183, 0.5711],
    [0.35, 0.2622],
    [0.49, 0.0511],
    [0.3383, 0.0867],
    [0.9367, 0.2267],
    [0.6217, 0.2622],
    [0.3333, 0.0133],
    [0.6367, 0.4867],
    [0.7, 0.5111],
    [0.435, 0.2956],
    [0.4067, 0.3422],
    [0.8933, 0.2378],
    [0.76, 0.4911],
    [0.6667, 0.6],
    [0.7167, 0.0911],
    [0.845, 0.2267],
    [0.8267, 0.4733],
    [0.7167, 0.14],
    [0.8067, 0.2222]
  ];

  // Shooting-star paths: [startX, startY, dx, dy] — each runs through clear sky
  const METEOR_PATHS = [
    [0.6533, 0.0267, -0.2155, 0.1183],
    [0.7833, 0.24, -0.1693, 0.1533],
    [0.775, 0.0356, -0.2566, 0.1956],
    [0.655, 0.2756, -0.2419, 0.092],
    [0.9883, 0.1111, -0.2109, 0.1372],
    [0.9133, 0.0133, -0.2347, 0.2023],
    [0.7183, 0.0978, -0.1964, 0.107],
    [0.885, 0.2133, -0.1808, 0.1214],
    [0.595, 0.1267, -0.2477, 0.0957],
    [0.8367, 0.1022, -0.2909, 0.1583],
    [0.9933, 0.2667, -0.2536, 0.1498],
    [0.84, 0.3156, -0.2813, 0.1798]
  ];

  const SHOOTING_STAR_EVERY = 5000; // ms
  const METEOR_DURATION = 1400;     // ms

  // Soft round glow, drawn once and reused for every star's haze
  const GLOW = (function () {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,0.55)");
    grad.addColorStop(0.25, "rgba(220,230,255,0.22)");
    grad.addColorStop(0.6, "rgba(200,215,255,0.06)");
    grad.addColorStop(1, "rgba(200,215,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return c;
  })();

  // Slight colour differences, like real stars (mostly white, a few cool/warm)
  const TINTS = ["255,255,255", "255,255,255", "255,255,255", "225,235,255", "255,244,228"];

  const rand = (a, b) => a + Math.random() * (b - a);
  const smooth = (t) => t * t * (3 - 2 * t);

  function createNightSky(canvas) {
    const ctx = canvas.getContext("2d");

    // Each star drifts between random brightness levels at random speeds,
    // and now and then flares up — so no two stars twinkle in step.
    const stars = STAR_SPOTS.map(([x, y]) => {
      const big = Math.random() < 0.18;
      const base = big ? rand(0.6, 0.85) : rand(0.3, 0.65);
      return {
        x, y, big, base,
        r: big ? rand(1.2, 1.8) : rand(0.5, 1.1),
        tint: TINTS[Math.floor(Math.random() * TINTS.length)],
        from: base, to: base, t0: 0, dur: 1, // current brightness drift
        flareAt: 0, flareDur: 0,             // occasional glint
        rayAt: 0, rayDur: 0, rayLen: 0, rayDiag: false, // random burst of light rays
      };
    });

    function brightness(s, now) {
      if (reduceMotion) return s.base;
      // Pick a new random target when the current drift ends
      let p = (now - s.t0) / s.dur;
      if (p >= 1) {
        s.from = s.to;
        s.to = Math.max(0.08, Math.min(1, s.base + rand(-0.45, 0.35)));
        s.t0 = now;
        s.dur = rand(300, 2200);      // sometimes a quick flicker, sometimes slow
        p = 0;
      }
      let b = s.from + (s.to - s.from) * smooth(p);
      // Tiny fast shimmer on top (atmospheric scintillation)
      b += Math.sin(now * 0.012 + s.x * 100) * 0.04;

      // Rare random flare
      if (!s.flareDur && Math.random() < (s.big ? 0.001 : 0.0003)) {
        s.flareAt = now; s.flareDur = rand(500, 1100);
      }
      if (s.flareDur) {
        const f = (now - s.flareAt) / s.flareDur;
        if (f >= 1) s.flareDur = 0;
        else b += Math.sin(f * Math.PI) * 0.6;
      }
      return Math.max(0, Math.min(1.3, b));
    }

    let w = 0, h = 0, scale = 1;
    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scale = Math.max(w / 600, 0.6); // image is 600px wide natively
      if (reduceMotion) draw(0);
    }

    function drawStar(s, now) {
      const b = brightness(s, now);
      const x = s.x * w, y = s.y * h, r = s.r * scale;

      // Hazy glow around the star, breathing with its brightness
      const g = r * (s.big ? 9 : 7) * (0.8 + b * 0.4);
      ctx.globalAlpha = Math.min(1, b * (s.big ? 0.75 : 0.5));
      ctx.drawImage(GLOW, x - g, y - g, g * 2, g * 2);

      // Core
      ctx.globalAlpha = Math.min(1, b);
      ctx.fillStyle = `rgb(${s.tint})`;
      ctx.beginPath();
      ctx.arc(x, y, r * (0.85 + b * 0.25), 0, Math.PI * 2);
      ctx.fill();

      // Light rays: each star bursts into a cross of rays at random moments
      // (big stars more often), the rays grow out and fade back in.
      let ray = 0;
      if (reduceMotion) {
        ray = s.big ? 0.5 : 0;
      } else {
        if (!s.rayDur && Math.random() < (s.big ? 0.004 : 0.0006)) {
          s.rayAt = now;
          s.rayDur = rand(600, 1600);
          s.rayLen = s.big ? rand(6, 10) : rand(5, 8);
          s.rayDiag = Math.random() < 0.3; // sometimes faint diagonal rays too
        }
        if (s.rayDur) {
          const f = (now - s.rayAt) / s.rayDur;
          if (f >= 1) s.rayDur = 0;
          else ray = Math.sin(f * Math.PI);
        }
      }
      if (ray > 0.02) {
        const len = Math.max(r * (s.rayLen || 6), 4 * scale) * ray;
        const alpha = Math.min(1, 0.4 + b * 0.6) * ray;
        const arms = [[1, 0, 1], [0, 1, 1]];
        if (s.rayDiag) arms.push([0.707, 0.707, 0.5], [0.707, -0.707, 0.5]);
        ctx.globalAlpha = 1;
        ctx.lineCap = "round";
        for (const [dx, dy, k] of arms) {
          const L = len * k;
          const gr = ctx.createLinearGradient(x - dx * L, y - dy * L, x + dx * L, y + dy * L);
          gr.addColorStop(0, `rgba(${s.tint},0)`);
          gr.addColorStop(0.5, `rgba(${s.tint},${alpha * (k === 1 ? 0.9 : 0.5)})`);
          gr.addColorStop(1, `rgba(${s.tint},0)`);
          ctx.strokeStyle = gr;
          ctx.lineWidth = Math.max(0.5, r * (k === 1 ? 0.45 : 0.3));
          ctx.beginPath();
          ctx.moveTo(x - dx * L, y - dy * L);
          ctx.lineTo(x + dx * L, y + dy * L);
          ctx.stroke();
        }
      }
    }

    let meteor = null, lastPath = -1;
    function launchMeteor(now) {
      let i;
      do { i = Math.floor(Math.random() * METEOR_PATHS.length); }
      while (i === lastPath && METEOR_PATHS.length > 1);
      lastPath = i;
      meteor = { path: METEOR_PATHS[i], start: now };
    }

    function drawMeteor(now) {
      if (!meteor) return;
      const p = (now - meteor.start) / METEOR_DURATION;
      if (p >= 1) { meteor = null; return; }

      const [sx, sy, dx, dy] = meteor.path;
      const ease = 1 - Math.pow(1 - p, 2);
      const headX = (sx + dx * ease) * w, headY = (sy + dy * ease) * h;
      const tailP = Math.max(0, ease - 0.35);
      const tailX = (sx + dx * tailP) * w, tailY = (sy + dy * tailP) * h;
      const fade = p < 0.15 ? p / 0.15 : p > 0.7 ? (1 - p) / 0.3 : 1;

      const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(1, "rgba(255,255,255,0.95)");
      ctx.globalAlpha = fade;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6 * scale;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.stroke();

      const g = 7 * scale;
      ctx.drawImage(GLOW, headX - g, headY - g, g * 2, g * 2);
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(headX, headY, 1.3 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    function draw(now) {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) drawStar(s, now);
      drawMeteor(now);
      ctx.globalAlpha = 1;
    }

    new ResizeObserver(resize).observe(canvas);
    resize();
    if (reduceMotion) return; // static stars only, no animation

    // Only animate while the canvas is on screen and the tab is visible
    let visible = false, rafId = null, nextMeteorAt = 0;
    function frame(now) {
      if (!nextMeteorAt) nextMeteorAt = now + 1500; // first one shortly after it appears
      if (now >= nextMeteorAt) {
        launchMeteor(now);
        nextMeteorAt = now + SHOOTING_STAR_EVERY;
      }
      draw(now);
      rafId = requestAnimationFrame(frame);
    }
    function start() { if (!rafId && visible && !document.hidden) rafId = requestAnimationFrame(frame); }
    function stop() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      nextMeteorAt = 0; meteor = null;
    }

    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { resize(); start(); } else stop();
    }).observe(canvas);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  }

  document.querySelectorAll(".night-sky").forEach(createNightSky);
})();
