const body = document.body;
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const reveals = document.querySelectorAll('.reveal');
const heroText = document.querySelector('.hero-text');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    body.classList.toggle('menu-open');
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (!targetSection) return;

    body.classList.remove('menu-open');

    targetSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
});

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (header) {
    if (scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  if (heroText) {
    heroText.style.transform = `translateY(${scrollY * 0.06}px)`;
  }
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const currentId = entry.target.getAttribute('id');

      navLinks.forEach((link) => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${currentId}`
        );
      });
    });
  },
  {
    root: null,
    threshold: 0.45,
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.16,
  }
);

reveals.forEach((item) => {
  revealObserver.observe(item);
});