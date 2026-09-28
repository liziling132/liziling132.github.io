(function () {
  const introStorageKey = 'ling-home-intro-played';
  const isHomePath = () => location.pathname === '/' || location.pathname === '/index.html';
  const isHomeListPath = () => isHomePath() || /^\/page\/\d+\/(?:index\.html)?$/.test(location.pathname);
  const hasPlayedIntro = () => sessionStorage.getItem(introStorageKey) === 'true';
  const markIntroPlayed = () => sessionStorage.setItem(introStorageKey, 'true');

  const revealHomePosts = () => {
    const items = [
      ...document.querySelectorAll('#recent-posts .recent-post-item'),
      ...document.querySelectorAll('#aside-content .card-widget')
    ];

    if (!items.length) return;

    document.body.classList.add('home-post-reveal-ready');

    items.forEach((item, index) => {
      item.style.setProperty('--home-post-order', index % 4);
    });

    if (!('IntersectionObserver' in window)) {
      items.forEach(item => item.classList.add('home-post-visible'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('home-post-visible', entry.isIntersecting);
      });
    }, {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.18
    });

    items.forEach(item => observer.observe(item));
  };

  const start = () => {
    markIntroPlayed();

    const intro = document.createElement('div');
    intro.className = 'home-intro';
    intro.setAttribute('aria-hidden', 'true');
    intro.innerHTML = `
      <div class="home-intro__panel home-intro__panel--left"></div>
      <div class="home-intro__panel home-intro__panel--right"></div>
      <div class="home-intro__cut-line"></div>
      <h1 class="home-intro__title">Ling</h1>
    `;

    document.body.classList.add('intro-lock');
    document.body.appendChild(intro);

    requestAnimationFrame(() => intro.classList.add('is-running'));

    window.setTimeout(() => {
      document.body.classList.remove('intro-lock');
      intro.remove();
    }, 4500);
  };

  const run = () => {
    document.body.classList.remove('home-post-reveal-ready');

    if (isHomePath() && !hasPlayedIntro() && !document.querySelector('.home-intro')) start();
    if (isHomeListPath()) revealHomePosts();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }

  document.addEventListener('pjax:complete', run);
})();
