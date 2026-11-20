import { useFavoritos } from '../context/FavoritosContext';

function PokemonCard({ id, nombre, tipo, imagen }) {
  const { favoritos, toggleFavorito } = useFavoritos();
  const esFavorito = favoritos.includes(id);

  return (
    <article className="pokemon-card">
      <img src={imagen} alt={nombre} />
      <h3>#{String(id).padStart(3, '0')} {nombre}</h3>
      <p className="type">{tipo}</p>

      <button
        onClick={() => toggleFavorito(id)}
        style={{
          marginTop: '10px',
          padding: '6px 12px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: esFavorito ? '#ffcb05' : '#e2e8f0',
          fontWeight: 'bold'
        }}
      >
        {esFavorito ? '★ Favorito' : '☆ Agregar a favoritos'}
      </button>
    </article>
  );
}

export default PokemonCard;
