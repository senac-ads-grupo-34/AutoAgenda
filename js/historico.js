// Histórico (RF05): listar as ordens de um cliente ou veículo, da mais recente para a mais antiga.
// Cada linha tem um link para o orçamento: orcamento.html?ordem=<id>

const filtroCliente = document.getElementById('filtro-cliente');
const filtroVeiculo = document.getElementById('filtro-veiculo');
const corpoTabela = document.getElementById('lista');
const avisoListaVazia = document.getElementById('lista-vazia');

filtroCliente.addEventListener('change', aoMudarCliente);
filtroVeiculo.addEventListener('change', mostrarOrdens);

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

function aoMudarCliente() {
  const clienteId = filtroCliente.value;
  preencherFiltroVeiculos(clienteId || null);
  filtroVeiculo.value = '';
  mostrarOrdens();
}

function calcularTotal(itens) {
  if (!Array.isArray(itens)) {
    return 0;
  }
  return itens.reduce((soma, item) => soma + (Number(item.preco) || 0), 0);
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

function exibirPlaca(placa) {
  const limpa = String(placa || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (limpa.length === 7) {
    return limpa.slice(0, 3) + '-' + limpa.slice(3);
  }
  return limpa || '—';
}

function mostrarOrdens() {
  const clienteId = filtroCliente.value;
  const veiculoId = filtroVeiculo.value;

  let ordens = lerTabela('ordens');

  if (clienteId) {
    ordens = ordens.filter((o) => o.clienteId === clienteId);
  }
  if (veiculoId) {
    ordens = ordens.filter((o) => o.veiculoId === veiculoId);
  }

  // Mais recente primeiro
  ordens.sort((a, b) => {
    if (a.data !== b.data) {
      return b.data.localeCompare(a.data);
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
    linkOrcamento.setAttribute('aria-label', 'Ver orçamento da ordem de ' + formatarData(ordem.data));

    celulaAcoes.append(linkOrcamento);

    const total = calcularTotal(ordem.itens);

    linha.append(
      criarCelula(formatarData(ordem.data)),
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
