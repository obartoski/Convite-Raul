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
  if (!data || data.preview !== true || typeof data.name !== 'string' ||
      !['Sim', 'Não'].includes(data.presence)) {
    document.getElementById('responseStatus').textContent = 'CONVITE RAUL TOMAZ';
    document.getElementById('responseTitle').textContent = 'Seu convite está aqui.';
    document.getElementById('responseDescription').textContent =
      'Para visualizar uma resposta, volte ao convite e preencha o formulário de demonstração.';
    document.getElementById('previewWarning').textContent =
      'Nenhuma resposta de teste foi encontrada nesta sessão.';
    return;
  }
  const firstName = data.name.trim().split(/\s+/)[0].slice(0, 50);
  const attending = data.presence === 'Sim';
  document.getElementById('responseTitle').textContent =
    attending ? `Perfeito, ${firstName}!` : `Tudo certo, ${firstName}.`;
  document.getElementById('responseStatus').textContent =
    attending ? 'PRESENÇA SELECIONADA' : 'AUSÊNCIA SELECIONADA';
  document.getElementById('responseDescription').textContent = attending
    ? 'Sua escolha foi recebida nesta demonstração. No convite definitivo, esta será a tela exibida após o registro da presença.'
    : 'Sua escolha foi recebida nesta demonstração. No convite definitivo, esta será a tela exibida após o registro da resposta.';
  document.getElementById('responseSummary').hidden = false;
  document.getElementById('responseSelected').textContent =
    attending ? 'Estarei presente' : 'Não poderei comparecer';
})();
