import { iconos } from '../assets';

const TABS = [
  { id: 'inicio', etiqueta: 'Inicio' },
  { id: 'catalogo', etiqueta: 'Ver Pokémon' },
  { id: 'acerca', etiqueta: 'Acerca de' },
];

function AppHeader({ tema = 'claro', pantalla, compacta = false, onHome, onMenu, onSearch, onNavigate }) {
  const iconosTema = iconos[tema] || iconos.claro;
  const tabActiva = pantalla === 'detalle' || pantalla === 'buscar' || pantalla === 'captura' || pantalla === 'favoritos' ? 'catalogo' : pantalla;

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="header-left">
          <button className="header-icon-button" type="button" onClick={onMenu} aria-label="Abrir menú">
            <img src={iconosTema.menu} alt="" />
          </button>
          <button className="pokedex-badge" type="button" onClick={onHome}>
            <img src={iconosTema.pokedex} alt="" />
            <span>Pokédex</span>
          </button>
        </div>
        <button className="header-icon-button" type="button" onClick={onSearch} aria-label="Buscar Pokémon">
          <img src={iconosTema.search} alt="" />
        </button>
      </div>

      {!compacta && (
        <>
          <div className="header-title">
            <h1>Pokedex Virtual</h1>
            <p>Explora, captura y descubre especies en un mundo de aventuras.</p>
          </div>
          <nav className="header-tabs" aria-label="Navegación principal">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`header-tab ${tabActiva === tab.id ? 'is-active' : ''}`}
                onClick={() => onNavigate(tab.id)}
                aria-current={tabActiva === tab.id ? 'page' : undefined}
              >
                {tab.etiqueta}
              </button>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}

export default AppHeader;
