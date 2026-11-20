// Orçamento (RF06): mostrar cliente, veículo, serviços, total e um botão para imprimir.
// O id da ordem vem na URL: orcamento.html?ordem=<id>

const idDaOrdem = new URLSearchParams(location.search).get('ordem');

const avisoSemOrdem = document.getElementById('aviso-sem-ordem');
const conteudoOrcamento = document.getElementById('conteudo-orcamento');
const botaoImprimir = document.getElementById('botao-imprimir');

botaoImprimir.addEventListener('click', () => window.print());

if (!idDaOrdem) {
  avisoSemOrdem.hidden = false;
} else {
  carregarOrcamento(idDaOrdem);
}

function carregarOrcamento(id) {
  const ordem = buscarPorId('ordens', id);

  if (!ordem) {
    avisoSemOrdem.hidden = false;
    mostrarMensagem('Ordem de serviço não encontrada.', 'erro');
    return;
  }

  conteudoOrcamento.hidden = false;

  document.getElementById('orc-data').textContent = formatarData(ordem.data);
  document.getElementById('orc-situacao').textContent = ordem.situacao || '—';
  document.getElementById('orc-id').textContent = ordem.id;

  // Cliente
  const cliente = buscarPorId('clientes', ordem.clienteId);
  if (cliente) {
    document.getElementById('orc-cliente-nome').textContent = cliente.nome;
    const contato = [];
    if (cliente.telefone) contato.push(cliente.telefone);
    if (cliente.email) contato.push(cliente.email);
    document.getElementById('orc-cliente-contato').textContent = contato.join(' · ') || '';
  } else {
    document.getElementById('orc-cliente-nome').textContent = '(cliente não encontrado)';
    document.getElementById('orc-cliente-contato').textContent = '';
  }

  // Veículo
  const veiculo = buscarPorId('veiculos', ordem.veiculoId);
  if (veiculo) {
    const placa = exibirPlaca(veiculo.placa);
    document.getElementById('orc-veiculo').textContent =
      placa + ' — ' + veiculo.marca + ' ' + veiculo.modelo + ' (' + veiculo.ano + ')';
  } else {
    document.getElementById('orc-veiculo').textContent = '(veículo não encontrado)';
  }

  // Serviços
  const listaServicos = document.getElementById('lista-servicos');
  listaServicos.innerHTML = '';

  const itens = Array.isArray(ordem.itens) ? ordem.itens : [];
  let total = 0;

  if (itens.length === 0) {
    const linha = document.createElement('tr');
    const celula = document.createElement('td');
    celula.colSpan = 2;
    celula.textContent = 'Nenhum serviço registrado nesta ordem.';
    celula.className = 'dica';
    linha.append(celula);
    listaServicos.append(linha);
  } else {
    for (const item of itens) {
      const preco = Number(item.preco) || 0;
      total += preco;

      const linha = document.createElement('tr');
      linha.append(
        criarCelula(item.nome || '(serviço sem nome)'),
        criarCelula(formatarDinheiro(preco)),
      );
      listaServicos.append(linha);
    }
  }

  document.getElementById('orc-total').textContent = formatarDinheiro(total);
  document.title = 'Orçamento ' + ordem.id + ' | AutoAgenda';
}

function exibirPlaca(placa) {
  const limpa = String(placa || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (limpa.length === 7) {
    return limpa.slice(0, 3) + '-' + limpa.slice(3);
  }
  return limpa || '—';
}
