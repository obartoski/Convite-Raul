(() => {
  let data = null;
  try {
    const stored = sessionStorage.getItem('raul_preview_response');
    if (stored) data = JSON.parse(stored);
  } catch {}
  if (!data && location.hash.length > 1) {
    try { data = JSON.parse(decodeURIComponent(location.hash.slice(1))); } catch {}
    history.replaceState(null, '', location.pathname + location.search);
  }
  const status = document.getElementById('responseStatus');
  const title = document.getElementById('responseTitle');
  const summary = document.getElementById('responseSummary');
  const selected = document.getElementById('responseSelected');
  const message = document.getElementById('responseMessage');
  if (!data || data.preview !== true || typeof data.name !== 'string' || !['Sim', 'Não'].includes(data.presence)) {
    status.textContent = 'CONVITE RAUL TOMAZ';
    title.textContent = 'Seu convite está aqui.';
    return;
  }
  const firstName = data.name.trim().split(/\s+/)[0].slice(0, 50);
  const attending = data.presence === 'Sim';
  title.textContent = attending ? `Perfeito, ${firstName}!` : `Tudo certo, ${firstName}.`;
  status.textContent = attending ? 'PRESENÇA SELECIONADA' : 'AUSÊNCIA SELECIONADA';
  message.textContent = attending
    ? 'Vai ser um prazer ter você com a gente!'
    : 'Que pena! Esperamos te encontrar na próxima.';
  message.hidden = false;
  summary.hidden = false;
  selected.textContent = attending ? 'Estarei presente' : 'Não poderei comparecer';
  if (attending) document.getElementById('paymentPanel').hidden = false;
})();

// O QR Code e o código de copiar e colar representam o mesmo Pix estático.
// O recebedor e a efetiva liquidação devem ser conferidos no aplicativo bancário.
(() => {
  const pix = '00020126580014br.gov.bcb.pix0136d218854b-8f02-49ba-b81d-e5b543291480520400005303986540589.005802BR5910RAUL TOMAZ6009GUARULHOS62070503***6304283C';
  const key = 'd218854b-8f02-49ba-b81d-e5b543291480';
  async function copy(value, feedback) {
    try {
      await navigator.clipboard.writeText(value);
      feedback.textContent = 'Copiado! Abra o aplicativo do banco para pagar.';
    } catch {
      const field = document.createElement('textarea');
      field.value = value;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed'; field.style.opacity = '0';
      document.body.appendChild(field); field.select();
      const ok = document.execCommand('copy');
      field.remove();
      feedback.textContent = ok ? 'Copiado! Abra o aplicativo do banco para pagar.' : 'Não foi possível copiar automaticamente.';
    }
  }
  const copyPix = document.getElementById('copyPix');
  const copyKey = document.getElementById('copyKey');
  const feedback = document.getElementById('copyFeedback');
  if (copyPix && copyKey && feedback) {
    copyPix.addEventListener('click', () => copy(pix, feedback));
    copyKey.addEventListener('click', () => copy(key, feedback));
  }
})();
