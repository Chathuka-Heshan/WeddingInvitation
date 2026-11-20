import confetti from 'canvas-confetti';
import { CONFIG } from '../config.js';

export function initRSVPForm() {
  const form = document.getElementById('rsvp-form');
  const successModal = document.getElementById('rsvp-modal');
  const closeModalBtn = document.getElementById('close-rsvp-modal');
  const modalGuestName = document.getElementById('modal-guest-name');
  const rsvpSavedCard = document.getElementById('rsvp-saved-card');
  const savedGuestDetails = document.getElementById('saved-guest-details');
  const editRsvpBtn = document.getElementById('edit-rsvp-btn');
  const calendarBtn = document.getElementById('google-calendar-btn');

  // Configure Google Calendar Link
  if (calendarBtn) {
    const title = encodeURIComponent("Dilsha & Chathuka's Wedding");
    const details = encodeURIComponent("We are overjoyed to celebrate our wedding day with you! Venue: Cinnamon Grand Colombo / Grand Ballroom");
    const location = encodeURIComponent("Cinnamon Grand, Colombo, Sri Lanka");
    const dates = "20261114T113000Z/20261114T183000Z";
    calendarBtn.href = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;
  }

  if (!form) return;

  // Check if RSVP is already saved in localStorage
  const savedRSVP = localStorage.getItem('wedding_rsvp_dilsha_chathuka');
  if (savedRSVP) {
    try {
      const data = JSON.parse(savedRSVP);
      showSavedState(data);
    } catch (e) {
      console.warn('Error reading saved RSVP', e);
    }
  }

  function showSavedState(data) {
    if (form) form.classList.add('hidden');
    if (rsvpSavedCard) rsvpSavedCard.classList.remove('hidden');
    if (savedGuestDetails) {
      savedGuestDetails.innerHTML = `
        <div class="space-y-2 text-left bg-white p-4 rounded-xl border border-rose-100">
          <p class="font-serif text-xl font-bold text-[#37432b]">${escapeHtml(data.name)}</p>
          <p class="text-sm text-gray-600"><strong>Status:</strong> ${data.attendance === 'yes' ? '✨ Joyfully Attending' : '💌 Regretfully Declining'} (${escapeHtml(data.guests || '1')} Guest${data.guests > 1 ? 's' : ''})</p>
          <p class="text-xs text-gray-500"><strong>Contact:</strong> ${escapeHtml(data.phone || 'N/A')} • ${escapeHtml(data.email || 'N/A')}</p>
          ${data.dietary ? `<p class="text-xs text-[#51603f]"><strong>Dietary:</strong> ${escapeHtml(data.dietary)}</p>` : ''}
          ${data.alcohol ? `<p class="text-xs text-[#51603f]"><strong>Alcohol:</strong> ${data.alcohol === 'yes' ? 'Yes' : 'No'}</p>` : ''}
          ${data.message ? `<p class="text-xs text-gray-600 italic border-t border-gray-100 pt-2">"${escapeHtml(data.message)}"</p>` : ''}
        </div>
      `;
    }
  }

  if (editRsvpBtn) {
    editRsvpBtn.addEventListener('click', () => {
      if (rsvpSavedCard) rsvpSavedCard.classList.add('hidden');
      if (form) form.classList.remove('hidden');
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send RSVP with Love';

    const name = document.getElementById('rsvp-name')?.value.trim();
    const email = document.getElementById('rsvp-email')?.value.trim();
    const phone = document.getElementById('rsvp-phone')?.value.trim();
    const attendance = document.querySelector('select[name="attendance"]')?.value || 'yes';
    const guests = document.getElementById('rsvp-guests')?.value || '1';
    const dietary = document.getElementById('rsvp-dietary')?.value || 'Standard';
    const alcohol = document.getElementById('rsvp-alcohol')?.value || 'yes';
    const message = document.getElementById('rsvp-message')?.value.trim() || '';

    if (!name) {
      alert('Please enter your full name');
      return;
    }

    const submission = {
      name,
      email,
      phone,
      attendance,
      guests,
      dietary,
      alcohol,
      message,
      submittedAt: new Date().toISOString()
    };

    // UI: Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-flex items-center justify-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Recording RSVP...
        </span>
      `;
    }

    // 1. Send data to Google Sheets via Apps Script Webhook
    if (CONFIG.GOOGLE_SCRIPT_URL && CONFIG.GOOGLE_SCRIPT_URL.trim() !== '') {
      try {
        await fetch(CONFIG.GOOGLE_SCRIPT_URL.trim(), {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(submission)
        });
      } catch (err) {
        console.warn('Network issue submitting to Google Sheets:', err);
      }
    }

    // 2. Save submission locally in browser storage
    localStorage.setItem('wedding_rsvp_dilsha_chathuka', JSON.stringify(submission));

    // 3. Reset button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }

    // 4. Show success modal & confetti
    if (modalGuestName) modalGuestName.textContent = name;
    if (successModal) successModal.classList.remove('hidden');

    if (attendance === 'yes') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F472B6', '#51603F', '#FFFFFF', '#37432B']
      });
    }

    showSavedState(submission);
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (successModal) successModal.classList.add('hidden');
    });
  }
}

function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
