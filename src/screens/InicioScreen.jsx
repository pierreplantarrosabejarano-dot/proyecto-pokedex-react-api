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
              <img src={destacado.imagen} alt={destacado.nombre} className="featured-card__image" loading="lazy" />
              <div className="featured-card__info">
                <div className="featured-card__meta">
                  <h3>{`${formatearNumeroPokemon(destacado.id)} ${destacado.nombre}`}</h3>
                  <FavoriteButton
                    activo={esFavorito?.(destacado.id)}
                    onToggle={() => onToggleFavorito?.(destacado.id)}
                    tema={tema}
                    tamaño="chico"
                    nombre={destacado.nombre}
                  />
                </div>
                <p>{destacado.tipoTexto || 'Cargando tipo...'}</p>
                <div className="featured-card__facts" aria-label="Datos rápidos del Pokémon destacado">
                  <div className="featured-card__fact">
                    <span>Altura</span>
                    <strong>{destacado.altura || '—'}</strong>
                  </div>
                  <div className="featured-card__fact">
                    <span>Peso</span>
                    <strong>{destacado.peso || '—'}</strong>
                  </div>
                  <div className="featured-card__fact">
                    <span>Habilidad</span>
                    <strong>{(destacado.habilidades || [])[0] || '—'}</strong>
                  </div>
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
