// Histórico: consulta as ordens por cliente, veículo ou dia, da mais recente para a mais antiga.
// Completa o RF05, que pede a consulta da agenda por dia.
// Cada linha tem um link para o orçamento: orcamento.html?ordem=<id>

const filtroCliente = document.getElementById('filtro-cliente');
const filtroVeiculo = document.getElementById('filtro-veiculo');
const filtroData = document.getElementById('filtro-data');
const botaoLimparFiltros = document.getElementById('botao-limpar-filtros');
const corpoTabela = document.getElementById('lista');
const avisoListaVazia = document.getElementById('lista-vazia');

filtroCliente.addEventListener('change', aoMudarCliente);
filtroVeiculo.addEventListener('change', mostrarOrdens);
filtroData.addEventListener('change', mostrarOrdens);
botaoLimparFiltros.addEventListener('click', limparFiltros);

// A página inicial abre o histórico já filtrado: historico.html?data=2026-11-20
filtroData.value = new URLSearchParams(location.search).get('data') || '';

preencherFiltroClientes();
preencherFiltroVeiculos();
mostrarOrdens();

function preencherFiltroClientes() {
  const clientes = lerTabela('clientes').sort((a, b) => a.nome.localeCompare(b.nome));

  while (filtroCliente.options.length > 1) {
    filtroCliente.remove(1);
  }

  for (const cliente of clientes) {
    filtroCliente.append(new Option(cliente.nome, cliente.id));
  }
}

function preencherFiltroVeiculos(clienteId) {
  while (filtroVeiculo.options.length > 1) {
    filtroVeiculo.remove(1);
  }

  let veiculos = lerTabela('veiculos');

  if (clienteId) {
    veiculos = veiculos.filter((v) => v.clienteId === clienteId);
  }

  veiculos.sort((a, b) => a.placa.localeCompare(b.placa));

  for (const veiculo of veiculos) {
    const texto = exibirPlaca(veiculo.placa) + ' — ' + veiculo.marca + ' ' + veiculo.modelo;
    filtroVeiculo.append(new Option(texto, veiculo.id));
  }
}

function limparFiltros() {
  filtroCliente.value = '';
  preencherFiltroVeiculos(null);
  filtroVeiculo.value = '';
  filtroData.value = '';
  mostrarOrdens();
}

function aoMudarCliente() {
  const clienteId = filtroCliente.value;
  preencherFiltroVeiculos(clienteId || null);
  filtroVeiculo.value = '';
  mostrarOrdens();
}

function mostrarOrdens() {
  const clienteId = filtroCliente.value;
  const veiculoId = filtroVeiculo.value;
  const data = filtroData.value;

  let ordens = lerTabela('ordens');

  if (clienteId) {
    ordens = ordens.filter((o) => o.clienteId === clienteId);
  }
  if (veiculoId) {
    ordens = ordens.filter((o) => o.veiculoId === veiculoId);
  }
  if (data) {
    ordens = ordens.filter((o) => o.data === data);
  }

  // Mais recente primeiro
  ordens.sort((a, b) => {
    if (a.data !== b.data) {
      return b.data.localeCompare(a.data);
    }
    if (a.hora !== b.hora) {
      return String(b.hora || '').localeCompare(String(a.hora || ''));
    }
    return String(b.id).localeCompare(String(a.id));
  });

  corpoTabela.innerHTML = '';

  for (const ordem of ordens) {
    const linha = document.createElement('tr');
    const celulaAcoes = document.createElement('td');

    const linkOrcamento = document.createElement('a');
    linkOrcamento.href = 'orcamento.html?ordem=' + encodeURIComponent(ordem.id);
    linkOrcamento.textContent = 'Ver orçamento';
    linkOrcamento.className = 'botao botao-pequeno';
    linkOrcamento.setAttribute('aria-label', 'Ver orçamento da ordem de ' + formatarDataHora(ordem.data, ordem.hora));

    celulaAcoes.append(linkOrcamento);

    const total = calcularTotal(ordem.itens);

    linha.append(
      criarCelula(formatarDataHora(ordem.data, ordem.hora)),
      criarCelula(nomeDoCliente(ordem.clienteId)),
      criarCelula(descricaoDoVeiculo(ordem.veiculoId)),
      criarCelula(ordem.situacao || '—'),
      criarCelula(formatarDinheiro(total)),
      celulaAcoes,
    );
    corpoTabela.append(linha);
  }

  avisoListaVazia.hidden = ordens.length > 0;
}
