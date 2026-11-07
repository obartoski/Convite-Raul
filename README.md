# Convite Raul Tomaz — V14 (programação + Pix)

## Publicação no GitHub Pages
Suba `index.html`, `confirmacao.html`, `style.css`, `script.js`, `confirmacao.js` e todos os arquivos de `assets/` à raiz do repositório, sem alterar os nomes. Configure **Settings > Pages > Deploy from a branch > main > /(root)**.

## Novidades
- 12h: início da aula na areia
- 13h30: abertura do buffet
- 17h30: encerramento
- Camiseta do Time Raul Tomaz para participantes da aula na areia
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

## Alterações da V15
- Identidade em português: Raul Tomaz apresenta; Confraternização do Time; Data, Hora e Localização.
- Aviso da camiseta atualizado para Time Raul Tomaz.
- Removida a seta no botão Enviar resposta e a linha sob o selo na tela final.
- Botão Pix Copia e Cola continua sendo uma cópia do código estático salvo em `pix-copia-e-cola.txt`.

### Como gerar um código Pix Copia e Cola próprio pelo banco
No aplicativo da conta que receberá os pagamentos: Pix > Receber > QR Code estático > informar valor 89,00 > Gerar. Salvar QR e copiar o código Pix Copia e Cola correspondente. O recebedor deve conferir o nome da conta e o valor em um aplicativo bancário antes de divulgar. O site não confirma o recebimento automaticamente.


## Ajustes da V16
- nome do evento alterado para `CONFRA DO TIME`
- orientação da camisa em duas linhas com destaque para `Camisa do time Raul Tomaz`
- bloco centralizado
