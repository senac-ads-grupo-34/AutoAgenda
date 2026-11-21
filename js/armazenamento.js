function lerTabela(nomeTabela) {
  const texto = localStorage.getItem(nomeTabela);

  if (texto === null) {
    return [];
  }

  try {
    const registros = JSON.parse(texto);

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
