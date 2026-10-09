// Ambient Background Music Player & Web Audio Synthesizer

export function initAudioPlayer() {
  const toggleBtn = document.getElementById('music-toggle-btn');
  const floatingMusicBtn = document.getElementById('floating-music-btn');
  const musicStatusText = document.getElementById('music-status-text');
  const musicIcon = document.getElementById('music-icon');
  
  let isPlaying = false;
  let audioCtx = null;
  let timerId = null;

  // Harmonious romantic harp & bell frequencies (F major / D minor romantic cadence)
  const notes = [
    349.23, 440.00, 523.25, 659.25, 523.25, 440.00,
    392.00, 493.88, 587.33, 698.46, 587.33, 493.88,
    329.63, 392.00, 523.25, 659.25, 523.25, 392.00,
    293.66, 349.23, 440.00, 587.33, 440.00, 349.23
  ];

  function playPluckNote(freq, delay = 0) {
    if (!audioCtx || audioCtx.state !== 'running') return;

    setTimeout(() => {
      if (!isPlaying) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Warm harp chime envelope
        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 2.4);
      } catch (e) {
        console.warn('Audio note play error', e);
      }
    }, delay * 1000);
  }

  function startMelodyLoop() {
    let index = 0;
    const playNextNote = () => {
      if (!isPlaying) return;
      playPluckNote(notes[index % notes.length], 0);
      if (index % 3 === 0) {
        playPluckNote(notes[(index + 2) % notes.length] * 0.5, 0.1); // Warm sub bass
      }
      index++;
      timerId = setTimeout(playNextNote, 520);
    };
    playNextNote();
  }

  async function togglePlay(forceState = null) {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtx();
    }

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    if (forceState !== null) {
      isPlaying = forceState;
    } else {
      isPlaying = !isPlaying;
    }

    if (isPlaying) {
      if (timerId) clearTimeout(timerId);
      startMelodyLoop();
      toggleBtn?.classList.add('animate-pulse');
      floatingMusicBtn?.classList.add('animate-spin-slow', 'bg-rose-700');
      if (musicStatusText) musicStatusText.textContent = 'Pause Music';
    } else {
      if (timerId) clearTimeout(timerId);
      toggleBtn?.classList.remove('animate-pulse');
      floatingMusicBtn?.classList.remove('animate-spin-slow', 'bg-rose-700');
      if (musicStatusText) musicStatusText.textContent = 'Play Music';
    }
  }

  toggleBtn?.addEventListener('click', () => togglePlay());
  floatingMusicBtn?.addEventListener('click', () => togglePlay());

  window.addEventListener('start-music-requested', () => {
    togglePlay(true);
  });
}
