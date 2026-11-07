# Raul Tomaz — V17 (integração de presenças com Google Sheets)

## 1. Atualize o Google Apps Script
Abra sua planilha Google Sheets > **Extensões > Apps Script**. Substitua o conteúdo do arquivo `Código.gs` por **todo** o código de `apps-script-Codigo.gs` e salve.

## 2. Atualize a implantação EXISTENTE
No Apps Script vá em **Implantar > Gerenciar implantações > ícone lápis**.
Em **Versão**, selecione **Nova versão** e clique em **Implantar**.
**Não basta salvar o código:** a implantação continua na versão antiga até você atualizá-la.
Mantenha **Executar como: Eu** e **Quem pode acessar: Qualquer pessoa**. Confira se a URL `/exec` continua a mesma.

## 3. Publique o convite atualizado
Envie para o GitHub Pages os arquivos `index.html`, `confirmacao.html`, `style.css`, `script.js`, `confirmacao.js` e a pasta `assets/`.
A URL do Apps Script está configurada no início de `script.js`:
https://script.google.com/macros/s/AKfycby3fR9jZwrq9Asfuy-KgGng9PQZRplLUXqinboHYjh4MjuPWA1fB4O3N0fg-FRj6ccVwQ/exec

## 4. Teste real (sem pagar nada)
Abra o site, informe o nome `TESTE INTEGRACAO` e clique em **Estarei presente > Enviar resposta**.
Confirme na aba **Respostas**: data/hora, nome, Confirmado, Pendente. Somente se o script verificar que existe registro o site abrirá `confirmacao.html`.
Depois tente `TESTE RECUSA` com **Não poderei**; deve constar `Não vai` e `Não se aplica`, sem mostrar o Pix.
Depois dos testes, apague as duas linhas de teste da planilha (não apague os cabeçalhos da linha 5).

## Como o sistema funciona
O POST ao Apps Script é enviado pelo navegador. Como respostas POST do Apps Script podem ser bloqueadas por CORS, o site consulta um identificador aleatório de registro via JSONP até confirmar a existência na planilha. Caso não consiga verificar, mostra um erro e mantém o formulário aberto. Tentar novamente com os mesmos dados reutiliza o identificador, evitando duplicar o mesmo envio.

A aba `Respostas` deve conservar os títulos **na linha 5**: `Data da resposta`, `Nome completo`, `Presença`, `Pagamento`. As colunas de valor retiradas **não fazem falta**. O script cria a coluna técnica oculta `Protocolo` para confirmar envios e evitar duplicações por tentativa repetida. O status de pagamento é **manual**. As abas `Confirmados` e `Não vão` continuam utilizando as fórmulas que já existiam.

**Atenção:** o endereço Apps Script com acesso público aceita envios de qualquer pessoa que conheça a URL, não é uma solução autenticada nem proteção contra abuso. Para mais segurança, pode ser necessário CAPTCHA ou um backend autenticado. Não envie dados sensíveis. Os nomes já são dados pessoais: divulgue o link apenas aos convidados e restrinja a planilha às pessoas responsáveis. O pagamento Pix não é verificado automaticamente. **Valide a chave Pix e o valor no aplicativo bancário antes de publicar.**
