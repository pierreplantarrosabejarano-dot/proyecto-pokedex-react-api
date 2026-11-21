export function formatearNumeroPokemon(id) {
  return `#${String(id).padStart(3, '0')}`;
}

export function normalizarTexto(texto = '') {
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function filtrarPokemones(lista, terminoBusqueda) {
  const termino = normalizarTexto(terminoBusqueda);
  if (!termino) return lista;

  const terminoLimpio = termino.replace(/^#/, '');
  const terminoNumero = terminoLimpio.replace(/^0+(?=\d)/, '') || '0';
  const esNumero = /^\d+$/.test(terminoLimpio);

  return lista.filter((pokemon) => {
    const nombre = normalizarTexto(pokemon?.nombre || pokemon?.name || '');
    if (nombre.includes(termino)) return true;

    if (pokemon?.id == null) return false;
    const id = String(pokemon.id);
    const numeroFormateado = String(pokemon.id).padStart(3, '0');
    const idNormalizado = id.replace(/^0+/, '') || '0';

    if (numeroFormateado.includes(terminoLimpio)) return true;
    if (esNumero && (id === terminoLimpio || idNormalizado === terminoNumero)) return true;
    if (esNumero && id.includes(terminoLimpio)) return true;

    return false;
  });
}

