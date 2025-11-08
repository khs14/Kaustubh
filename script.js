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

// === FORM SUBMISSION ===
const scriptURL = 'https://script.google.com/macros/s/AKfycbxGohhAlDtF2M9sOfonWqAyuX2YRsElYG-EzS02tENU1XKk3PMIeT9fWgqAJhf2sZtQIQ/exec'; 
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
  
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
      msg.textContent = "✅ Message sent successfully!";
      form.reset();
      setTimeout(() => msg.textContent = "", 4000);
    })
    .catch(error => {
      console.error('Error!', error.message);
      msg.textContent = "❌ Something went wrong. Please try again.";
    });
});
