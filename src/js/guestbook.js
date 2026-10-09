export function initGuestbook() {
  const form = document.getElementById('guestbook-form');
  const wishesList = document.getElementById('wishes-list');

  if (!form || !wishesList) return;

  const defaultWishes = [
    {
      name: "Aunty Nirmala & Uncle Sunil",
      message: "Wishing dearest Dilsha & Chathuka a lifetime filled with boundless love, endless laughter, and divine blessings! Can't wait to celebrate with you.",
      badge: "🌸 White Rose",
      date: "Nov 10, 2026"
    },
    {
      name: "Roshan & Dinithi",
      message: "May your love grow stronger with each passing day. Cheers to the most wonderful couple, Dilsha & Chathuka!",
      badge: "🥂 Champagne Toast",
      date: "Nov 11, 2026"
    },
    {
      name: "The Wickramasinghe Family",
      message: "So thrilled and proud of both of you! Wishing you both a blissful married life ahead.",
      badge: "💖 Pure Love",
      date: "Nov 12, 2026"
    }
  ];

  function getStoredWishes() {
    const stored = localStorage.getItem('wedding_guestbook_dilsha_chathuka');
    if (!stored) {
      localStorage.setItem('wedding_guestbook_dilsha_chathuka', JSON.stringify(defaultWishes));
      return defaultWishes;
    }
    try {
      return JSON.parse(stored);
    } catch (e) {
      return defaultWishes;
    }
  }

  function renderWishes() {
    const wishes = getStoredWishes();
    wishesList.innerHTML = wishes.map(wish => `
      <div class="bg-white/90 p-5 rounded-2xl border border-[#c5a267]/20 shadow-xs hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-serif font-semibold text-lg text-[#37432b]">${escapeHtml(wish.name)}</h4>
          <span class="text-xs px-2.5 py-1 rounded-full bg-[#f8f4ea] text-[#51603f] font-medium border border-[#c5a267]/30">${escapeHtml(wish.badge || '🌸 White Flower')}</span>
        </div>
        <p class="text-gray-700 text-sm italic font-sans leading-relaxed mb-3">"${escapeHtml(wish.message)}"</p>
        <span class="text-xs text-[#a6a591] block text-right">${escapeHtml(wish.date)}</span>
      </div>
    `).join('');
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('wish-name');
    const messageInput = document.getElementById('wish-message');
    const badgeSelect = document.getElementById('wish-badge');

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    const badge = badgeSelect ? badgeSelect.value : '🌸 White Rose';

    if (!name || !message) return;

    const newWish = {
      name,
      message,
      badge,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const currentWishes = getStoredWishes();
    currentWishes.unshift(newWish);
    localStorage.setItem('wedding_guestbook_dilsha_chathuka', JSON.stringify(currentWishes));

    nameInput.value = '';
    messageInput.value = '';

    renderWishes();
  });

  renderWishes();
}
