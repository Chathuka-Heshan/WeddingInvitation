// Interactive Envelope Opening & Video Animation matching Ivory Seal

export function initEnvelopeCurtain() {
  const envelopeOverlay = document.getElementById('invitation-curtain');
  const envelopeCard = document.getElementById('envelope-card');
  const envelopeCopy = document.getElementById('envelope-copy-btn');
  const envelopeVideo = document.getElementById('envelope-video');
  const skipBtn = document.getElementById('envelope-skip-btn');
  const guestGreetingEnvelope = document.getElementById('guest-greeting-envelope');
  const guestGreetingHero = document.getElementById('guest-greeting-hero');

  // 1. Dynamic guest personalization (?guest=Mr%20%26%20Mrs%20Silva or ?name=...)
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('guest') || urlParams.get('name');

  if (guestParam && guestParam.trim() !== '') {
    const formattedGuest = decodeURIComponent(guestParam.trim());
    if (guestGreetingEnvelope) guestGreetingEnvelope.textContent = `Dear ${formattedGuest}`;
    if (guestGreetingHero) guestGreetingHero.textContent = `Dear ${formattedGuest}`;
  }

  if (!envelopeOverlay) return;

  let isOpening = false;
  let isDone = false;

  function finishOpening() {
    if (isDone) return;
    isDone = true;

    envelopeOverlay.classList.remove('playing');
    envelopeOverlay.classList.add('leaving');

    document.body.classList.remove('overflow-hidden');

    // Trigger romantic music/melody
    const musicEvent = new CustomEvent('start-music-requested');
    window.dispatchEvent(musicEvent);

    setTimeout(() => {
      envelopeOverlay.style.display = 'none';
    }, 900);
  }

  function startOpenAnimation(e) {
    if (isOpening || isDone) return;
    isOpening = true;

    envelopeOverlay.classList.add('playing');

    if (skipBtn) {
      skipBtn.classList.remove('hidden');
    }

    if (envelopeVideo) {
      envelopeVideo.currentTime = 0;
      const playPromise = envelopeVideo.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            envelopeVideo.addEventListener('ended', finishOpening, { once: true });
          })
          .catch((err) => {
            console.warn('Video playback notice (falling back gracefully):', err);
            setTimeout(finishOpening, 1200);
          });
      } else {
        envelopeVideo.addEventListener('ended', finishOpening, { once: true });
      }

      // Safety timeout in case video stalls or fails to fire ended
      setTimeout(() => {
        if (!isDone) {
          finishOpening();
        }
      }, 5500);
    } else {
      setTimeout(finishOpening, 700);
    }
  }

  // Click listeners: clicking copy card, envelope card, or the button triggers animation
  if (envelopeCopy) {
    envelopeCopy.addEventListener('click', (e) => {
      e.stopPropagation();
      startOpenAnimation(e);
    });
  }

  if (envelopeCard) {
    envelopeCard.addEventListener('click', (e) => {
      startOpenAnimation(e);
    });
  }

  envelopeOverlay.addEventListener('click', (e) => {
    if (e.target === skipBtn || skipBtn?.contains(e.target)) return;
    startOpenAnimation(e);
  });

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      finishOpening();
    });
  }
}
