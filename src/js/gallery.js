export function initGalleryLightbox() {
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('gallery-modal-img');
  const modalCaption = document.getElementById('gallery-modal-caption');
  const closeBtn = document.getElementById('close-gallery-modal');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!modal || !modalImg) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.getAttribute('data-caption') || img?.alt || 'Wedding Moment';
      
      if (img) {
        modalImg.src = img.src;
        if (modalCaption) modalCaption.textContent = caption;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}
