// Invitation Entry Modal / Curtain Transition

export function initEnvelopeCurtain() {
  const introOverlay = document.getElementById('invitation-curtain');
  const openBtn = document.getElementById('open-invitation-btn');
  const mainContent = document.getElementById('main-wedding-content');
  const musicToggleBtn = document.getElementById('music-toggle-btn');

  if (!introOverlay || !openBtn) return;

  openBtn.addEventListener('click', () => {
    // Fade out curtain smoothly
    introOverlay.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
    introOverlay.style.opacity = '0';
    introOverlay.style.transform = 'scale(1.04)';
    introOverlay.style.pointerEvents = 'none';

    if (mainContent) {
      mainContent.classList.remove('opacity-0');
      mainContent.classList.add('opacity-100');
    }

    setTimeout(() => {
      introOverlay.style.display = 'none';
      document.body.classList.remove('overflow-hidden');
    }, 1000);

    // Auto trigger background music if available
    if (musicToggleBtn) {
      const musicEvent = new CustomEvent('start-music-requested');
      window.dispatchEvent(musicEvent);
    }
  });
}
