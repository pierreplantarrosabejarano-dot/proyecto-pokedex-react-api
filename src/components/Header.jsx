import { useFavoritos } from '../context/FavoritosContext';

function Header({ vista, onNavigate, onSearchFocus, onMenuOpen }) {
  const { favoritos } = useFavoritos();
  const verPokemonActivo = vista === 'catalogo' || vista === 'detalle' || vista === 'favoritos';

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="header-left">
          <button type="button" className="icon-btn" aria-label="Menú" onClick={onMenuOpen}>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="badge-pokedex">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M1.5 8h13" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            </svg>
            <span>Pokédex</span>
          </div>
        </div>
        <button type="button" className="icon-btn" aria-label="Buscar" onClick={onSearchFocus}>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="2" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="title-wrap">
        <h1 className="app-title">Pokedex Virtual</h1>
        <p className="subtitle">Explora, captura y descubre especies en un mundo de aventuras.</p>
      </div>

      <nav className="header-tabs" aria-label="Navegación principal">
        <button
          type="button"
          className={`tab-btn ${vista === 'inicio' ? 'active' : ''}`}
          onClick={() => onNavigate('inicio')}
        >
          Inicio
        </button>
        <button
          type="button"
          className={`tab-btn ${verPokemonActivo ? 'active' : ''}`}
          onClick={() => onNavigate('catalogo')}
        >
          Ver Pokémon
        </button>
        <button
          type="button"
          className={`tab-btn ${vista === 'acerca' ? 'active' : ''}`}
          onClick={() => onNavigate('acerca')}
        >
          Acerca de
        </button>
      </nav>

      <span className="sr-only" aria-live="polite">{`Favoritos guardados: ${favoritos.length}`}</span>
    </header>
  );
}

export default Header;
