function AcercaScreen({ onExplorar, onAjustes, onVolver }) {
  return (
    <main className="screen screen-transition">
      <div className="body body--simple body--acerca">
        <h2>Acerca de esta Pokédex</h2>
        <p>
          Esta aplicación consume la PokéAPI para mostrar catálogos por región, con búsqueda por nombre o número,
          filtros por tipo, vista de detalle, favoritos y cambio de tema visual.
        </p>

        <div className="info-card">
          <strong>Datos en vivo</strong>
          <p>Pokémon, tipos, estadísticas y descripciones obtenidos desde PokéAPI.</p>
          <p>Explora Kanto, Johto, Hoenn, Sinnoh, Teselia, Kalos, Alola, Galar, Paldea e Hisui.</p>
        </div>

        <div className="info-card">
          <strong>Interfaz y personalización</strong>
          <p>Guarda tus favoritos y personaliza la apariencia en Claro, Oscuro o Cálido.</p>
          <p>Diseño responsive, animaciones suaves y navegación con historial de pantalla.</p>
        </div>

        <button type="button" className="btn btn--primary btn--full" onClick={onExplorar}>
          Explorar catálogo
        </button>
        <button type="button" className="btn btn--secondary btn--full" onClick={onAjustes}>
          Ir a Ajustes
        </button>
        <a
          className="btn btn--secondary btn--full"
          href="https://pokeapi.co/"
          target="_blank"
          rel="noreferrer"
        >
          Visitar PokéAPI
        </a>
        {typeof onVolver === 'function' && (
          <button type="button" className="btn btn--secondary btn--full" onClick={onVolver}>
            Volver a mi pantalla
          </button>
        )}
      </div>
    </main>
  );
}

export default AcercaScreen;
