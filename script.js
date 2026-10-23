'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const openButton = document.getElementById('open');
  const closeButton = document.getElementById('close');
  const finishButton = document.getElementById('finish');
  const form = document.getElementById('rsvp');
  const nameInput = document.getElementById('name');
  const presenceInput = document.getElementById('presence');
  const formWrap = document.getElementById('formwrap');
  const success = document.getElementById('success');
  const successTitle = document.getElementById('successTitle');

  const openModal = () => {
    formWrap.style.display = 'block';
    success.style.display = 'none';
    modal.classList.add('open');
    nameInput.focus();
  };
  const closeModal = () => {
    modal.classList.remove('open');
    openButton.focus();
  };

  openButton.addEventListener('click', openModal);
  closeButton.addEventListener('click', closeModal);
  finishButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  document.querySelectorAll('[data-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-choice]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      presenceInput.value = button.dataset.choice;
    });
  });

  // Submissão de demonstração: não registra dados nem faz pagamento.
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.focus();
      return;
    }
    const firstName = name.split(/\s+/)[0];
    successTitle.textContent = presenceInput.value === 'Sim'
      ? `Perfeito, ${firstName}!`
      : `Tudo certo, ${firstName}.`;
    formWrap.style.display = 'none';
    success.style.display = 'block';
  });
});
