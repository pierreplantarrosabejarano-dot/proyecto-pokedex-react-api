import { formatearNumeroPokemon } from '../utils/pokemonUtils';

function CapturaScreen({ pokemon, totalCapturados = 0, onVerFicha, onSeguirExplorando, onVolver }) {
  if (!pokemon) {
    return (
      <main className="screen screen-transition">
        <div className="body body--simple body--captura">
          <h2>Captura</h2>
          <div className="empty-state">
            <strong>Aún no has capturado un Pokémon</strong>
            <span>Explora el catálogo y captura tu primer Pokémon.</span>
          </div>
          <button type="button" className="btn btn--primary btn--full" onClick={onSeguirExplorando}>
            Ir al catálogo
          </button>
          <button type="button" className="btn btn--secondary btn--full" onClick={onVolver}>
            Volver
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="screen screen-transition">
      <div className="body body--simple body--captura">
        <h2>¡Pokémon capturado!</h2>
        <p>Has añadido a {pokemon.nombre} a tu colección de esta sesión.</p>

        <div className="capture-image">
          <img src={pokemon.imagen} alt={pokemon.nombre} />
        </div>

        <div className="capture-card">
          <strong>{totalCapturados}</strong>
          <p>{formatearNumeroPokemon(pokemon.id)} · {pokemon.tipoTexto || 'Pokémon'}</p>
          <p>capturados en esta sesión</p>
        </div>

        <button type="button" className="btn btn--primary btn--full" onClick={() => onVerFicha(pokemon)}>
          Ver ficha
        </button>
        <button type="button" className="btn btn--secondary btn--full" onClick={onSeguirExplorando}>
          Seguir explorando
        </button>
        <button type="button" className="btn btn--secondary btn--full" onClick={onVolver}>
          Volver
        </button>
      </div>
    </main>
  );
}

export default CapturaScreen;
