(() => {
  const host = document.getElementById('comments-host');
  const status = document.getElementById('comments-status');
  if (!host || !status) return;
  fetch('assets/data/comments.json', { cache: 'no-store' })
    .then(response => { if (!response.ok) throw new Error('設定を読み込めません'); return response.json(); })
    .then(config => {
      if (!config.endpoint) return;
      const url = new URL(config.endpoint);
      if (url.origin !== 'https://script.google.com' || !/^\/macros\/s\/[^/]+\/exec$/.test(url.pathname)) throw new Error('接続先を確認してください');
      const frame = document.createElement('iframe');
      frame.src = url.href;
      frame.className = 'comments-frame';
      frame.title = 'コーヒーの感想・公開コメント';
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer';
      frame.addEventListener('load', () => { status.textContent = '投稿は団体側の確認後に公開されます。読み込めない場合は、公式LINEをご利用ください。'; });
      host.append(frame);
    })
    .catch(() => { status.textContent = 'コメント欄を読み込めませんでした。お問い合わせは公式LINEをご利用ください。'; });
})();
