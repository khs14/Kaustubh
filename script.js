// === GSAP Page Load Animation ===
function loadinganimation() {
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