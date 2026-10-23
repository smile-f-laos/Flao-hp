// メニューはクリック・タップ・キーボードで開閉できる。
(() => {
  const nav = document.querySelector('header .site-nav');
  if (!nav) return;
  const groups = [...nav.querySelectorAll('.site-nav-group')];
  groups.forEach((group) => {
    group.addEventListener('toggle', () => {
      if (!group.open) return;
      groups.forEach((other) => { if (other !== group) other.open = false; });
    });
  });
  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target)) groups.forEach((group) => { group.open = false; });
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) groups.forEach((group) => { group.open = false; });
  });
  nav.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const group = groups.find((item) => item.open);
    if (!group) return;
    group.open = false;
    group.querySelector('summary').focus();
  });
})();

// どのページでも、スクロール後に左下から先頭へ戻れる。
(() => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'back-to-top';
  button.hidden = true;
  button.setAttribute('aria-label', 'ページの一番上へ戻る');
  button.title = '一番上へ戻る';
  button.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M5 13l7-7 7 7M12 6v14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span>上へ</span>';
  document.body.append(button);
  let scheduled = false;
  function update() {
    button.hidden = window.scrollY < 400;
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('pageshow', update);
  button.addEventListener('click', () => {
    document.querySelector('header .brand')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
  update();
})();
