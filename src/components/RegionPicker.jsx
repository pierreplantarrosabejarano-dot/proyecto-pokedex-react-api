import { useEffect } from 'react';

function RegionPicker({ abierto, regiones, regionActivaId, onSelect, onClose }) {
  useEffect(() => {
    if (!abierto) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [abierto, onClose]);

  if (!abierto) return null;

  return (
    <div className="region-modal" role="presentation" onClick={onClose}>
      <div
        className="region-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Seleccionar región"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="region-modal__header">
          <div>
            <h2>Regiones</h2>
            <p>Explora Pokémon por generación o Pokédex especial.</p>
          </div>
          <button type="button" className="btn btn--secondary region-modal__close" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className="region-list" role="list">
          {regiones.map((region) => {
            const activa = region.id === regionActivaId;
            return (
              <button
                key={region.id}
                type="button"
                className={`region-option ${activa ? 'is-active' : ''}`}
                onClick={() => onSelect?.(region.id)}
                aria-pressed={activa}
              >
                <div className="region-option__main">
                  <strong>{region.nombre}</strong>
                  <span>{region.generacion}</span>
                </div>
                <div className="region-option__meta">
                  <span className="region-option__count">{region.cantidad} especies</span>
                  {activa && <span className="region-option__badge">Activa</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RegionPicker;
