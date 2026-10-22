(() => {
  const dialog = document.querySelector('.photo-viewer');
  const photos = Array.from(document.querySelectorAll('.album-photo'));
  if (!dialog || !photos.length || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('.viewer-image');
  const caption = dialog.querySelector('.viewer-caption');
  const count = dialog.querySelector('.viewer-count');
  const previous = dialog.querySelector('.viewer-prev');
  const next = dialog.querySelector('.viewer-next');
  const original = dialog.querySelector('.viewer-original');
  const close = dialog.querySelector('.viewer-close');
  let index = 0;
  let trigger;
  function show(position) {
    index = position;
    const photo = photos[index];
    image.src = photo.href;
    image.alt = photo.dataset.caption;
    caption.textContent = photo.dataset.caption;
    count.textContent = `${index + 1} / ${photos.length}　${photo.dataset.date.replaceAll('-', '/')}`;
    original.href = photo.href;
    previous.disabled = index === 0;
    next.disabled = index === photos.length - 1;
  }
  photos.forEach((photo, position) => photo.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    trigger = photo;
    show(position);
    dialog.showModal();
    close.focus();
  }));
  previous.addEventListener('click', () => { if (index > 0) show(index - 1); });
  next.addEventListener('click', () => { if (index < photos.length - 1) show(index + 1); });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && index > 0) { event.preventDefault(); show(index - 1); }
    if (event.key === 'ArrowRight' && index < photos.length - 1) { event.preventDefault(); show(index + 1); }
  });
  dialog.addEventListener('close', () => trigger?.focus({ preventScroll: true }));
})();
