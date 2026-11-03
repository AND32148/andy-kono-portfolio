const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.site-nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
const revealItems = document.querySelectorAll('.reveal');
const contactForm = document.querySelector('[data-contact-form]');
const backToTop = document.querySelector('[data-back-to-top]');
const typingTarget = document.querySelector('[data-typing]');
const roles = ['AI Engineer', 'Software Developer', 'Problem Solver'];

menuToggle?.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

navLinks.forEach((link) => link.addEventListener('click', () => {
  siteNav.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`));
}, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.2, 0.5] });
sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 18);
  backToTop?.classList.toggle('is-visible', window.scrollY > 600);
}, { passive: true });
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.querySelector('[data-year]').textContent = new Date().getFullYear();

let roleIndex = 0;
let letterIndex = 0;
let deleting = false;
function typeRole() {
  if (!typingTarget || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const role = roles[roleIndex];
  typingTarget.textContent = deleting ? role.slice(0, letterIndex - 1) : role.slice(0, letterIndex + 1);
  letterIndex += deleting ? -1 : 1;
  let delay = deleting ? 55 : 105;
  if (!deleting && letterIndex === role.length) { deleting = true; delay = 1500; }
  if (deleting && letterIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 350; }
  window.setTimeout(typeRole, delay);
}
typeRole();

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  const status = contactForm.querySelector('.form-status');
  status.textContent = 'Opening your email client…';
  window.location.href = `mailto:andykono15@gmail.com?subject=${subject}&body=${body}`;
});
