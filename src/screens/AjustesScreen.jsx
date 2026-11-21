const TEMAS = [
  {
    id: 'oscuro',
    nombre: 'Oscuro',
    descripcion: 'Fondos profundos y contraste suave para explorar de noche.',
    swatches: ['#101721', '#1d2938', '#c23b40'],
  },
  {
    id: 'claro',
    nombre: 'Claro',
    descripcion: 'Superficies blancas y lectura luminosa.',
    swatches: ['#f4f5f7', '#ffffff', '#b93638'],
  },
  {
    id: 'calido',
    nombre: 'Cálido',
    descripcion: 'Crema, arena y terracota inspirados en la Pokédex clásica.',
    swatches: ['#f4e8d7', '#fffaf0', '#9b4225'],
  },
];

function AjustesScreen({ tema, onTemaChange, onVolver }) {
  return (
    <main className="screen screen-transition">
      <div className="body body--simple body--ajustes">
        <h2>Ajustes</h2>
        <p>Personaliza la apariencia de tu Pokédex.</p>
        <h3>Tema de la aplicación</h3>

        <div className="theme-list" role="group" aria-label="Tema de la aplicación">
          {TEMAS.map((opcion, indice) => {
            const activo = tema === opcion.id;
            return (
              <button
                key={opcion.id}
                type="button"
                className={`theme-card${activo ? ' is-active' : ''}`}
                style={{ '--animation-index': indice }}
                onClick={() => onTemaChange(opcion.id)}
                aria-pressed={activo}
              >
                <span className="theme-card__title">
                  <strong>{opcion.nombre}</strong>
                  {activo && <span className="theme-card__badge">Activo</span>}
                </span>
                <span className="theme-card__description">{opcion.descripcion}</span>
                <span className="theme-card__palette" aria-hidden="true">
                  {opcion.swatches.map((color) => (
                    <span key={color} style={{ backgroundColor: color }} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>

        <div className="session-card">
          <strong>Sin perder tu progreso</strong>
          <p>Cambiar el tema conserva tus favoritos, filtros y capturas durante esta sesión.</p>
        </div>

        <button type="button" className="btn btn--primary btn--full" onClick={onVolver}>
          Volver a mi pantalla
        </button>
      </div>
    </main>
  );
}

export default AjustesScreen;
