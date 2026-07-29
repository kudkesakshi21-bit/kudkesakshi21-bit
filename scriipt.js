document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Footer year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- KPI counters (count up when hero enters view) ---- */
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---- Scroll reveal + bar chart fill + KPI trigger ---- */
  const revealEls = document.querySelectorAll('.reveal');
  const barFills = document.querySelectorAll('.bar-fill');
  const kpiValues = document.querySelectorAll('.kpi-value');
  let kpiTriggered = false;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));

    const barObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    barFills.forEach(el => barObserver.observe(el));

    const kpiObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !kpiTriggered) {
          kpiTriggered = true;
          kpiValues.forEach(animateCount);
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    const kpiRow = document.querySelector('.kpi-row');
    if (kpiRow) kpiObserver.observe(kpiRow);
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(el => el.classList.add('in-view'));
    barFills.forEach(el => el.classList.add('in-view'));
    kpiValues.forEach(animateCount);
  }
});
