(() => {
  'use strict';
  const API_URL = 'https://script.google.com/macros/s/AKfycby3fR9jZwrq9Asfuy-KgGng9PQZRplLUXqinboHYjh4MjuPWA1fB4O3N0fg-FRj6ccVwQ/exec';
  const modal = document.getElementById('modal');
  const opener = document.getElementById('openModal');
  const closer = document.getElementById('closeModal');
  const form = document.getElementById('confirmForm');
  const nameInput = document.getElementById('guestName');
  const presence = document.getElementById('presenceValue');
  const submit = document.getElementById('submitBtn');
  const status = document.getElementById('sendStatus');
  const choices = Array.from(document.querySelectorAll('.choice-btn'));
  if (!modal || !opener || !form || !submit || !status) return;
  let inFlight = false;
  let pending = null;

  const setStatus = text => { status.textContent = text; status.hidden = !text; };
  const openModal = () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => nameInput.focus(), 30);
  };
  const closeModal = () => {
    if (inFlight) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    opener.focus();
  };
  opener.addEventListener('click', openModal);
  closer.addEventListener('click', closeModal);
  modal.addEventListener('click', event => {
    if (event.target?.dataset?.close === 'true') closeModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
  choices.forEach(button => button.addEventListener('click', () => {
    if (inFlight) return;
    presence.value = button.dataset.choice;
    choices.forEach(choice => {
      const selected = choice === button;
      choice.classList.toggle('active', selected);
      choice.setAttribute('aria-pressed', String(selected));
    });
    pending = null;
  }));
  nameInput.addEventListener('input', () => { nameInput.setCustomValidity(''); pending = null; });

  // O Apps Script não permite ler de forma consistente respostas cross-origin de POST.
  // Por isso enviamos o POST e verificamos o protocolo com GET/JSONP, sem dados pessoais na URL.
  function lookupReceipt(receipt) {
    return new Promise((resolve, reject) => {
      const callbackName = 'raulRsvpCallback_' + receipt.replace(/[^A-Za-z0-9_]/g, '');
      const script = document.createElement('script');
      let settled = false;
      const cleanup = () => {
        delete window[callbackName];
        script.remove();
        clearTimeout(timeout);
      };
      const finish = (err, data) => {
        if (settled) return;
        settled = true;
        cleanup();
        if (err) reject(err); else resolve(data);
      };
      window[callbackName] = data => finish(null, data);
      script.onerror = () => finish(new Error('Falha ao consultar o registro'));
      const timeout = setTimeout(() => finish(new Error('Tempo de consulta excedido')), 5500);
      script.src = API_URL + '?action=status&id=' + encodeURIComponent(receipt) + '&callback=' + callbackName + '&nocache=' + Date.now();
      document.head.appendChild(script);
    });
  }

  async function confirmedOnSheet(receipt) {
    // The POST can take a moment to finish, so poll several times.
    for (let attempt = 0; attempt < 10; attempt++) {
      if (attempt > 0) await new Promise(r => setTimeout(r, 1400));
      try {
        const answer = await lookupReceipt(receipt);
        if (answer && answer.saved === true && answer.id === receipt) return true;
      } catch (e) { /* transient error; retry */ }
    }
    return false;
  }

  function newReceipt() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, n => n.toString(16).padStart(2,'0')).join('');
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (inFlight) return;
    const name = nameInput.value.trim().replace(/\s+/g, ' ');
    if (!name) {
      nameInput.setCustomValidity('Informe seu nome.');
      nameInput.reportValidity();
      nameInput.focus();
      return;
    }
    nameInput.setCustomValidity('');
    if (!['Sim','Não'].includes(presence.value)) { setStatus('Escolha uma resposta.'); return; }
    if (!pending || pending.name !== name || pending.presence !== presence.value) {
      pending = { name, presence: presence.value, id: newReceipt() };
    }
    inFlight = true;
    submit.disabled = true;
    submit.textContent = 'ENVIANDO...';
    setStatus('Registrando sua resposta...');
    try {
      // Google Apps Script pode bloquear leitura CORS da resposta ao POST;
      // mode:no-cors transmite o corpo e a confirmação real vem do protocolo verificado por GET.
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-store',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({nome: pending.name, presenca: pending.presence, id: pending.id})
      });
      const saved = await confirmedOnSheet(pending.id);
      if (!saved) throw new Error('Registro ainda não confirmado');
      sessionStorage.setItem('raul_confirmed_response', JSON.stringify({
        name: pending.name, presence: pending.presence, id: pending.id, saved: true
      }));
      location.assign('confirmacao.html');
    } catch (error) {
      setStatus('Não conseguimos verificar o registro. Confira sua conexão e toque em Enviar resposta novamente.');
    } finally {
      inFlight = false;
      submit.disabled = false;
      submit.textContent = 'ENVIAR RESPOSTA';
    }
  });
})();