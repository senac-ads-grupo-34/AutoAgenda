// Serviços (RF03): cadastrar, listar, editar, excluir e pesquisar.
// Tabela 'servicos': { id, nome, categoria, complexidade, tempoMedio, preco }

const formulario = document.getElementById('formulario');
const campoId = document.getElementById('servico-id');
const campoNome = document.getElementById('servico-nome');
const campoTempo = document.getElementById('servico-tempo');
const campoPreco = document.getElementById('servico-preco');
const campoCategoria = document.getElementById('servico-categoria');
const campoComplexidade = document.getElementById('servico-complexidade');
const tituloFormulario = document.getElementById('titulo-formulario');
const botaoSalvar = document.getElementById('botao-salvar');
const botaoCancelar = document.getElementById('botao-cancelar');
const campoPesquisa = document.getElementById('pesquisa');
const corpoTabela = document.getElementById('lista');
const avisoListaVazia = document.getElementById('lista-vazia');

formulario.addEventListener('submit', salvarServico);
botaoCancelar.addEventListener('click', limparFormulario);
campoPesquisa.addEventListener('input', mostrarServicos);

mostrarServicos();

function salvarServico(evento) {
  evento.preventDefault();

  const servico = {
    id: campoId.value,
    nome: campoNome.value.trim(),
    categoria: campoCategoria.value,
    complexidade: campoComplexidade.value,
    tempoMedio: Number(campoTempo.value),
    preco: Number(campoPreco.value),
  };

  // O "required" do HTML aceita um nome só com espaços; aqui barramos isso.
  if (servico.nome === '') {
    mostrarMensagem('Informe o nome do serviço.', 'erro');
    campoNome.focus();
    return;
  }
  
  if (servico.categoria === '') {
    mostrarMensagem('Selecione uma categoria.', 'erro');
    campoCategoria.focus();
    return;
  }
  
  if (servico.complexidade === '') {
    mostrarMensagem('Selecione o nível de complexidade.', 'erro');
    campoComplexidade.focus();
    return;
  }

  if (!Number.isInteger(servico.tempoMedio) || servico.tempoMedio < 5) {
    mostrarMensagem('O tempo médio deve ser um número inteiro de minutos, a partir de 5.', 'erro');
    campoTempo.focus();
    return;
  }

  if (servico.preco < 0) {
    mostrarMensagem('O preço não pode ser negativo.', 'erro');
    campoPreco.focus();
    return;
  }

  const servicos = lerTabela('servicos');

  const nomeRepetido = servicos.some((item) =>
    item.nome.toLowerCase() === servico.nome.toLowerCase() && String(item.id) !== servico.id);
  if (nomeRepetido) {
    mostrarMensagem('Já existe um serviço com o nome ' + servico.nome + '.', 'erro');
    campoNome.focus();
    return;
  }

  if (servico.id === '') {
    servico.id = gerarId();
    servicos.push(servico);
    mostrarMensagem('Serviço cadastrado com sucesso.');
  } else {
    const posicao = servicos.findIndex((item) => String(item.id) === servico.id);
    servicos[posicao] = servico;
    mostrarMensagem('Serviço atualizado com sucesso.');
  }

  salvarTabela('servicos', servicos);
  limparFormulario();
  mostrarServicos();
}

function editarServico(servico) {
  campoId.value = servico.id;
  campoNome.value = servico.nome;
  campoCategoria.value = servico.categoria;
  campoComplexidade.value = servico.complexidade;
  campoTempo.value = servico.tempoMedio;
  campoPreco.value = servico.preco;

  tituloFormulario.textContent = 'Editar serviço';
  botaoSalvar.textContent = 'Salvar alterações';
  botaoCancelar.hidden = false;
  campoNome.focus();
}

function excluirServico(servico) {
  // As ordens guardam uma cópia do serviço, então elas continuam com o valor registrado.
  if (!confirm('Excluir o serviço "' + servico.nome + '"?')) {
    return;
  }

  const servicosRestantes = lerTabela('servicos').filter((item) => item.id !== servico.id);
  salvarTabela('servicos', servicosRestantes);

  if (campoId.value === servico.id) {
    limparFormulario();
  }
  mostrarMensagem('Serviço excluído.');
  mostrarServicos();
}

function limparFormulario() {
  formulario.reset();
  campoId.value = '';
  tituloFormulario.textContent = 'Novo serviço';
  botaoSalvar.textContent = 'Cadastrar serviço';
  botaoCancelar.hidden = true;
}

function mostrarServicos() {
  const busca = campoPesquisa.value.trim().toLowerCase();

  const servicos = lerTabela('servicos')
    .filter((servico) => servico.nome.toLowerCase().includes(busca))
    .sort((a, b) => a.nome.localeCompare(b.nome));

  corpoTabela.innerHTML = '';

  for (const servico of servicos) {
    const linha = document.createElement('tr');
    const celulaAcoes = document.createElement('td');

    celulaAcoes.append(
      criarBotao('Editar', 'Editar serviço ' + servico.nome, () => editarServico(servico)),
      criarBotao('Excluir', 'Excluir serviço ' + servico.nome, () => excluirServico(servico)),
    );
    linha.append(
      criarCelula(servico.nome),
      criarCelula(servico.categoria),
      criarCelula(servico.complexidade),
      criarCelula(formatarDuracao(servico.tempoMedio)),
      criarCelula(formatarDinheiro(servico.preco)),
      celulaAcoes,
    );
    corpoTabela.append(linha);
  }

  avisoListaVazia.hidden = servicos.length > 0;
}
