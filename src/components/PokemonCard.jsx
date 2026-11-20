function PokemonCard({ id, nombre, tipo, imagen, esFavorito, onToggleFavorito }) {
  return (
    <article className="pokemon-card">
      <img src={imagen} alt={nombre} />
      <h3>#{String(id).padStart(3, '0')} {nombre}</h3>
      <p className="type">{tipo}</p>
      
      {/* Botón interactivo conectado por props */}
      <button 
        onClick={() => onToggleFavorito(id)}
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
