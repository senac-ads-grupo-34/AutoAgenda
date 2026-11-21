const formulario = document.getElementById('formulario');
const campoId = document.getElementById('cliente-id');
const campoNome = document.getElementById('cliente-nome');
const campoTelefone = document.getElementById('cliente-telefone');
const campoEmail = document.getElementById('cliente-email');
const tituloFormulario = document.getElementById('titulo-formulario');
const botaoSalvar = document.getElementById('botao-salvar');
const botaoCancelar = document.getElementById('botao-cancelar');
const campoPesquisa = document.getElementById('pesquisa');
const corpoTabela = document.getElementById('lista');
const avisoListaVazia = document.getElementById('lista-vazia');

formulario.addEventListener('submit', salvarCliente);
botaoCancelar.addEventListener('click', limparFormulario);
campoPesquisa.addEventListener('input', mostrarClientes);

mostrarClientes();

function salvarCliente(evento) {
  evento.preventDefault();

  const cliente = {
    id: campoId.value,
    nome: campoNome.value.trim(),
    telefone: campoTelefone.value.trim(),
    email: campoEmail.value.trim().toLowerCase(),
  };

  // O "required" do HTML aceita um nome só com espaços; aqui barramos isso.
  if (cliente.nome === '') {
    mostrarMensagem('Informe o nome do cliente.', 'erro');
    campoNome.focus();
    return;
  }

  const clientes = lerTabela('clientes');

  if (cliente.id === '') {
    cliente.id = gerarId();
    clientes.push(cliente);
    mostrarMensagem('Cliente cadastrado com sucesso.');
  } else {
    const posicao = clientes.findIndex((item) => item.id === cliente.id);
    clientes[posicao] = cliente;
    mostrarMensagem('Cliente atualizado com sucesso.');
  }

  salvarTabela('clientes', clientes);
  limparFormulario();
  mostrarClientes();
}

function editarCliente(cliente) {
  campoId.value = cliente.id;
  campoNome.value = cliente.nome;
  campoTelefone.value = cliente.telefone;
  campoEmail.value = cliente.email;

  tituloFormulario.textContent = 'Editar cliente';
  botaoSalvar.textContent = 'Salvar alterações';
  botaoCancelar.hidden = false;
  campoNome.focus();
}

function excluirCliente(cliente) {
  // Avisa antes de perguntar, para o usuário não confirmar algo que não vai acontecer.
  const veiculosDoCliente = lerTabela('veiculos').filter((veiculo) => veiculo.clienteId === cliente.id);
  if (veiculosDoCliente.length > 0) {
    mostrarMensagem('Este cliente tem veículos cadastrados. Exclua os veículos primeiro.', 'erro');
    return;
  }

  if (!confirm('Excluir o cliente "' + cliente.nome + '"?')) {
    return;
  }

  const clientesRestantes = lerTabela('clientes').filter((item) => item.id !== cliente.id);
  salvarTabela('clientes', clientesRestantes);

  if (campoId.value === cliente.id) {
    limparFormulario();
  }
  mostrarMensagem('Cliente excluído.');
  mostrarClientes();
}

function limparFormulario() {
  formulario.reset();
  campoId.value = '';
  tituloFormulario.textContent = 'Novo cliente';
  botaoSalvar.textContent = 'Cadastrar cliente';
  botaoCancelar.hidden = true;
}

function mostrarClientes() {
  const busca = campoPesquisa.value.trim().toLowerCase();

  const clientes = lerTabela('clientes')
    .filter((cliente) =>
      cliente.nome.toLowerCase().includes(busca) ||
      cliente.telefone.includes(busca) ||
      cliente.email.includes(busca))
    .sort((a, b) => a.nome.localeCompare(b.nome));

  corpoTabela.innerHTML = '';

  for (const cliente of clientes) {
    const linha = document.createElement('tr');
    const celulaAcoes = document.createElement('td');

    celulaAcoes.append(
      criarBotao('Editar', 'Editar cliente ' + cliente.nome, () => editarCliente(cliente)),
      criarBotao('Excluir', 'Excluir cliente ' + cliente.nome, () => excluirCliente(cliente)),
    );
    linha.append(
      criarCelula(cliente.nome),
      criarCelula(cliente.telefone),
      criarCelula(cliente.email || '—'),
      celulaAcoes,
    );
    corpoTabela.append(linha);
  }

  avisoListaVazia.hidden = clientes.length > 0;
}
