const body = document.body;
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const hashLinks = document.querySelectorAll('a[href^="#"]');
const sections = document.querySelectorAll('section[id]');
const reveals = document.querySelectorAll('.reveal');
const heroText = document.querySelector('.hero-text');

const getHeaderHeight = () => {
  if (!header) return 0;
  return header.offsetHeight || 72;
};

const setActiveNav = () => {
  const scrollPoint = window.scrollY + getHeaderHeight() + window.innerHeight * 0.22;

  let currentId = 'top';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollPoint >= sectionTop && scrollPoint < sectionBottom) {
      currentId = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === `#${currentId}`
    );
  });
};

const setScrollState = () => {
  const scrollY = window.scrollY;

  if (header) {
    if (scrollY > 24) {
      header.classList.add('scrolled');
      body.classList.add('is-scrolled');
    } else {
      header.classList.remove('scrolled');
      body.classList.remove('is-scrolled');
    }
  }

  if (heroText && window.innerWidth > 768) {
    heroText.style.transform = `translateY(${scrollY * 0.025}px)`;
  } else if (heroText) {
    heroText.style.transform = 'translateY(0)';
  }

  setActiveNav();
};

const smoothScrollTo = (targetY, duration = 1100) => {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  const easeInOutCubic = (t) => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const animation = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

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

    navLinks.forEach((navLink) => {
      navLink.classList.toggle(
        'active',
        navLink.getAttribute('href') === targetId
      );
    });

    const headerHeight = getHeaderHeight();

    const targetY =
      targetId === '#top'
        ? 0
        : targetSection.offsetTop - headerHeight + 1;

    smoothScrollTo(targetY, 1100);
  });
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