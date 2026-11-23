function lerTabela(nomeTabela) {
  const texto = localStorage.getItem(nomeTabela);

  if (texto === null) {
    return [];
  }

  try {
    const registros = JSON.parse(texto);

    // Evita que um valor salvo em outro formato quebre as páginas.
    if (!Array.isArray(registros)) {
      console.error('Formato inválido na tabela ' + nomeTabela);
      return [];
    }

    return registros;
  } catch (erro) {
    console.error('Dados corrompidos na tabela ' + nomeTabela, erro);
    return [];
  }
}

function salvarTabela(nomeTabela, registros) {
  localStorage.setItem(nomeTabela, JSON.stringify(registros));
}

function buscarPorId(nomeTabela, id) {
  // String() porque alguns serviços chegaram a ser salvos com id numérico.
  return lerTabela(nomeTabela).find((registro) => String(registro.id) === String(id));
}

// Só o Date.now() repete o id quando dois registros são salvos no mesmo milissegundo,
// por isso entra também um pedaço aleatório.
function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
