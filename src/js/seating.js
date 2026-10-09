// Find Your Seat - Interactive Wedding Seating Chart

const guestDatabase = [
  { name: "Dilsha Fernando", table: "Table 01 — Royal Bloom (Bridal Table)", seat: "Bride", companions: "Chathuka (Groom), Entourage" },
  { name: "Chathuka Wickramasinghe", table: "Table 01 — Royal Bloom (Bridal Table)", seat: "Groom", companions: "Dilsha (Bride), Entourage" },
  { name: "Kasun Silva", table: "Table 02 — Golden Jasmine", seat: "Seat 3", companions: "Nadeesha Perera" },
  { name: "Nadeesha Perera", table: "Table 02 — Golden Jasmine", seat: "Seat 4", companions: "Kasun Silva" },
  { name: "Saman Kumara", table: "Table 03 — Ivory Orchids", seat: "Seat 1", companions: "Malkanthi Kumara" },
  { name: "Malkanthi Kumara", table: "Table 03 — Ivory Orchids", seat: "Seat 2", companions: "Saman Kumara" },
  { name: "Dinendra Jayawardena", table: "Table 04 — White Peonies", seat: "Seat 5", companions: "Oshini Jayawardena" },
  { name: "Oshini Jayawardena", table: "Table 04 — White Peonies", seat: "Seat 6", companions: "Dinendra Jayawardena" },
  { name: "Ramesh Perera", table: "Table 05 — Lotus Haven", seat: "Seat 2", companions: "Anoma Perera, Ruwan Perera" },
  { name: "Dr. Rohana Wijesinghe", table: "Table 06 — Emerald Garden", seat: "Seat 1", companions: "Mrs. Wijesinghe" },
  { name: "Tharindu Bandara", table: "Table 07 — Champagne Sunset", seat: "Seat 4", companions: "Senuri Bandara" },
  { name: "Hiruni Senanayake", table: "Table 08 — Starlight Pavilion", seat: "Seat 3", companions: "Gayan Senanayake" },
  { name: "Namal Perera", table: "Table 09 — Blossom Grove", seat: "Seat 2", companions: "Kavindi Perera" },
  { name: "John Smith", table: "Table 10 — Crystal Terrace", seat: "Seat 1", companions: "Sarah Smith" }
];

export function initSeatingFinder() {
  const form = document.getElementById('seating-search-form');
  const input = document.getElementById('seating-search-input');
  const resultsContainer = document.getElementById('seating-result-card');

  if (!form || !input || !resultsContainer) return;

  function performSearch() {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      resultsContainer.classList.add('hidden');
      return;
    }

    const matches = guestDatabase.filter(guest => 
      guest.name.toLowerCase().includes(query) ||
      guest.table.toLowerCase().includes(query) ||
      guest.companions.toLowerCase().includes(query)
    );

    resultsContainer.classList.remove('hidden');

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="p-6 bg-rose-50/70 border border-rose-200 rounded-2xl text-center">
          <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3">
            <span class="text-xl">🔍</span>
          </div>
          <p class="font-serif text-lg text-rose-900 font-semibold">No seating record found for "${escapeHtml(input.value)}"</p>
          <p class="text-sm text-gray-600 mt-1">Please check the spelling or ask our reception host at the entrance for assistance.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matches.map(match => `
      <div class="p-6 bg-white/95 border border-[#c5a267]/40 shadow-lg rounded-2xl text-center relative overflow-hidden mb-3 animate-fade-in">
        <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#c5a267] via-[#f7d98c] to-[#c5a267]"></div>
        <div class="inline-block px-3 py-1 bg-[#37432b]/10 text-[#37432b] rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
          Reserved Guest
        </div>
        <h4 class="font-serif text-2xl font-bold text-[#37432b] mb-1">${escapeHtml(match.name)}</h4>
        <div class="my-4 py-3 bg-[#FAF8F5] rounded-xl border border-[#e0d8cb]/50">
          <span class="text-xs text-[#8a7ea8] uppercase tracking-widest font-semibold block">Assigned Table</span>
          <span class="font-serif text-2xl text-[#c5a267] font-bold block mt-1">${escapeHtml(match.table)}</span>
          <span class="text-xs text-gray-500 mt-1 block">Location: ${escapeHtml(match.seat)}</span>
        </div>
        ${match.companions ? `<p class="text-xs text-gray-600 italic">With: ${escapeHtml(match.companions)}</p>` : ''}
      </div>
    `).join('');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    performSearch();
  });

  input.addEventListener('input', () => {
    if (input.value.trim().length >= 2) {
      performSearch();
    } else if (input.value.trim().length === 0) {
      resultsContainer.classList.add('hidden');
    }
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
