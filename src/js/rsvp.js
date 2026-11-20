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
  const calendarBtns = document.querySelectorAll('.calendar-add-btn');

  // Attendance Pills state
  const btnAccept = document.getElementById('btn-rsvp-accept');
  const btnDecline = document.getElementById('btn-rsvp-decline');
  const attendanceInput = document.getElementById('rsvp-attendance');
  const guestCountRow = document.getElementById('guest-count-row');

  // Headcount Stepper
  const guestMinus = document.getElementById('guest-minus');
  const guestPlus = document.getElementById('guest-plus');
  const guestDisplay = document.getElementById('guest-count-display');
  const guestInput = document.getElementById('rsvp-guests');
  let currentGuests = 1;

  if (guestMinus && guestPlus && guestDisplay && guestInput) {
    guestMinus.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentGuests > 1) {
        currentGuests--;
        guestDisplay.textContent = currentGuests;
        guestInput.value = currentGuests;
      }
    });

    guestPlus.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentGuests < 6) {
        currentGuests++;
        guestDisplay.textContent = currentGuests;
        guestInput.value = currentGuests;
      }
    });
  }

  // Toggle Attendance Pills
  if (btnAccept && btnDecline && attendanceInput) {
    btnAccept.addEventListener('click', (e) => {
      e.preventDefault();
      attendanceInput.value = 'yes';
      btnAccept.classList.add('bg-[#5A4D41]', 'text-white', 'border-[#5A4D41]');
      btnAccept.classList.remove('bg-white', 'text-[#5A4D41]');
      btnDecline.classList.remove('bg-[#5A4D41]', 'text-white', 'border-[#5A4D41]');
      btnDecline.classList.add('bg-white', 'text-[#5A4D41]');
      if (guestCountRow) guestCountRow.classList.remove('hidden');
    });

    btnDecline.addEventListener('click', (e) => {
      e.preventDefault();
      attendanceInput.value = 'no';
      btnDecline.classList.add('bg-[#5A4D41]', 'text-white', 'border-[#5A4D41]');
      btnDecline.classList.remove('bg-white', 'text-[#5A4D41]');
      btnAccept.classList.remove('bg-[#5A4D41]', 'text-white', 'border-[#5A4D41]');
      btnAccept.classList.add('bg-white', 'text-[#5A4D41]');
      if (guestCountRow) guestCountRow.classList.add('hidden');
    });
  }

  // Configure Google Calendar Link
  calendarBtns.forEach(btn => {
    const title = encodeURIComponent("Dilsha & Chathuka's Wedding");
    const details = encodeURIComponent("Poruwa Ceremony & Reception. Cinnamon Grand Colombo");
    const location = encodeURIComponent("Cinnamon Grand, Colombo, Sri Lanka");
    const dates = "20261114T050000Z/20261114T120000Z";
    btn.href = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;
  });

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
        <div class="space-y-2 text-left bg-white/90 p-5 rounded-2xl border border-[#A98A4A]/30">
          <p class="font-cinzel text-xl text-[#5A4D41] font-semibold">${escapeHtml(data.name)}</p>
          <p class="text-xs uppercase tracking-widest text-[#A98A4A] font-semibold">
            ${data.attendance === 'yes' ? '✨ Joyfully Accepts' : '💌 Regretfully Declines'} 
            ${data.attendance === 'yes' ? `(${escapeHtml(data.guests || '1')} Guest${data.guests > 1 ? 's' : ''})` : ''}
          </p>
          <p class="text-xs text-[#837769]"><strong>Contact:</strong> ${escapeHtml(data.phone || 'N/A')} • ${escapeHtml(data.email || 'N/A')}</p>
          ${data.dietary ? `<p class="text-xs text-[#5A4D41]"><strong>Dietary:</strong> ${escapeHtml(data.dietary)}</p>` : ''}
          ${data.message ? `<p class="text-xs text-[#5A4D41] italic border-t border-[#A98A4A]/20 pt-2 font-serif-body">"${escapeHtml(data.message)}"</p>` : ''}
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
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send my reply';

    const name = document.getElementById('rsvp-name')?.value.trim();
    const phone = document.getElementById('rsvp-phone')?.value.trim();
    const email = document.getElementById('rsvp-email')?.value.trim();
    const attendance = attendanceInput?.value || 'yes';
    const guests = attendance === 'yes' ? (guestInput?.value || '1') : '0';
    const dietary = document.getElementById('rsvp-dietary')?.value || 'Standard';
    const message = document.getElementById('rsvp-message')?.value.trim() || '';

    if (!name) {
      alert('Please enter your full name');
      return;
    }

    const submission = {
      name,
      phone,
      email,
      attendance,
      guests,
      dietary,
      message,
      submittedAt: new Date().toISOString()
    };

    // UI Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-flex items-center justify-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Sending Reply...
        </span>
      `;
    }

    // 1. Send data to Google Apps Script Webhook
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

    // 2. Save locally
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
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#A98A4A', '#C5A267', '#DFD5C2', '#FFFFFF', '#5A4D41']
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
