// 通常のトップURLは先頭から表示する。#activities などのリンクは保持する。
(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  function showPageStart() {
    if (location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  document.addEventListener('DOMContentLoaded', showPageStart, { once: true });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) showPageStart();
  });
})();
