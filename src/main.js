import './style.css';
import { 
  createIcons, 
  Music, 
  Volume2,
  VolumeX,
  Sparkles, 
  Heart,
  Calendar,
  MapPin, 
  Clock,
  Navigation, 
  Maximize2, 
  X,
  Check,
  ChevronDown,
  Minus,
  Plus,
  Church,
  Wine,
  MailOpen
} from 'lucide';

import { initEnvelopeCurtain } from './js/envelope.js';
import { initCountdownTimer } from './js/countdown.js';
import { initRSVPForm } from './js/rsvp.js';
import { initGalleryLightbox } from './js/gallery.js';
import { initAudioPlayer } from './js/audio.js';

document.addEventListener('DOMContentLoaded', () => {
  // Render Lucide SVG Icons
  createIcons({
    icons: {
      Music,
      Volume2,
      VolumeX,
      Sparkles,
      Heart,
      Calendar,
      MapPin,
      Clock,
      Navigation,
      Maximize2,
      X,
      Check,
      ChevronDown,
      Minus,
      Plus,
      Church,
      Wine,
      MailOpen
    }
  });

  // Initialize Modules
  initEnvelopeCurtain();
  initCountdownTimer();
  initRSVPForm();
  initGalleryLightbox();
  initAudioPlayer();

  // Scroll Reveal Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
