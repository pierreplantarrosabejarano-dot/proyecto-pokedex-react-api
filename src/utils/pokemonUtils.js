export function formatearNumeroPokemon(id) {
  return `#${String(id).padStart(3, '0')}`;
}

export function filtrarPokemones(lista, terminoBusqueda) {
  if (!terminoBusqueda.trim()) return lista;
  return lista.filter((pokemon) =>
    pokemon.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );
}
