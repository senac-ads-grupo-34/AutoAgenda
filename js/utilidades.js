function mostrarMensagem(texto, tipo = 'sucesso') {
  const mensagem = document.getElementById('mensagem');
  mensagem.textContent = texto;
  mensagem.className = 'mensagem mensagem-' + tipo;
}

// textContent (e não innerHTML) impede que um texto digitado vire código HTML.
function criarCelula(texto) {
  const celula = document.createElement('td');
  celula.textContent = texto;
  return celula;
}

function criarBotao(texto, descricao, aoClicar) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.textContent = texto;
  botao.className = 'botao botao-pequeno';
  botao.setAttribute('aria-label', descricao);
  botao.addEventListener('click', aoClicar);
  return botao;
}

// 150.5 -> 'R$ 150,50'
function formatarDinheiro(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return '—';
  }

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// '2026-11-20' -> '20/11/2026'
function formatarData(dataDoCampo) {
  const [ano, mes, dia] = dataDoCampo.split('-');
  return dia + '/' + mes + '/' + ano;
}
