
(function () {
  const modal = document.getElementById('modal');
  const openModalBtn = document.getElementById('openModal');
  const closeModalBtn = document.getElementById('closeModal');
  const finishBtn = document.getElementById('finishBtn');
  const form = document.getElementById('confirmForm');
  const guestNameInput = document.getElementById('guestName');
  const successTitle = document.getElementById('successTitle');
  const formState = document.getElementById('formState');
  const successState = document.getElementById('successState');
  const presenceValue = document.getElementById('presenceValue');
  const choiceButtons = Array.from(document.querySelectorAll('.choice-btn'));

  if (!modal || !openModalBtn || !form) return;

  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    formState.hidden = false;
    successState.hidden = true;
    setTimeout(() => guestNameInput.focus(), 50);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    setTimeout(() => openModalBtn.focus(), 50);
  }

  function setChoice(value) {
    presenceValue.value = value;
    choiceButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.choice === value);
    });
  }

  openModalBtn.addEventListener('click', openModal);
  document.getElementById('sealOpen')?.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  finishBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.close === 'true') {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  choiceButtons.forEach((button) => {
    button.addEventListener('click', () => setChoice(button.dataset.choice || 'Sim'));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const rawName = guestNameInput.value.trim();

    if (!rawName) {
      guestNameInput.focus();
      guestNameInput.reportValidity?.();
      return;
    }

    const firstName = rawName.split(/\s+/)[0];
    successTitle.textContent = presenceValue.value === 'Sim'
      ? `Perfeito, ${firstName}!`
      : `Tudo certo, ${firstName}.`;

    formState.hidden = true;
    successState.hidden = false;
  });
})();
