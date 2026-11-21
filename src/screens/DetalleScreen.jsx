import { iconos } from '../assets';
import { formatearNumeroPokemon } from '../utils/pokemonUtils';
import FavoriteButton from '../components/FavoriteButton';
import PokemonCard from '../components/PokemonCard';

function DetalleScreen({
  tema,
  region,
  pokemon,
  cargando,
  error,
  esFavorito,
  onToggleFavorito,
  onCapturar,
  onVolver,
  relacionados = [],
  onOpenRelacionado,
}) {
  const iconosTema = iconos[tema] || iconos.claro;
  const nombreRegion = region?.nombre || 'Región';

  if (cargando) {
    return (
      <main className="screen screen-transition">
        <div className="body body--detalle">
          <button type="button" className="btn btn--primary btn--full" onClick={onVolver}>
            Volver al catálogo
          </button>
          <div className="status-card skeleton-card" style={{ gridColumn: '1 / -1' }}>
            <div className="skeleton-block skeleton-image" style={{ maxWidth: 240, margin: '0 auto 16px' }} />
            <div className="skeleton-line title" />
            <div className="skeleton-line short" />
            <p style={{ marginTop: 12 }}>Cargando detalle...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !pokemon) {
    return (
      <main className="screen screen-transition">
        <div className="body body--detalle">
          <button type="button" className="btn btn--primary btn--full" onClick={onVolver}>
            Volver al catálogo
          </button>
          <div className="status-card error" style={{ gridColumn: '1 / -1' }}>
            <p>{error || 'No se pudo cargar el detalle del Pokémon.'}</p>
          </div>
        </div>
      </main>
    );
  }

  const numero = formatearNumeroPokemon(pokemon.id);
  const stats = pokemon.stats || [];
  const tipos = pokemon.tipos || [];
  const relacionadosVisibles = relacionados.slice(0, 2);

  return (
    <main className="screen screen-transition">
      <div className="body body--detalle">
        <button type="button" className="btn btn--primary btn--full detail-back" onClick={onVolver}>
          Volver al catálogo
        </button>

        <div className="detail-layout">
          <section className="detail-hero">
            <div className="detail-hero__top">
              <h2>Detalle del Pokémon</h2>
              <span className="region-badge region-badge--static">
                <img src={iconosTema.mapPin} alt="" />
                {nombreRegion}
              </span>
            </div>
            <div className="detail-hero__main">
              <div className="detail-meta">
                <span>{numero}</span>
                <h3>{pokemon.nombre}</h3>
                <div className="detail-types">
                  {tipos.map((tipo) => (
                    <span key={tipo}>{tipo}</span>
                  ))}
                </div>
              </div>
              <img
                src={pokemon.imagen}
                alt={pokemon.nombre}
                className="detail-image detail-image--contain"
              />
              <FavoriteButton
                activo={esFavorito(pokemon.id)}
                onToggle={() => onToggleFavorito(pokemon.id)}
                tema={tema}
                nombre={pokemon.nombre}
              />
              <button type="button" className="btn btn--primary btn--full" onClick={() => onCapturar(pokemon)}>
                Capturar
              </button>
            </div>
          </section>

          <div className="detail-panels">
            <section className="panel info-basic">
              <h2>Información básica</h2>
              <div className="info-grid">
                <div className="info-cell"><span>Altura</span><strong>{pokemon.altura || '—'}</strong></div>
                <div className="info-cell"><span>Peso</span><strong>{pokemon.peso || '—'}</strong></div>
                <div className="info-cell"><span>Categoría</span><strong>{pokemon.categoria || 'Pokémon'}</strong></div>
                <div className="info-cell"><span>Habilidad</span><strong>{(pokemon.habilidades || [])[0] || '—'}</strong></div>
              </div>
            </section>

            {stats.length > 0 && (
              <section className="panel stats">
                <h2>Estadísticas base</h2>
                <div className="stats-list">
                  {stats.map((stat, i) => (
                    <div key={stat.clave || stat.nombre} className="stat">
                      <div className="stat-meta">
                        <span>{stat.nombre}</span>
                        <strong>{stat.valor}</strong>
                      </div>
                      <div className="stat-track" aria-hidden="true">
                        <div
                          className="stat-fill"
                          style={{
                            '--stat-width': `${Math.min(100, Math.round((stat.valor / 255) * 100))}%`,
                            '--animation-index': i,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="panel description">
              <h2>Descripción</h2>
              <p>{pokemon.descripcion || 'Descripción no disponible por el momento.'}</p>
            </section>
          </div>
        </div>

        {relacionadosVisibles.length > 0 && (
          <section className="related">
            <h2>Pokémon relacionados</h2>
            <div className={`related-row ${relacionadosVisibles.length === 1 ? 'related-row--1' : ''}`}>
              {relacionadosVisibles.map((rel, index) => (
                <PokemonCard
                  key={rel.id}
                  pokemon={rel}
                  tema={tema}
                  indice={index}
                  esFavorito={esFavorito(rel.id)}
                  onToggleFavorito={onToggleFavorito}
                  onOpen={onOpenRelacionado}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default DetalleScreen;
