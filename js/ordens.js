// Ordens de serviço (RF04 e RF06): agendar, listar, editar, excluir e mudar a situação.
// Ao escolher o cliente, o select de veículos mostra só os veículos dele.
// Parte do RF05: não deixa abrir duas ordens no mesmo dia e horário.
//
// Tabela 'ordens': { id, clienteId, veiculoId, data, hora, situacao, itens }
// data: valor do <input type="date">. Ex.: '2026-11-20'
// hora: valor do <input type="time">. Ex.: '14:30'
// situacao: 'Aberta', 'Em andamento', 'Concluída' ou 'Cancelada'
// itens: cópia dos serviços escolhidos. Ex.: [{ servicoId, nome: 'Troca de óleo', preco: 120 }]

const formulario = document.getElementById('formulario');
const camposOrdem = document.getElementById('campos-ordem');
const campoId = document.getElementById('ordem-id');
const campoCliente = document.getElementById('ordem-cliente');
const campoVeiculo = document.getElementById('ordem-veiculo');
const campoData = document.getElementById('ordem-data');
const campoHora = document.getElementById('ordem-hora');
const campoSituacao = document.getElementById('ordem-situacao');
const selectServico = document.getElementById('select-servico');
const botaoAdicionarServico = document.getElementById('botao-adicionar-servico');
const listaItens = document.getElementById('lista-itens');
const totalItens = document.getElementById('total-itens');
const tituloFormulario = document.getElementById('titulo-formulario');
const botaoSalvar = document.getElementById('botao-salvar');
const botaoCancelar = document.getElementById('botao-cancelar');
const campoPesquisa = document.getElementById('pesquisa');
const corpoTabela = document.getElementById('lista');
const avisoListaVazia = document.getElementById('lista-vazia');
const avisoSemClientes = document.getElementById('aviso-sem-clientes');
const avisoSemServicos = document.getElementById('aviso-sem-servicos');
const linhaAdicionarServico = document.getElementById('linha-adicionar-servico');

/** Itens selecionados na ordem atual (cópia dos serviços) */
let itensDaOrdem = [];

formulario.addEventListener('submit', salvarOrdem);
botaoCancelar.addEventListener('click', limparFormulario);
campoCliente.addEventListener('change', aoMudarCliente);
botaoAdicionarServico.addEventListener('click', adicionarServico);
campoPesquisa.addEventListener('input', mostrarOrdens);

// Data padrão = hoje, horário padrão = 08:00
campoData.value = dataDeHoje();
campoHora.value = '08:00';

preencherListaDeClientes();
preencherListaDeServicos();
mostrarOrdens();
atualizarEstadoFormulario();

function preencherListaDeClientes() {
  const clientes = lerTabela('clientes').sort((a, b) => a.nome.localeCompare(b.nome));

  while (campoCliente.options.length > 1) {
    campoCliente.remove(1);
  }

  for (const cliente of clientes) {
    campoCliente.append(new Option(cliente.nome, cliente.id));
  }

  avisoSemClientes.hidden = clientes.length > 0;
  camposOrdem.disabled = clientes.length === 0;
}

function preencherListaDeVeiculos(clienteId) {
  while (campoVeiculo.options.length > 1) {
    campoVeiculo.remove(1);
  }

  if (!clienteId) {
    return;
  }

  const veiculos = lerTabela('veiculos')
    .filter((v) => v.clienteId === clienteId)
    .sort((a, b) => a.placa.localeCompare(b.placa));

  for (const veiculo of veiculos) {
    const texto = exibirPlaca(veiculo.placa) + ' — ' + veiculo.marca + ' ' + veiculo.modelo;
    campoVeiculo.append(new Option(texto, veiculo.id));
  }
}

function preencherListaDeServicos() {
  const servicos = lerTabela('servicos').sort((a, b) => a.nome.localeCompare(b.nome));

  while (selectServico.options.length > 1) {
    selectServico.remove(1);
  }

  for (const servico of servicos) {
    const texto = servico.nome + ' (' + formatarDinheiro(Number(servico.preco) || 0) + ')';
    selectServico.append(new Option(texto, servico.id));
  }

  const temServicos = servicos.length > 0;
  avisoSemServicos.hidden = temServicos;
  linhaAdicionarServico.hidden = !temServicos;
}

function aoMudarCliente() {
  const clienteId = campoCliente.value;
  preencherListaDeVeiculos(clienteId);
  campoVeiculo.value = '';
}

function adicionarServico() {
  const servicoId = selectServico.value;
  if (!servicoId) {
    mostrarMensagem('Selecione um serviço para adicionar.', 'erro');
    selectServico.focus();
    return;
  }

  // Evita duplicar o mesmo serviço
  if (itensDaOrdem.some((item) => item.servicoId === servicoId)) {
    mostrarMensagem('Este serviço já foi adicionado à ordem.', 'erro');
    return;
  }

  const servico = buscarPorId('servicos', servicoId);
  if (!servico) {
    mostrarMensagem('Serviço não encontrado.', 'erro');
    return;
  }

  itensDaOrdem.push({
    servicoId: servico.id,
    nome: servico.nome,
    preco: Number(servico.preco) || 0,
  });

  selectServico.value = '';
  renderizarItens();
}

function removerItem(indice) {
  itensDaOrdem.splice(indice, 1);
  renderizarItens();
}

function renderizarItens() {
  listaItens.innerHTML = '';

  if (itensDaOrdem.length === 0) {
    totalItens.hidden = true;
    return;
  }

  let total = 0;

  itensDaOrdem.forEach((item, indice) => {
    total += item.preco;

    const li = document.createElement('li');
    const nome = document.createElement('span');
    nome.textContent = item.nome;

    const preco = document.createElement('span');
    preco.className = 'preco';
    preco.textContent = formatarDinheiro(item.preco);

    const botaoRemover = criarBotao('Remover', 'Remover ' + item.nome, () => removerItem(indice));

    li.append(nome, preco, botaoRemover);
    listaItens.append(li);
  });

  totalItens.hidden = false;
  totalItens.textContent = 'Total dos serviços: ' + formatarDinheiro(total);
}

function salvarOrdem(evento) {
  evento.preventDefault();

  const ordem = {
    id: campoId.value,
    clienteId: campoCliente.value,
    veiculoId: campoVeiculo.value,
    data: campoData.value,
    hora: campoHora.value,
    situacao: campoSituacao.value,
    itens: itensDaOrdem.map((item) => ({ ...item })),
  };

  if (!ordem.clienteId) {
    mostrarMensagem('Selecione o cliente.', 'erro');
    campoCliente.focus();
    return;
  }

  if (!ordem.veiculoId) {
    mostrarMensagem('Selecione o veículo.', 'erro');
    campoVeiculo.focus();
    return;
  }

  if (!ordem.data) {
    mostrarMensagem('Informe a data.', 'erro');
    campoData.focus();
    return;
  }

  if (!ordem.hora) {
    mostrarMensagem('Informe o horário.', 'erro');
    campoHora.focus();
    return;
  }

  const ordens = lerTabela('ordens');

  // RF05: a oficina atende uma ordem por vez. Ordem cancelada não ocupa o horário.
  const horarioOcupado = ordens.some((item) =>
    item.data === ordem.data &&
    item.hora === ordem.hora &&
    item.id !== ordem.id &&
    item.situacao !== 'Cancelada');

  if (horarioOcupado) {
    mostrarMensagem('Já existe uma ordem marcada para ' + formatarDataHora(ordem.data, ordem.hora) + '.', 'erro');
    campoHora.focus();
    return;
  }

  if (ordem.id === '') {
    ordem.id = gerarId();
    ordens.push(ordem);
    mostrarMensagem('Ordem de serviço aberta com sucesso.');
  } else {
    const posicao = ordens.findIndex((item) => item.id === ordem.id);
    if (posicao === -1) {
      mostrarMensagem('Ordem não encontrada para edição.', 'erro');
      return;
    }
    ordens[posicao] = ordem;
    mostrarMensagem('Ordem de serviço atualizada.');
  }

  salvarTabela('ordens', ordens);
  limparFormulario();
  mostrarOrdens();
}

function editarOrdem(ordem) {
  campoId.value = ordem.id;
  campoCliente.value = ordem.clienteId;
  preencherListaDeVeiculos(ordem.clienteId);
  campoVeiculo.value = ordem.veiculoId;
  campoData.value = ordem.data;
  campoHora.value = ordem.hora || '';
  campoSituacao.value = ordem.situacao || 'Aberta';

  itensDaOrdem = Array.isArray(ordem.itens)
    ? ordem.itens.map((item) => ({ ...item }))
    : [];
  renderizarItens();

  tituloFormulario.textContent = 'Editar ordem de serviço';
  botaoSalvar.textContent = 'Salvar alterações';
  botaoCancelar.hidden = false;
  campoCliente.focus();
}

function excluirOrdem(ordem) {
  const cliente = nomeDoCliente(ordem.clienteId);
  if (!confirm('Excluir a ordem de ' + formatarDataHora(ordem.data, ordem.hora) + ' do cliente ' + cliente + '?')) {
    return;
  }

  const restantes = lerTabela('ordens').filter((item) => item.id !== ordem.id);
  salvarTabela('ordens', restantes);

  if (campoId.value === ordem.id) {
    limparFormulario();
  }
  mostrarMensagem('Ordem excluída.');
  mostrarOrdens();
}

function limparFormulario() {
  formulario.reset();
  campoId.value = '';
  campoData.value = dataDeHoje();
  campoHora.value = '08:00';
  campoSituacao.value = 'Aberta';
  itensDaOrdem = [];
  renderizarItens();
  preencherListaDeVeiculos('');
  tituloFormulario.textContent = 'Nova ordem de serviço';
  botaoSalvar.textContent = 'Abrir ordem';
  botaoCancelar.hidden = true;
}

function atualizarEstadoFormulario() {
  const clientes = lerTabela('clientes');
  avisoSemClientes.hidden = clientes.length > 0;
  camposOrdem.disabled = clientes.length === 0;
}

function mostrarOrdens() {
  const busca = campoPesquisa.value.trim().toLowerCase();

  const ordens = lerTabela('ordens')
    .filter((ordem) => {
      const texto = [
        formatarDataHora(ordem.data, ordem.hora),
        ordem.data,
        nomeDoCliente(ordem.clienteId),
        descricaoDoVeiculo(ordem.veiculoId),
        ordem.situacao,
      ].join(' ').toLowerCase();
      return texto.includes(busca);
    })
    .sort((a, b) => {
      if (a.data !== b.data) return b.data.localeCompare(a.data);
      if (a.hora !== b.hora) return String(b.hora || '').localeCompare(String(a.hora || ''));
      return String(b.id).localeCompare(String(a.id));
    });

  corpoTabela.innerHTML = '';

  for (const ordem of ordens) {
    const linha = document.createElement('tr');
    const celulaAcoes = document.createElement('td');

    const linkOrcamento = document.createElement('a');
    linkOrcamento.href = 'orcamento.html?ordem=' + encodeURIComponent(ordem.id);
    linkOrcamento.textContent = 'Orçamento';
    linkOrcamento.className = 'botao botao-pequeno';
    linkOrcamento.setAttribute('aria-label', 'Ver orçamento da ordem de ' + formatarDataHora(ordem.data, ordem.hora));

    celulaAcoes.append(
      criarBotao('Editar', 'Editar ordem de ' + formatarDataHora(ordem.data, ordem.hora), () => editarOrdem(ordem)),
      criarBotao('Excluir', 'Excluir ordem de ' + formatarDataHora(ordem.data, ordem.hora), () => excluirOrdem(ordem)),
      linkOrcamento,
    );

    linha.append(
      criarCelula(formatarDataHora(ordem.data, ordem.hora)),
      criarCelula(nomeDoCliente(ordem.clienteId)),
      criarCelula(descricaoDoVeiculo(ordem.veiculoId)),
      criarCelula(ordem.situacao || '—'),
      criarCelula(formatarDinheiro(calcularTotal(ordem.itens))),
      celulaAcoes,
    );
    corpoTabela.append(linha);
  }

  avisoListaVazia.hidden = ordens.length > 0;
}
