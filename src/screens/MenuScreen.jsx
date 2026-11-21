function MenuScreen({ pantallaActual, favoritosCount = 0, onNavigate, onVolver }) {
  const items = [
    { id: 'inicio', titulo: 'Inicio', desc: 'Regresa a la portada' },
    { id: 'catalogo', titulo: 'Ver Pokémon', desc: 'Explora las especies registradas' },
    { id: 'favoritos', titulo: 'Favoritos', desc: favoritosCount > 0 ? `${favoritosCount} guardados` : 'Consulta los Pokémon que has guardado' },
    { id: 'ajustes', titulo: 'Ajustes', desc: 'Cambia el tema de la aplicación' },
    { id: 'acerca', titulo: 'Acerca de', desc: 'Conoce el alcance de esta Pokédex' },
  ];

  return (
    <main className="screen screen-transition">
      <div className="body body--simple body--menu">
        <h2>Tu Pokédex</h2>
        <p>Elige a dónde quieres ir.</p>

        <div className="action-list" role="navigation" aria-label="Menú principal">
          {items.map((item, indice) => (
            <button
              key={item.id}
              type="button"
              className={`action-card${pantallaActual === item.id ? ' is-active' : ''}`}
              style={{ '--animation-index': indice }}
              onClick={() => onNavigate(item.id)}
            >
              <strong>{item.titulo}</strong>
              <span>{item.desc}</span>
            </button>
          ))}
        </div>

        <button type="button" className="btn btn--secondary btn--full" onClick={onVolver}>
          Volver a mi pantalla
        </button>
      </div>
    </main>
  );
}

export default MenuScreen;
