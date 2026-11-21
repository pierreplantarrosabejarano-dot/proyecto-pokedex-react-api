import { iconos } from '../assets';
import { formatearNumeroPokemon } from '../utils/pokemonUtils';

function BuscarScreen({ tema, busqueda, onBusquedaChange, resultados, buscando, onOpen, onVolver, onIrCatalogo }) {
  const iconosTema = iconos[tema] || iconos.claro;

  return (
    <main className="screen screen-transition">
      <div className="body body--simple body--buscar">
        <h2>Buscar Pokémon</h2>
        <p>Escribe el nombre o número para encontrar un Pokémon en la región actual o en la PokéAPI.</p>

        <label className="search-field">
          <img src={iconosTema.searchField} alt="" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Ej. Pikachu o 25"
            aria-label="Buscar Pokémon"
            autoFocus
          />
        </label>

        {buscando && (
          <div className="status-card">
            <p>Buscando en la PokéAPI...</p>
          </div>
        )}

        {!buscando && busqueda && resultados.length === 0 && (
          <div className="empty-state">
            <strong>Sin coincidencias</strong>
            <span>No se encontraron Pokémon para &quot;{busqueda}&quot;.</span>
          </div>
        )}

        {resultados.length > 0 && (
          <div className="action-list action-list--search" role="list">
            {resultados.map((pokemon, indice) => (
              <button
                key={pokemon.id}
                type="button"
                className="search-result"
                style={{ '--animation-index': indice }}
                onClick={() => onOpen(pokemon)}
              >
                <span className="search-result__image">
                  <img
                    src={pokemon.imagen}
                    alt={pokemon.nombre}
                    className="search-result__image-img"
                    loading="lazy"
                  />
                </span>
                <span className="search-result__meta">
                  <strong>{`${formatearNumeroPokemon(pokemon.id)} ${pokemon.nombre}`}</strong>
                  <span>{pokemon.tipoTexto || 'Tipo no disponible'}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        <button type="button" className="btn btn--secondary btn--full" onClick={onVolver}>
          Volver
        </button>
        <button type="button" className="btn btn--primary btn--full" onClick={onIrCatalogo}>
          Ver catálogo
        </button>
      </div>
    </main>
  );
}

export default BuscarScreen;
