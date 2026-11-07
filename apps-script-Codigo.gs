/**
 * CONFRA DO TIME — Google Apps Script (cole em Código.gs)
 * Apps Script vinculado à planilha. Cabeçalhos na linha 5; dados a partir da linha 6.
 * Mantenha o nome da aba principal como "Respostas".
 *
 * O endpoint é público para receber convidados: não armazene informações sensíveis
 * aqui. O protocolo garante repetição segura de requisições; não identifica pessoas.
 */
const ABA = 'Respostas';
const CABECALHO = 5;
const PRIMEIRA_LINHA = 6;

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const req = JSON.parse(e.postData.contents || '{}');
    const nome = String(req.nome || '').trim().replace(/\s+/g, ' ');
    const presenca = String(req.presenca || '');
    const id = String(req.id || '');
    if (!nome || nome.length > 90 || !['Sim', 'Não'].includes(presenca) ||
        !/^[a-f0-9-]{32,36}$/i.test(id)) {
      return json_({ok:false, erro:'Dados inválidos'});
    }
    lock.waitLock(25000);
    const sheet = sheet_();
    const cols = columns_(sheet);
    const already = findReceipt_(sheet, cols.protocolo, id);
    if (already) return json_({ok:true});
    const row = firstVacant_(sheet, cols.nome);
    if (row > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), row - sheet.getMaxRows());
    const width = sheet.getLastColumn();
    const data = new Array(width).fill('');
    data[cols.data-1] = new Date();
    data[cols.nome-1] = safeCell_(nome);
    data[cols.presenca-1] = presenca === 'Sim' ? 'Confirmado' : 'Não vai';
    data[cols.pagamento-1] = presenca === 'Sim' ? 'Pendente' : 'Não se aplica';
    data[cols.protocolo-1] = id;
    // Escreve só as colunas utilizadas, preservando observações e outras fórmulas.
    for (const col of [cols.data,cols.nome,cols.presenca,cols.pagamento,cols.protocolo]) {
      sheet.getRange(row,col).setValue(data[col-1]);
    }
    sheet.getRange(row,cols.data).setNumberFormat('dd/MM/yyyy HH:mm');
    SpreadsheetApp.flush();
    return json_({ok:true});
  } catch (err) {
    return json_({ok:false, erro:'Falha ao registrar'});
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  const callback = String(p.callback || '');
  if (p.action !== 'status' || !/^raulRsvpCallback_[A-Za-z0-9_]{1,60}$/.test(callback)) {
    return ContentService.createTextOutput('Consulta inválida').setMimeType(ContentService.MimeType.TEXT);
  }
  const id = String(p.id || '');
  let saved = false;
  if (/^[a-f0-9-]{32,36}$/i.test(id)) {
    try {
      const s = sheet_();
      const c = columns_(s);
      saved = findReceipt_(s,c.protocolo,id);
    } catch (_) {}
  }
  // JSONP retorna apenas existência do protocolo. Nunca envia nome ou outro dado pessoal.
  const content = callback + '(' + JSON.stringify({id:id, saved:saved}) + ');';
  return ContentService.createTextOutput(content).setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function sheet_() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA);
  if (!s) throw new Error('Aba Respostas inexistente');
  return s;
}

function normal_(v) {
  return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
}

function columns_(s) {
  const headers = s.getRange(CABECALHO,1,1,Math.max(s.getLastColumn(),4)).getDisplayValues()[0];
  const index = val => headers.findIndex(x => normal_(x) === val) + 1;
  const cols = {
    data: index('data da resposta'),
    nome: index('nome completo') || index('nome'),
    presenca: index('presenca'),
    pagamento: index('pagamento'),
    protocolo: index('protocolo')
  };
  if (!cols.data || !cols.nome || !cols.presenca || !cols.pagamento) {
    throw new Error('Confira os títulos na linha 5: Data da resposta, Nome completo, Presença, Pagamento');
  }
  if (!cols.protocolo) {
    // Cria uma coluna técnica invisível (não mexe nas colunas editadas por você).
    const c = headers.length+1;
    if (c > s.getMaxColumns()) s.insertColumnAfter(s.getMaxColumns());
    s.getRange(CABECALHO,c).setValue('Protocolo');
    s.hideColumns(c);
    cols.protocolo = c;
  }
  return cols;
}

function findReceipt_(s,col,id) {
  const last = Math.max(s.getLastRow(),PRIMEIRA_LINHA);
  const values = s.getRange(PRIMEIRA_LINHA,col,last-PRIMEIRA_LINHA+1).getDisplayValues();
  return values.some(row => row[0] === id);
}

function firstVacant_(s,col) {
  const last = Math.max(s.getLastRow(),PRIMEIRA_LINHA);
  const values = s.getRange(PRIMEIRA_LINHA,col,last-PRIMEIRA_LINHA+1).getDisplayValues();
  const idx = values.findIndex(row => !String(row[0]).trim());
  return idx >= 0 ? PRIMEIRA_LINHA+idx : last+1;
}

function safeCell_(v) {
  // Não permitir fórmula arbitrária introduzida por convidado.
  return /^[=+@-]/.test(v) ? "'" + v : v;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
