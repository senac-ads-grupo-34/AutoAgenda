const formulario = document.getElementById('formulario');
const grupoCampos = document.getElementById('campos-veiculo');
const campoId = document.getElementById('veiculo-id');
const campoCliente = document.getElementById('veiculo-cliente');
const campoPlaca = document.getElementById('veiculo-placa');
const campoMarca = document.getElementById('veiculo-marca');
const campoModelo = document.getElementById('veiculo-modelo');
const campoAno = document.getElementById('veiculo-ano');
const tituloFormulario = document.getElementById('titulo-formulario');
const botaoSalvar = document.getElementById('botao-salvar');
const botaoCancelar = document.getElementById('botao-cancelar');
const campoPesquisa = document.getElementById('pesquisa');
const corpoTabela = document.getElementById('lista');
const avisoListaVazia = document.getElementById('lista-vazia');
const avisoSemClientes = document.getElementById('aviso-sem-clientes');

campoAno.max = new Date().getFullYear() + 1;

formulario.addEventListener('submit', salvarVeiculo);
botaoCancelar.addEventListener('click', limparFormulario);
campoPesquisa.addEventListener('input', mostrarVeiculos);

preencherListaDeClientes();
mostrarVeiculos();

function preencherListaDeClientes() {
  const clientes = lerTabela('clientes').sort((a, b) => a.nome.localeCompare(b.nome));

  for (const cliente of clientes) {
    campoCliente.append(new Option(cliente.nome, cliente.id));
  }

  const semClientes = clientes.length === 0;
  grupoCampos.disabled = semClientes;
  avisoSemClientes.hidden = !semClientes;
}

function salvarVeiculo(evento) {
  evento.preventDefault();

  const veiculo = {
    id: campoId.value,
    clienteId: campoCliente.value,
    placa: padronizarPlaca(campoPlaca.value),
    marca: campoMarca.value.trim(),
    modelo: campoModelo.value.trim(),
    ano: Number(campoAno.value),
  };

  const cliente = buscarPorId('clientes', veiculo.clienteId);

if (!cliente) {
  mostrarMensagem('Selecione um cliente válido.', 'erro');
  campoCliente.focus();
  return;
}

const anoMaximo = new Date().getFullYear() + 1;

if (
  !Number.isInteger(veiculo.ano) ||
  veiculo.ano < 1900 ||
  veiculo.ano > anoMaximo
) {
  mostrarMensagem('Informe um ano válido para o veículo.', 'erro');
  campoAno.focus();
  return;
}

  const veiculos = lerTabela('veiculos');

  const placaRepetida = veiculos.some((item) => item.placa === veiculo.placa && item.id !== veiculo.id);
  if (placaRepetida) {
    mostrarMensagem('Já existe um veículo com a placa ' + exibirPlaca(veiculo.placa) + '.', 'erro');
    campoPlaca.focus();
    return;
  }

  if (veiculo.id === '') {
    veiculo.id = gerarId();
    veiculos.push(veiculo);
    mostrarMensagem('Veículo cadastrado com sucesso.');
  } else {
  const posicao = veiculos.findIndex(
    (item) => item.id === veiculo.id
  );

  if (posicao === -1) {
    mostrarMensagem('Veículo não encontrado para edição.', 'erro');
    return;
  }

  veiculos[posicao] = veiculo;
  mostrarMensagem('Veículo atualizado com sucesso.');
}

  salvarTabela('veiculos', veiculos);
  limparFormulario();
  mostrarVeiculos();
}

function editarVeiculo(veiculo) {
  campoId.value = veiculo.id;
  campoCliente.value = veiculo.clienteId;
  campoPlaca.value = exibirPlaca(veiculo.placa);
  campoMarca.value = veiculo.marca;
  campoModelo.value = veiculo.modelo;
  campoAno.value = veiculo.ano;

  tituloFormulario.textContent = 'Editar veículo';
  botaoSalvar.textContent = 'Salvar alterações';
  botaoCancelar.hidden = false;
  campoCliente.focus();
}

function excluirVeiculo(veiculo) {
  // Avisa antes de perguntar, para o usuário não confirmar algo que não vai acontecer.
  const ordensDoVeiculo = lerTabela('ordens').filter((ordem) => ordem.veiculoId === veiculo.id);
  if (ordensDoVeiculo.length > 0) {
    mostrarMensagem('Este veículo tem ordens de serviço e não pode ser excluído.', 'erro');
    return;
  }

  if (!confirm('Excluir o veículo ' + exibirPlaca(veiculo.placa) + '?')) {
    return;
  }

  const veiculosRestantes = lerTabela('veiculos').filter((item) => item.id !== veiculo.id);
  salvarTabela('veiculos', veiculosRestantes);

  if (campoId.value === veiculo.id) {
    limparFormulario();
  }
  mostrarMensagem('Veículo excluído.');
  mostrarVeiculos();
}

function limparFormulario() {
  formulario.reset();
  campoId.value = '';
  tituloFormulario.textContent = 'Novo veículo';
  botaoSalvar.textContent = 'Cadastrar veículo';
  botaoCancelar.hidden = true;
}

function mostrarVeiculos() {
  const busca = campoPesquisa.value.trim().toLowerCase();

  const veiculos = lerTabela('veiculos')
    .filter((veiculo) => {
      const textoDoVeiculo = [
        veiculo.placa,
        exibirPlaca(veiculo.placa),
        veiculo.marca,
        veiculo.modelo,
        nomeDoCliente(veiculo.clienteId),
      ].join(' ').toLowerCase();
      return textoDoVeiculo.includes(busca);
    })
    .sort((a, b) => a.placa.localeCompare(b.placa));

  corpoTabela.innerHTML = '';

  for (const veiculo of veiculos) {
    const placa = exibirPlaca(veiculo.placa);
    const linha = document.createElement('tr');
    const celulaAcoes = document.createElement('td');

    celulaAcoes.append(
      criarBotao('Editar', 'Editar veículo ' + placa, () => editarVeiculo(veiculo)),
      criarBotao('Excluir', 'Excluir veículo ' + placa, () => excluirVeiculo(veiculo)),
    );
    linha.append(
      criarCelula(placa),
      criarCelula(veiculo.marca + ' ' + veiculo.modelo),
      criarCelula(veiculo.ano),
      criarCelula(nomeDoCliente(veiculo.clienteId)),
      celulaAcoes,
    );
    corpoTabela.append(linha);
  }

  avisoListaVazia.hidden = veiculos.length > 0;
}
