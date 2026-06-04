/* ======================================
   CONFIG — pega aquí tu Web App URL de Apps Script
====================================== */
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzarMBGn661V1Z1UY8PPUXI6JDfueJ18rsn31e7cJ0v8sGpgG7kP2lYkqjUbvk4PzSq/exec';

/* ======================================
   ESTADO
====================================== */
let envelopeOpened = false;
let confirmChoice = null;
let carouselIndex = 0;
const totalSlides = 4;

/* ======================================
   AUDIO
====================================== */
const audio = new Audio('SOUND/audio.mp3');
audio.loop = true;
audio.volume = 0.55;

/* ======================================
   ENVELOPE LOGIC
====================================== */
const envScreen = document.getElementById('envelope-screen');

envScreen.addEventListener('click', openEnvelope);
envScreen.addEventListener('touchend', (e) => { e.preventDefault(); openEnvelope(); }, { passive: false });

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  // Play audio
  audio.play().catch(() => {});

  envScreen.classList.add('opened');

  // After animations, hide envelope screen and show invitation
  setTimeout(() => {
    envScreen.classList.add('closing');
  }, 900);

  setTimeout(() => {
    envScreen.style.display = 'none';
    const inv = document.getElementById('invitation');
    inv.classList.remove('hidden');
    inv.classList.add('revealed');
    initScrollReveal();
    initCarousel();
    startTimer();
  }, 1700);
}

/* ======================================
   COUNTDOWN TIMER
====================================== */
function startTimer() {
  const weddingDate = new Date('2026-12-12T19:00:00');

  function updateTimer() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('t-days').textContent = '00';
      document.getElementById('t-hours').textContent = '00';
      document.getElementById('t-mins').textContent = '00';
      document.getElementById('t-secs').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('t-days').textContent = String(days).padStart(2, '0');
    document.getElementById('t-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('t-mins').textContent = String(mins).padStart(2, '0');
    document.getElementById('t-secs').textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ======================================
   SCROLL REVEAL
====================================== */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.section-message .section-inner > *, .section-venue .section-inner > *, ' +
    '.section-rsvp .section-inner > *, .section-dress .section-inner > *, ' +
    '.section-gallery .section-label'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
}

/* ======================================
   CAROUSEL
====================================== */
function initCarousel() {
  const dotsContainer = document.getElementById('carDots');
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'car-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  updateCarousel();
  initSwipe();
}

function carouselMove(dir) {
  carouselIndex = (carouselIndex + dir + totalSlides) % totalSlides;
  updateCarousel();
}

function goToSlide(idx) {
  carouselIndex = idx;
  updateCarousel();
}

function updateCarousel() {
  const carousel = document.getElementById('carousel');
  carousel.style.transform = `translateX(-${carouselIndex * 100}%)`;

  // Update active slide
  const slides = carousel.querySelectorAll('.carousel-slide');
  slides.forEach((s, i) => s.classList.toggle('active', i === carouselIndex));

  // Update dots
  const dots = document.querySelectorAll('.car-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === carouselIndex));
}

function initSwipe() {
  const wrap = document.querySelector('.carousel-wrap');
  let startX = 0;
  let isDragging = false;

  wrap.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  wrap.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      carouselMove(diff > 0 ? 1 : -1);
    }
    isDragging = false;
  }, { passive: true });
}

/* ======================================
   RSVP FORM
====================================== */
function selectConfirm(choice) {
  confirmChoice = choice;
  document.getElementById('btn-yes').classList.toggle('selected', choice === 'yes');
  document.getElementById('btn-no').classList.toggle('selected', choice === 'no');
}

async function submitRSVP() {
  const name = document.getElementById('rsvp-name').value.trim();
  const phone = document.getElementById('rsvp-phone').value.trim();
  const msgEl = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');

  if (!name) { msgEl.textContent = 'Por favor ingresa tu nombre.'; return; }
  if (!phone) { msgEl.textContent = 'Por favor ingresa tu teléfono.'; return; }
  if (!confirmChoice) { msgEl.textContent = '¿Nos confirmas si asistirás?'; return; }

  submitBtn.disabled = true;
  msgEl.textContent = 'Enviando...';

  try {
    const params = new URLSearchParams({
      name,
      phone,
      attending: confirmChoice === 'yes' ? 'Sí' : 'No',
      timestamp: new Date().toLocaleString('es-MX')
    });

    await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, { method: 'GET', mode: 'no-cors' });

    msgEl.textContent = confirmChoice === 'yes'
      ? '¡Gracias! Los esperamos con mucho cariño. 🤍'
      : 'Gracias por avisarnos. ¡Te extrañaremos!';

    document.getElementById('rsvp-name').value = '';
    document.getElementById('rsvp-phone').value = '';
    confirmChoice = null;
    document.getElementById('btn-yes').classList.remove('selected');
    document.getElementById('btn-no').classList.remove('selected');

  } catch (err) {
    msgEl.textContent = 'Hubo un error. Intenta de nuevo.';
    submitBtn.disabled = false;
  }
}
