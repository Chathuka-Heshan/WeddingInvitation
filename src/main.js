import './style.css';
import { 
  createIcons, 
  Music, 
  Sparkles, 
  Heart,
  Crown,
  Church, 
  Wine, 
  PartyPopper, 
  MapPin, 
  Check, 
  Navigation, 
  Car, 
  Maximize2, 
  X,
  Utensils,
  Search,
  Calendar,
  Camera,
  Instagram,
  Facebook,
  Star,
  BellRing,
  Gift,
  Plane,
  House,
  ChevronDown,
  Album,
  Menu,
  Clock,
  Shirt
} from 'lucide';

import { initEnvelopeCurtain } from './js/envelope.js';
import { initScratchCards } from './js/scratch.js';
import { initSeatingFinder } from './js/seating.js';
import { initCountdownTimer } from './js/countdown.js';
import { initRSVPForm } from './js/rsvp.js';
import { initGuestbook } from './js/guestbook.js';
import { initGalleryLightbox } from './js/gallery.js';
import { initAudioPlayer } from './js/audio.js';
import { initPetalCanvas } from './js/petals.js';

document.addEventListener('DOMContentLoaded', () => {
  // Render Lucide SVG Icons
  createIcons({
    icons: {
      Music,
      Sparkles,
      Heart,
      Crown,
      Church,
      Wine,
      PartyPopper,
      MapPin,
      Check,
      Navigation,
      Car,
      Maximize2,
      X,
      Utensils,
      Search,
      Calendar,
      Camera,
      Instagram,
      Facebook,
      Star,
      BellRing,
      Gift,
      Plane,
      House,
      ChevronDown,
      Album,
      Menu,
      Clock,
      Shirt
    }
  });

  // Initialize interactive features
  initEnvelopeCurtain();
  initScratchCards();
  initSeatingFinder();
  initCountdownTimer();
  initRSVPForm();
  initGuestbook();
  initGalleryLightbox();
  initAudioPlayer();
  initPetalCanvas();

  // Scroll Reveal Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Mobile Menu Drawer Toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
      });
    });
  }

  // Sticky Navbar style on scroll
  const navbar = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar?.classList.add('shadow-md', 'bg-white/95');
      navbar?.classList.remove('bg-white/70');
    } else {
      navbar?.classList.remove('shadow-md', 'bg-white/95');
      navbar?.classList.add('bg-white/70');
    }
  });
});
