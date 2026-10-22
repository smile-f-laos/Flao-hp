// 写真は手動で切り替え。スマホではスワイプでも閲覧できる。
(() => {
  document.querySelectorAll('.photo-carousel').forEach((carousel) => {
    const viewport = carousel.querySelector('.photo-viewport');
    const figures = [...carousel.querySelectorAll('.photo-cell')];
    const previous = carousel.querySelector('.photo-prev');
    const next = carousel.querySelector('.photo-next');
    const counter = carousel.querySelector('.photo-count');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    function update() {
      const mobile = matchMedia('(max-width: 760px)').matches;
      const step = figures[0].getBoundingClientRect().width + 16;
      const start = Math.min(figures.length - 1, Math.round(viewport.scrollLeft / step));
      const end = Math.min(figures.length, start + (mobile ? 1 : 3));
      counter.textContent = (start + 1) + (end === start + 1 ? '' : '–' + end) + ' / ' + figures.length;
      previous.disabled = viewport.scrollLeft < 2;
      next.disabled = viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 2;
    }
    function move(direction) {
      const count = matchMedia('(max-width: 760px)').matches ? 1 : 3;
      const step = figures[0].getBoundingClientRect().width + 16;
      viewport.scrollBy({ left: direction * count * step, behavior: reduce.matches ? 'instant' : 'smooth' });
    }
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    viewport.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
  // 年度や記事への直接リンクは、閉じた詳細も開いて読めるようにする。
  function revealHash() {
    if (!location.hash) return;
    let target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
    if (!target) return;
    if (target.matches('details')) target.open = true;
    for (let parent = target.parentElement; parent; parent = parent.parentElement) {
      if (parent.matches('details')) parent.open = true;
    }
  }
  revealHash();
  addEventListener('hashchange', revealHash);
})();
