// Página inicial: resumo do que já está cadastrado e da agenda de hoje.

const hoje = dataDeHoje();

document.getElementById('total-clientes').textContent = lerTabela('clientes').length;
document.getElementById('total-veiculos').textContent = lerTabela('veiculos').length;
document.getElementById('total-servicos').textContent = lerTabela('servicos').length;

const ordensDeHoje = lerTabela('ordens')
  .filter((ordem) => ordem.data === hoje && ordem.situacao !== 'Cancelada')
  .sort((a, b) => String(a.hora || '').localeCompare(String(b.hora || '')));

document.getElementById('total-hoje').textContent = ordensDeHoje.length;

// Os dois atalhos para a agenda já abrem o histórico filtrado no dia de hoje.
document.getElementById('link-agenda-hoje').href = 'historico.html?data=' + hoje;
document.getElementById('numero-hoje').href = 'historico.html?data=' + hoje;

mostrarProximoAtendimento();

function mostrarProximoAtendimento() {
  const aviso = document.getElementById('proximo-atendimento');
  const proxima = ordensDeHoje.find((ordem) => ordem.situacao !== 'Concluída');

  if (!proxima) {
    return;
  }

  aviso.textContent = 'Próximo atendimento de hoje: ' + (proxima.hora || 'sem horário') + ', '
    + nomeDoCliente(proxima.clienteId) + ', ' + descricaoDoVeiculo(proxima.veiculoId) + '.';
  aviso.hidden = false;
}
