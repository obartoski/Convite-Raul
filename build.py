from pathlib import Path
import zipfile, shutil, qrcode
from PIL import Image

base=Path('/mnt/data/raul_work')
key='d218854b-8f02-49ba-b81d-e5b543291480'

def emv(t,v): return f'{t}{len(v):02d}{v}'
merchant_account=emv('00','br.gov.bcb.pix')+emv('01',key)
part=''.join([emv('00','01'),emv('26',merchant_account),emv('52','0000'),emv('53','986'),emv('54','89.00'),emv('58','BR'),emv('59','RAUL TOMAZ'),emv('60','GUARULHOS'),emv('62',emv('05','***')),'6304'])
crc=0xffff
for char in part.encode('utf-8'):
    crc ^= char<<8
    for _ in range(8):
        crc=((crc<<1)^0x1021)&0xffff if crc&0x8000 else (crc<<1)&0xffff
code=part+f'{crc:04X}'
(base/'assets/pix-89-reais.png').parent.mkdir(parents=True,exist_ok=True)
qr=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=11,border=4)
qr.add_data(code);qr.make(fit=True)
qr.make_image(fill_color='#4b1823',back_color='#ffffff').convert('RGB').save(base/'assets/pix-89-reais.png',optimize=True)
(base/'pix-copia-e-cola.txt').write_text(code+'\n',encoding='utf-8')

idx=base/'index.html'
s=idx.read_text(encoding='utf-8')
s=s.replace('style.css?v=19','style.css?v=20').replace('script.js?v=19','script.js?v=20')
s=s.replace('<strong class="detail-value">Em breve</strong>','<strong class="detail-value">12h – 17h30</strong>')
old='''        <section class="experience-block">
          <p class="section-kicker">A EXPERIÊNCIA</p>
          <p class="experience-copy">Quadras liberadas <span aria-hidden="true">•</span> Drinks &amp; gastronomia</p>
          <p class="experience-note">Consumação inclusa</p>
          <p class="price-line">Taxa de participação <strong>R$ 89,00 por pessoa</strong></p>
        </section>'''
new='''        <section class="schedule-section" aria-label="Programação da confraternização">
          <p class="section-kicker">PROGRAMAÇÃO</p>
          <div class="schedule">
            <div class="schedule-row"><time>12h</time><span>Início da aula na areia</span></div>
            <div class="schedule-row"><time>13h30</time><span>Abertura do buffet</span></div>
            <div class="schedule-row"><time>17h30</time><span>Encerramento</span></div>
          </div>
          <p class="dress-note">Para a aula na areia, venha com sua <strong>camiseta personalizada.</strong></p>
        </section>

        <section class="experience-block">
          <p class="section-kicker">A EXPERIÊNCIA</p>
          <p class="experience-copy">Quadras liberadas <span aria-hidden="true">•</span> Drinks &amp; gastronomia</p>
          <p class="experience-note">Buffet de espetos à vontade incluso <span class="mid-dot">·</span> Bebidas à parte</p>
          <p class="price-line">Taxa de participação <strong>R$ 89,00 por pessoa</strong></p>
        </section>'''
assert old in s
s=s.replace(old,new)
idx.write_text(s,encoding='utf-8')

conf=base/'confirmacao.html'
s=conf.read_text(encoding='utf-8')
s=s.replace('style.css?v=19','style.css?v=20').replace('confirmacao.js?v=19','confirmacao.js?v=20')
insert='''          <section class="payment-panel" id="paymentPanel" hidden aria-label="Pagamento da participação">
            <div class="payment-divider"></div>
            <p class="section-kicker">PAGAMENTO DA PARTICIPAÇÃO</p>
            <p class="payment-amount">R$ 89,00 <span>/ pessoa</span></p>
            <p class="payment-desc">Escaneie o QR Code com o aplicativo do banco ou copie o código Pix abaixo.</p>
            <div class="qr-paper"><img src="assets/pix-89-reais.png" alt="QR Code Pix no valor de R$ 89,00" width="205" height="205"></div>
            <button class="pix-copy" id="copyPix" type="button">COPIAR PIX COPIA E COLA</button>
            <p class="copy-feedback" id="copyFeedback" role="status" aria-live="polite"></p>
            <p class="pix-key-label">CHAVE PIX ALTERNATIVA</p>
            <button class="key-copy" id="copyKey" type="button">d218854b-8f02-49ba-b81d-e5b543291480</button>
            <p class="payment-disclaimer">Confira o nome do recebedor no aplicativo do banco antes de pagar. O site não identifica nem confirma pagamentos automaticamente.</p>
          </section>
'''
search='''          <a class="response-back" href="index.html">VOLTAR AO CONVITE</a>'''
assert search in s
s=s.replace(search,insert+search)
conf.write_text(s,encoding='utf-8')

js=base/'confirmacao.js'
s=js.read_text(encoding='utf-8')
s=s.replace("  selected.textContent = attending ? 'Estarei presente' : 'Não poderei comparecer';", """  selected.textContent = attending ? 'Estarei presente' : 'Não poderei comparecer';
  if (attending) document.getElementById('paymentPanel').hidden = false;""")
s += '''
// O QR Code e o código de copiar e colar representam o mesmo Pix estático.
// O recebedor e a efetiva liquidação devem ser conferidos no aplicativo bancário.
(() => {
  const pix = '''+repr(code)+''';
  const key = '''+repr(key)+''';
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
'''
js.write_text(s,encoding='utf-8')

css=base/'style.css'
s=css.read_text(encoding='utf-8')
s+='''
/* V14 — programação e informações de consumação */
.schedule-section { position:relative; z-index:2; width:100%; max-width:334px; margin:0 auto 23px; text-align:center; }
.schedule { margin:14px auto 12px; border-top:1px solid rgba(83,31,40,.18); border-bottom:1px solid rgba(83,31,40,.18); padding:5px 0; }
.schedule-row { display:flex; justify-content:space-between; align-items:baseline; gap:14px; padding:10px 3px; font-size:12px; line-height:1.35; }
.schedule-row + .schedule-row { border-top:1px solid rgba(83,31,40,.095); }
.schedule-row time { color:var(--accent); font:600 22px/1 'Cormorant Garamond',serif; white-space:nowrap; }
.schedule-row span { color:var(--ink); text-align:right; }
.dress-note { color:var(--ink-soft); line-height:1.65; font-size:11px; margin:12px auto 0; max-width:300px; }
.dress-note strong { color:var(--ink); font-weight:700; }
.experience-block .experience-note { max-width:295px; margin:7px auto 0; line-height:1.65; font-size:10px; letter-spacing:.035em; text-transform:none; opacity:.78; }
.mid-dot { display:inline-block; padding:0 2px; }

/* V14 — checkout Pix estático para resposta positiva */
.payment-panel { position:relative; z-index:3; width:100%; margin:26px auto 2px; text-align:center; }
.payment-panel[hidden] { display:none!important; }
.payment-divider { height:1px; background:linear-gradient(90deg,transparent,#b59b90,transparent); margin:0 0 25px; }
.payment-amount { margin:9px 0 0; font:600 37px/1 'Cormorant Garamond',serif; color:#75242d; }
.payment-amount span { font:500 11px/1.4 'Manrope',sans-serif; color:#8f6c68; }
.payment-desc { font:400 12px/1.6 'Manrope',sans-serif; color:#765b58; max-width:270px; margin:14px auto 17px; }
.qr-paper { width:fit-content; border:1px solid #d5c4b6; box-shadow:0 5px 15px #4d1b1b20; margin:0 auto 13px; padding:9px; background:white; }
.qr-paper img { display:block; width:190px; height:190px; image-rendering:auto; }
.pix-copy { appearance:none; width:100%; min-height:48px; border:1px solid #75242d; background:#75242d; color:#fff; cursor:pointer; font:700 10px/1.2 'Manrope',sans-serif; letter-spacing:.14em; padding:12px 8px; }
.copy-feedback { color:#6c3e3c; min-height:16px; font:500 10px/1.5 'Manrope',sans-serif; margin:8px 0; }
.pix-key-label { color:#977573; margin:12px 0 5px; font:700 9px/1.3 'Manrope',sans-serif; letter-spacing:.18em; }
.key-copy { background:none; padding:5px 1px; color:#63373b; font:500 10px/1.3 'Manrope',sans-serif; text-decoration:underline; text-underline-offset:3px; border:none; cursor:pointer; overflow-wrap:anywhere; max-width:100%; }
.payment-disclaimer { color:#88716b; font:400 10px/1.65 'Manrope',sans-serif; max-width:293px; margin:15px auto 0; }
.response-back { margin-top:23px!important; }
@media(max-width:360px){.qr-paper img { width:170px; height:170px; }}
'''
css.write_text(s,encoding='utf-8')
readme=base/'README.md'
readme.write_text('''# Convite Raul Tomaz — V14 (programação + Pix)

## Publicação no GitHub Pages
Suba `index.html`, `confirmacao.html`, `style.css`, `script.js`, `confirmacao.js` e todos os arquivos de `assets/` à raiz do repositório, sem alterar os nomes. Configure **Settings > Pages > Deploy from a branch > main > /(root)**.

## Novidades
- 12h: início da aula na areia
- 13h30: abertura do buffet
- 17h30: encerramento
- Camiseta personalizada para participantes da aula na areia
- Buffet de espetos à vontade incluído; bebidas cobradas à parte
- R$ 89,00 por pessoa
- Após selecionar "Estarei presente", uma seção com QR Code Pix estático no valor de R$ 89,00, botão Copiar Pix Copia e Cola e chave Pix alternativa aparece na página de resposta.
- Após "Não poderei", a seção Pix não aparece.

## IMPORTANTE — antes de divulgar
1. **Conferir no banco se a chave Pix é válida e pertence ao recebedor esperado.** O nome no payload do QR é apenas uma etiqueta (RAUL TOMAZ) e não verifica quem é o dono da chave. Abra a cobrança no aplicativo bancário e confira o nome real antes de aprovar.
2. O Pix estático pode ser reutilizado; não possui vencimento próprio, mas deixa de funcionar se a chave for removida ou ficar inválida.
3. O link de pagamento, no sentido de URL de checkout bancário, não pode ser derivado de uma chave Pix sozinha. O botão "Copiar Pix Copia e Cola" é a alternativa nativa para pagamento no celular.
4. **O formulário de presença ainda é uma demonstração e não salva em planilha; o site também não verifica pagamento.** Não trate a confirmação de tela como confirmação de pagamento nem como registro oficial de presença. Integre com backend/Google Sheets antes de uso real.
5. Um QR Pix estático não identifica automaticamente quem pagou; é necessário conferir o extrato/comprovantes ou usar integração bancária.

### Chave informada
`d218854b-8f02-49ba-b81d-e5b543291480`

### Pix Copia e Cola
O mesmo payload do QR está em `pix-copia-e-cola.txt`.
''',encoding='utf-8')

out=Path('/mnt/data/convite-raul-v14-programacao-pix.zip')
with zipfile.ZipFile(out,'w',compression=zipfile.ZIP_DEFLATED) as z:
    for p in sorted(base.rglob('*')):
        if p.is_file() and p.name!='build.py': z.write(p,p.relative_to(base))
print('CREATED',out, 'size',out.stat().st_size,'payload',code)
