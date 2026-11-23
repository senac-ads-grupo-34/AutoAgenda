// Funções usadas por mais de uma página. Carregue este arquivo antes do arquivo da página.

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
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Data de hoje no formato do <input type="date">, ex.: '2026-11-20'.
// Usa o horário local; o toISOString() usa o de Londres e vira o dia depois das 21h.
function dataDeHoje() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return agora.getFullYear() + '-' + mes + '-' + dia;
}

// '2026-11-20' -> '20/11/2026'
function formatarData(dataDoCampo) {
  const [ano, mes, dia] = dataDoCampo.split('-');
  return dia + '/' + mes + '/' + ano;
}

// '2026-11-20' e '14:30' -> '20/11/2026 às 14:30'
function formatarDataHora(dataDoCampo, hora) {
  if (!hora) {
    return formatarData(dataDoCampo);
  }
  return formatarData(dataDoCampo) + ' às ' + hora;
}

// 90 -> '1h30'
function formatarDuracao(minutos) {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;

  if (horas === 0) {
    return minutos + ' min';
  }
  if (resto === 0) {
    return horas + 'h';
  }
  return horas + 'h' + String(resto).padStart(2, '0');
}

// 'abc-1234' -> 'ABC1234'
function padronizarPlaca(placa) {
  return String(placa || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// 'ABC1234' -> 'ABC-1234' (placa Mercosul fica igual: 'BRA2E19')
function exibirPlaca(placa) {
  const limpa = padronizarPlaca(placa);
  const ehPlacaAntiga = /^[A-Z]{3}[0-9]{4}$/.test(limpa);

  if (ehPlacaAntiga) {
    return limpa.slice(0, 3) + '-' + limpa.slice(3);
  }
  return limpa || '—';
}

function nomeDoCliente(clienteId) {
  const cliente = buscarPorId('clientes', clienteId);
  return cliente ? cliente.nome : '(cliente não encontrado)';
}

function descricaoDoVeiculo(veiculoId) {
  const veiculo = buscarPorId('veiculos', veiculoId);

  if (!veiculo) {
    return '(veículo não encontrado)';
  }
  return exibirPlaca(veiculo.placa) + ' — ' + veiculo.marca + ' ' + veiculo.modelo;
}

// Soma o preço dos serviços de uma ordem.
function calcularTotal(itens) {
  if (!Array.isArray(itens)) {
    return 0;
  }
  return itens.reduce((soma, item) => soma + (Number(item.preco) || 0), 0);
}
