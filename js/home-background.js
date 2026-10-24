(function () {
  // 在这里添加或更换首页轮播图片；interval 为切换间隔（毫秒）。
  const images = ['/img/36.png', '/img/49.png', '/img/50.png'];
  const interval = 5000;
  let timer;
  let cleanup;

  const run = async () => {
    clearInterval(timer);
    if (cleanup) cleanup();
    const header = document.querySelector('#page-header.full_page');
    if (!header || images.length < 2) return;

    let active = true;
    const layers = [];
    const targets = [header, document.getElementById('web_bg')].filter(Boolean);
    const groups = [];
    cleanup = () => {
      active = false;
      layers.forEach(layer => layer.remove());
    };

    // 每张图片只加载、解码一次；动画期间不替换图片或重置 transition。
    const loaded = await Promise.all(images.map(async src => {
      const image = new Image();
      image.src = src;
      try {
        await image.decode();
        return src;
      } catch (_) {
        return null;
      }
    }));
    if (!active || !header.isConnected) return;
    const sources = loaded.filter(Boolean);
    if (sources.length < 2) return;
    targets.forEach(target => {
      const group = sources.map((src, index) => {
        const layer = document.createElement('div');
        layer.className = 'home-background-slide';
        layer.setAttribute('aria-hidden', 'true');
        layer.style.backgroundImage = `url("${src}")`;
        layer.style.opacity = index === 0 ? '1' : '0';
        target.appendChild(layer);
        layers.push(layer);
        return layer;
      });
      groups.push(group);
    });
    let index = 0;
    timer = setInterval(() => {
      if (!active || !header.isConnected || document.hidden) return;
      const next = (index + 1) % sources.length;
      groups.forEach(group => {
        group[index].style.opacity = '0';
        group[next].style.opacity = '1';
      });
      index = next;
    }, interval);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else run();
  document.addEventListener('pjax:send', () => {
    clearInterval(timer);
    if (cleanup) cleanup();
  });
  document.addEventListener('pjax:complete', run);
})();
