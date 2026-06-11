/* ============================================================
   CLOSING WITH CAILA — main.js
   ============================================================ */

/* ── MOBILE NAV ── */
function toggleMenu() {
  const links = document.getElementById('navLinks');
  links.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      document.getElementById('navLinks').classList.remove('open');
    });
  });
});

/* ── FAQ ACCORDION ── */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function (el) {
    el.classList.remove('open');
  });
  if (!isOpen) item.classList.add('open');
}

/* ── BLOG FILTER ── */
function filterPosts(category, event) {
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.classList.remove('active');
  });
  if (event && event.target) event.target.classList.add('active');

  var cards = document.querySelectorAll('.hub-card');
  var visible = 0;
  cards.forEach(function (card) {
    if (category === 'all' || card.dataset.category === category) {
      card.classList.remove('hidden');
      visible++;
    } else {
      card.classList.add('hidden');
    }
  });
  var empty = document.getElementById('hubEmpty');
  if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
}

/* ── CONTACT FORM ── */
function handleSubmit(e) {
  e.preventDefault();
  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  var data = new FormData(form);
  fetch(form.action, {
    method: 'POST',
    body: data,
    headers: { 'Accept': 'application/json' }
  })
  .then(function (response) {
    if (response.ok) {
      form.reset();
      form.style.display = 'none';
      success.style.display = 'block';
    } else {
      alert('Something went wrong. Please try again or reach out on Instagram.');
    }
  })
  .catch(function () {
    alert('Something went wrong. Please try again or reach out on Instagram.');
  });
}

/* ── NAV SHADOW ON SCROLL ── */
window.addEventListener('scroll', function () {
  var nav = document.getElementById('nav');
  if (nav) {
    nav.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.06)' : 'none';
  }
});
