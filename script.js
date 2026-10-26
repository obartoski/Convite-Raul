(() => {
  const modal = document.getElementById('modal');
  const opener = document.getElementById('openModal');
  const closer = document.getElementById('closeModal');
  const form = document.getElementById('confirmForm');
  const nameInput = document.getElementById('guestName');
  const presence = document.getElementById('presenceValue');
  const choices = Array.from(document.querySelectorAll('.choice-btn'));
  if (!modal || !opener || !form) return;

  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => nameInput.focus(), 30);
  }
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    opener.focus();
  }
  opener.addEventListener('click', openModal);
  closer.addEventListener('click', closeModal);
  modal.addEventListener('click', event => {
    if (event.target?.dataset?.close === 'true') closeModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
  choices.forEach(button => button.addEventListener('click', () => {
    presence.value = button.dataset.choice;
    choices.forEach(choice => {
      const selected = choice === button;
      choice.classList.toggle('active', selected);
      choice.setAttribute('aria-pressed', String(selected));
    });
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const fullName = nameInput.value.trim().replace(/\s+/g, ' ');
    if (!fullName) {
      nameInput.setCustomValidity('Informe seu nome.');
      nameInput.reportValidity();
      return;
    }
    nameInput.setCustomValidity('');
    // Preview only. This is NOT a real RSVP record. Replace this flow with a
    // server-confirmed response before launching to actual invited guests.
    try {
      sessionStorage.setItem('raul_preview_response', JSON.stringify({
        name: fullName, presence: presence.value, preview: true
      }));
    } catch {
      // Safari private mode and some browsers may block sessionStorage.
      // Encode the same preview state in the URL fragment as fallback.
      location.assign('confirmacao.html#' +
        encodeURIComponent(JSON.stringify({name: fullName, presence: presence.value, preview: true})));
      return;
    }
    location.assign('confirmacao.html');
  });
  nameInput.addEventListener('input', () => nameInput.setCustomValidity(''));
})();
