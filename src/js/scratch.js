// Scratch-to-reveal interactive canvas cards
import confetti from 'canvas-confetti';

export function initScratchCards() {
  const scratchContainers = document.querySelectorAll('.scratch-card-canvas');
  if (!scratchContainers.length) return;

  scratchContainers.forEach(canvas => {
    setupCanvas(canvas);
  });
}

function setupCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = canvas.offsetHeight;
  let isDrawing = false;
  let isRevealed = false;

  // Fill canvas with gold/champagne scratch coating pattern
  function drawCover() {
    ctx.fillStyle = '#C5A267'; // Gold foil
    ctx.fillRect(0, 0, width, height);

    // Add metallic sheen gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(255, 235, 170, 0.4)');
    gradient.addColorStop(0.5, 'rgba(180, 130, 60, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 245, 200, 0.5)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Text on scratch surface
    ctx.fillStyle = '#6E4E18';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH ✨', width / 2, height / 2);
  }

  drawCover();

  function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function scratch(pos) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2, false);
    ctx.fill();

    checkPercentScratched();
  }

  function checkPercentScratched() {
    if (isRevealed) return;
    try {
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      let transparentPixels = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparentPixels++;
      }
      const totalPixels = pixels.length / 4;
      const scratchedPercent = (transparentPixels / totalPixels) * 100;

      if (scratchedPercent > 45) {
        isRevealed = true;
        canvas.style.transition = 'opacity 0.6s ease-out';
        canvas.style.opacity = '0';
        setTimeout(() => {
          canvas.style.display = 'none';
        }, 600);

        confetti({
          particleCount: 25,
          spread: 40,
          origin: {
            x: canvas.getBoundingClientRect().left / window.innerWidth + 0.05,
            y: canvas.getBoundingClientRect().top / window.innerHeight + 0.05
          },
          colors: ['#D4AF37', '#F5E6AD', '#8D4B62']
        });
      }
    } catch (e) {
      console.warn('Scratch percentage check failed', e);
    }
  }

  // Pointer & Touch Listeners
  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    scratch(getPosition(e));
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    scratch(getPosition(e));
  });

  window.addEventListener('mouseup', () => {
    isDrawing = false;
  });

  canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    scratch(getPosition(e));
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDrawing) return;
    scratch(getPosition(e));
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    isDrawing = false;
  });
}
