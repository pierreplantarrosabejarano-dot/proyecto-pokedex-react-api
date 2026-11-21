import { useRef, useState } from 'react';
import { iconos } from '../assets';
import { TIPOS_POKEMON } from '../data/tipos';
import PokemonCard from '../components/PokemonCard';

const PAGINA_TAMANO = 20;

function CatalogoScreen({
  tema,
  region,
  pokemones,
  totalRegion,
  cargando,
  error,
  progreso,
  busqueda,
  onBusquedaChange,
  filtroTipo,
  onFiltroTipoChange,
  soloFavoritos,
  onSoloFavoritosChange,
  onRestablecer,
  esFavorito,
  onToggleFavorito,
  onOpen,
  onOpenRegion,
  onReintentar,
  buscandoExterno,
  titulo,
  descripcion,
  mostrarTipos = true,
  mostrarToggleFavoritos = true,
  inputRef,
}) {
  const iconosTema = iconos[tema] || iconos.claro;
  const catalogoRef = useRef(null);
  const [pagina, setPagina] = useState(0);

  const nombreRegion = region?.nombre || 'Kanto';
  const total = totalRegion || 0;
  const totalPaginas = Math.max(1, Math.ceil(pokemones.length / PAGINA_TAMANO));
  const paginaActual = Math.min(pagina, totalPaginas - 1);
  const inicio = paginaActual * PAGINA_TAMANO;
  const pokemonesVisibles = pokemones.slice(inicio, inicio + PAGINA_TAMANO);

  const irAPagina = (nuevaPagina) => {
    const siguiente = Math.max(0, Math.min(nuevaPagina, totalPaginas - 1));
    setPagina(siguiente);
    const reduceMotion = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    catalogoRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const handleBusqueda = (valor) => {
    setPagina(0);
    onBusquedaChange(valor);
  };

  const handleFiltroTipo = (tipo) => {
    setPagina(0);
    onFiltroTipoChange(tipo);
  };

  const handleSoloFavoritos = (valor) => {
    setPagina(0);
    onSoloFavoritosChange(valor);
  };

  const handleRestablecer = () => {
    setPagina(0);
    onRestablecer();
  };

  const contador = cargando && pokemones.length === 0
    ? `Cargando ${nombreRegion}...`
    : `${pokemones.length} de ${total} en ${nombreRegion}`;

  const rangoInicio = pokemones.length === 0 ? 0 : inicio + 1;
  const rangoFin = inicio + pokemonesVisibles.length;

  return (
    <main className="screen screen-transition">
      <div className="body body--catalogo">
        <aside className="catalog-sidebar">
          <div className="intro">
            <div className="intro-title">
              <div className="intro-title__row">
                <h2>{titulo || 'Todos los Pokémon'}</h2>
                {typeof onOpenRegion === 'function' && (
                  <button
                    className="region-badge region-badge--inline"
                    type="button"
                    onClick={onOpenRegion}
                    aria-label={`Cambiar región, actual ${nombreRegion}`}
                  >
                    <img src={iconosTema.mapPin} alt="" />
                    <span>{nombreRegion}</span>
                  </button>
                )}
              </div>
              <p>{descripcion || 'Explora las especies registradas, filtra por tipo y busca cualquier Pokémon por nombre o número.'}</p>
            </div>

            <label className="search-field">
              <img src={iconosTema.searchField} alt="" />
              <input
                ref={inputRef}
                type="search"
                value={busqueda}
                onChange={(e) => handleBusqueda(e.target.value)}
                placeholder="Buscar Pokémon..."
                aria-label="Buscar Pokémon por nombre o número"
              />
            </label>
          </div>

          <section className="filters" aria-label="Filtros del catálogo">
            {mostrarTipos && (
              <>
                <h3 className="filters-title">Filtrar por tipo</h3>
                <div className="chips-row" role="group" aria-label="Filtros por tipo">
                  {TIPOS_POKEMON.map((tipo) => (
                    <button
                      key={tipo}
                      type="button"
                      className={`chip ${filtroTipo === tipo ? 'is-active' : ''}`}
                      onClick={() => handleFiltroTipo(tipo)}
                      aria-pressed={filtroTipo === tipo}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="filters-actions">
              <span className="results-counter">
                {contador}
                {progreso?.total > 0 && progreso.cargados < progreso.total && ` · Tipos ${progreso.cargados}/${progreso.total}`}
                {buscandoExterno && ' · Buscando en la PokéAPI...'}
              </span>
              {mostrarToggleFavoritos && (
                <button
                  type="button"
                  className={`chip ${soloFavoritos ? 'is-active' : ''}`}
                  onClick={() => handleSoloFavoritos(!soloFavoritos)}
                  aria-pressed={soloFavoritos}
                >
                  Solo favoritos
                </button>
              )}
              <button type="button" className="btn btn--secondary" onClick={handleRestablecer}>
                Restablecer
              </button>
            </div>
          </section>
        </aside>

        <div className="catalog-main" ref={catalogoRef}>
          {error && (
            <div className="status-card error">
              <p>{error}</p>
              <button type="button" className="btn btn--secondary" onClick={onReintentar}>
                Reintentar carga
              </button>
            </div>
          )}

          {cargando && pokemones.length === 0 ? (
            <div className="catalog" aria-live="polite">
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="pokemon-card skeleton-card" key={`sk-${i}`} style={{ '--animation-index': i }}>
                  <div className="skeleton-block skeleton-image" />
                  <div className="skeleton-line title" />
                  <div className="skeleton-line short" />
                </div>
              ))}
            </div>
          ) : pokemones.length > 0 ? (
            <>
              <section className="catalog" aria-label="Listado de Pokémon">
                {pokemonesVisibles.map((pokemon, index) => (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    tema={tema}
                    indice={index}
                    esFavorito={esFavorito(pokemon.id)}
                    onToggleFavorito={onToggleFavorito}
                    onOpen={onOpen}
                  />
                ))}
              </section>

              {totalPaginas > 1 && (
                <nav className="pagination" aria-label="Paginación del catálogo">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => irAPagina(paginaActual - 1)}
                    disabled={paginaActual === 0}
                  >
                    Anterior
                  </button>
                  <div className="pagination__info">
                    <span>Página {paginaActual + 1} de {totalPaginas}</span>
                    <span className="pagination__range">Mostrando {rangoInicio}–{rangoFin} de {pokemones.length} Pokémon</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => irAPagina(paginaActual + 1)}
                    disabled={paginaActual >= totalPaginas - 1}
                  >
                    Siguiente
                  </button>
                </nav>
              )}
            </>
          ) : buscandoExterno ? (
            <div className="status-card">
              <p>Buscando &quot;{busqueda}&quot; en la PokéAPI...</p>
            </div>
          ) : (
            <div className="empty-state">
              <strong>Sin resultados</strong>
              <span>
                {busqueda || filtroTipo !== 'Todos' || soloFavoritos
                  ? 'No hay Pokémon que coincidan con los filtros actuales en esta región.'
                  : 'No hay Pokémon disponibles para mostrar.'}
              </span>
              <button type="button" className="btn btn--secondary" onClick={handleRestablecer}>
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default CatalogoScreen;
