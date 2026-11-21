import { iconos } from '../assets';
import { formatearNumeroPokemon } from '../utils/pokemonUtils';
import FavoriteButton from '../components/FavoriteButton';

function InicioScreen({
  tema,
  region,
  destacado,
  cargando,
  error,
  progreso,
  esFavorito,
  onToggleFavorito,
  onCapturar,
  onVerDetalle,
  onExplorar,
  onIrACatalogo,
  onOpenRegion,
  onReintentar,
}) {
  const iconosTema = iconos[tema] || iconos.claro;
  const cantidad = region?.cantidad || 0;

  return (
    <main className="screen screen--inicio screen-transition">
      <section className="hero hero--inicio">
        <div className="hero-top">
          <h2>¡Vamos a explorar!</h2>
          <button
            className="region-badge hero-region-btn"
            type="button"
            onClick={onOpenRegion}
            aria-label={`Cambiar región, actual ${region?.nombre || 'Kanto'}`}
          >
            <img src={iconosTema.mapPin} alt="" />
            <span>{region?.nombre || 'Kanto'}</span>
          </button>
        </div>
        <div className="hero-bottom">
          <span>{cantidad} especies registradas</span>
          <button className="hero-filter" type="button" onClick={onIrACatalogo} aria-label="Ver filtros del catálogo">
            <img src={iconosTema.sliders} alt="" />
          </button>
        </div>
      </section>

      <div className="body body--inicio">
        <div className="inicio-sidebar">
          <div className="intro">
            <h2>Encuentra tu pokemon favorito</h2>
            <p>Explora nuestro catálogo de pokémons con datos en vivo desde la PokéAPI.</p>
          </div>

          <button className="btn btn--primary btn--full" type="button" onClick={onExplorar}>
            Explorar Pokédex
          </button>

          {error && !destacado && (
            <div className="status-card error">
              <p>{error}</p>
              <button type="button" className="btn btn--secondary" onClick={onReintentar}>
                Reintentar carga
              </button>
            </div>
          )}

          {cargando && !destacado && (
            <div className="status-card skeleton-card" aria-live="polite">
              <div className="skeleton-block skeleton-image" style={{ maxWidth: 160, margin: '0 auto 12px' }} />
              <div className="skeleton-line title" />
              <div className="skeleton-line short" />
              <p style={{ marginTop: 12 }}>
                Cargando {region?.nombre || 'región'}...
                {progreso?.total ? ` ${progreso.cargados}/${progreso.total}` : ''}
              </p>
            </div>
          )}
        </div>

        {destacado && (
          <section className="featured">
            <div className="featured-header">
              <h2>Pokémon destacado</h2>
              <span className="type-chip">
                <img src={iconosTema.leaf} alt="" />
                {destacado.tipoTexto || (destacado.tipos || []).join(' / ') || 'Tipo'}
              </span>
            </div>

            <article className="featured-card screen-transition">
              <div className="featured-card__info">
                <div className="featured-card__meta">
                  <div className="featured-card__title">
                    <span className="featured-card__number">{formatearNumeroPokemon(destacado.id)}</span>
                    <h3>{destacado.nombre}</h3>
                  </div>
                  <FavoriteButton
                    activo={esFavorito?.(destacado.id)}
                    onToggle={() => onToggleFavorito?.(destacado.id)}
                    tema={tema}
                    tamaño="chico"
                    nombre={destacado.nombre}
                  />
                </div>

                <div className="featured-card__types" aria-label="Tipos">
                  {(destacado.tipos?.length ? destacado.tipos : [destacado.tipoTexto || 'Cargando tipo...']).map((tipo) => (
                    <span key={tipo} className="featured-card__type">{tipo}</span>
                  ))}
                </div>

                <div className="featured-card__facts" aria-label="Datos rápidos del Pokémon destacado">
                  <div className="featured-card__fact">
                    <span>Altura</span>
                    <strong>{destacado.altura || '…'}</strong>
                  </div>
                  <div className="featured-card__fact">
                    <span>Peso</span>
                    <strong>{destacado.peso || '…'}</strong>
                  </div>
                  <div className="featured-card__fact">
                    <span>Habilidad</span>
                    <strong>{(destacado.habilidades || [])[0] || '…'}</strong>
                  </div>
                </div>

                <div className="featured-card__stats" aria-label="Estadísticas destacadas">
                  {['hp', 'attack', 'defense', 'speed'].map((clave) => {
                    const stat = (destacado.stats || []).find((s) => s.clave === clave);
                    const valor = stat?.valor ?? null;
                    const ancho = valor != null ? Math.min(100, Math.round((valor / 255) * 100)) : 0;
                    return (
                      <div key={clave} className="featured-card__stat">
                        <div className="featured-card__stat-meta">
                          <span>{stat?.nombre || ({ hp: 'PS', attack: 'Ataque', defense: 'Defensa', speed: 'Velocidad' }[clave])}</span>
                          <strong>{valor ?? '…'}</strong>
                        </div>
                        <div className="featured-card__stat-track" aria-hidden="true">
                          <div className="featured-card__stat-fill" style={{ '--stat-width': `${ancho}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="featured-card__actions">
                  <button className="btn btn--primary" type="button" onClick={() => onCapturar(destacado)}>
                    Capturar
                  </button>
                  <button className="btn btn--secondary" type="button" onClick={() => onVerDetalle(destacado)}>
                    Detalles
                  </button>
                </div>
              </div>

              <div className="featured-card__stage" aria-hidden="true">
                <span className="featured-card__watermark">{formatearNumeroPokemon(destacado.id)}</span>
                <div className="featured-card__stage-glow" />
                <img src={destacado.imagen} alt="" className="featured-card__image" loading="lazy" />
              </div>
            </article>
          </section>
        )}

        {progreso?.total > 0 && progreso.cargados < progreso.total && destacado && (
          <p className="progress-note" aria-live="polite">
            Cargando tipos: {progreso.cargados}/{progreso.total}
          </p>
        )}
      </div>
    </main>
  );
}

export default InicioScreen;
