import { useEffect, useRef, useState } from 'react';
import { iconos } from '../assets';

function FavoriteButton({
  activo,
  onToggle,
  tema = 'claro',
  tamaño = 'grande',
  grande = false,
  className = '',
  ariaLabel,
  nombre = 'este Pokémon',
}) {
  const iconosTema = iconos[tema] || iconos.claro;
  const [saltando, setSaltando] = useState(false);
  const temporizador = useRef(null);
  const esGrande = grande || tamaño === 'grande';

  useEffect(() => {
    return () => {
      if (temporizador.current) {
        window.clearTimeout(temporizador.current);
      }
    };
  }, []);

  const etiqueta = ariaLabel || (activo ? '★ Favorito' : '☆ Agregar a favoritos');
  const icono = activo
    ? esGrande
      ? iconosTema.heartActive32
      : iconosTema.heartActive18
    : esGrande
      ? iconosTema.heart32
      : iconosTema.heart18;

  const manejarClick = (evento) => {
    setSaltando(true);
    if (temporizador.current) {
      window.clearTimeout(temporizador.current);
    }
    temporizador.current = window.setTimeout(() => setSaltando(false), 280);
    onToggle?.(evento);
  };

  return (
    <button
      className={`favorite-button ${esGrande ? '' : 'favorite-button--chico'} ${activo ? 'is-active' : ''} ${saltando ? 'is-popping' : ''} ${className}`.trim()}
      type="button"
      aria-pressed={activo}
      aria-label={etiqueta}
      title={activo ? `Quitar ${nombre} de favoritos` : `Agregar ${nombre} a favoritos`}
      onClick={manejarClick}
    >
      <img src={icono} alt="" aria-hidden="true" />
      <span className="sr-only">{etiqueta}</span>
    </button>
  );
}

export default FavoriteButton;
