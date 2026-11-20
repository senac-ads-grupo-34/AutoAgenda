function lerTabela(nomeTabela) {
  const texto = localStorage.getItem(nomeTabela);

  if (texto === null) {
    return [];
  }

  try {
    return JSON.parse(texto);
  } catch (erro) {
    console.error('Dados corrompidos na tabela ' + nomeTabela, erro);
    return [];
  }
}

function salvarTabela(nomeTabela, registros) {
  localStorage.setItem(nomeTabela, JSON.stringify(registros));
}

function buscarPorId(nomeTabela, id) {
  return lerTabela(nomeTabela).find((registro) => registro.id === id);
}

function gerarId() {
  return String(Date.now());
}
