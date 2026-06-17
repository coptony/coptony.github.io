const body = document.body;
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const hashLinks = document.querySelectorAll('a[href^="#"]');
const sections = document.querySelectorAll('section[id]');
const reveals = document.querySelectorAll('.reveal');
const heroText = document.querySelector('.hero-text');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const getHeaderHeight = () => {
  if (!header) return 0;
  return header.offsetHeight || 72;
};

const setScrollState = () => {
  const scrollY = window.scrollY;

  if (!header) return;

  if (scrollY > 24) {
    header.classList.add('scrolled');
    body.classList.add('is-scrolled');
  } else {
    header.classList.remove('scrolled');
    body.classList.remove('is-scrolled');
  }

  if (heroText && window.innerWidth > 768) {
    heroText.style.transform = `translateY(${scrollY * 0.045}px)`;
  } else if (heroText) {
    heroText.style.transform = 'translateY(0)';
  }
};

const smoothScrollTo = (targetY, duration = 900) => {
  if (prefersReducedMotion) {
    window.scrollTo(0, targetY);
    return;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animation = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    body.classList.toggle('menu-open');
  });
}

hashLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');

    if (!targetId || targetId === '#') return;

    const targetSection = document.querySelector(targetId);

    if (!targetSection) return;

    event.preventDefault();

    body.classList.remove('menu-open');

    const headerHeight = getHeaderHeight();
    const targetY =
      targetId === '#top'
        ? 0
        : targetSection.getBoundingClientRect().top + window.scrollY - headerHeight + 1;

    smoothScrollTo(targetY, 950);
  });
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
    threshold: 0.38,
    rootMargin: '-20% 0px -45% 0px',
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;

      entry.target.style.transitionDelay = `${Math.min(index * 70, 210)}ms`;
      entry.target.classList.add('is-visible');

      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.14,
  }
);

reveals.forEach((item) => {
  revealObserver.observe(item);
});

window.addEventListener('scroll', setScrollState, { passive: true });
window.addEventListener('resize', setScrollState);

setScrollState();