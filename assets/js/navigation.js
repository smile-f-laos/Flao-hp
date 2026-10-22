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
