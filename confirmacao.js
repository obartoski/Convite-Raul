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
  if (!data || data.preview !== true || typeof data.name !== 'string' || !['Sim', 'Não'].includes(data.presence)) {
    status.textContent = 'CONVITE RAUL TOMAZ';
    title.textContent = 'Seu convite está aqui.';
    return;
  }
  const firstName = data.name.trim().split(/\s+/)[0].slice(0, 50);
  const attending = data.presence === 'Sim';
  title.textContent = attending ? `Perfeito, ${firstName}!` : `Tudo certo, ${firstName}.`;
  status.textContent = attending ? 'PRESENÇA SELECIONADA' : 'AUSÊNCIA SELECIONADA';
  summary.hidden = false;
  selected.textContent = attending ? 'Estarei presente' : 'Não poderei comparecer';
})();
