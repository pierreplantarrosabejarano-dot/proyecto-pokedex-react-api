import { formatearNumeroPokemon } from '../utils/pokemonUtils';
import { useFavoritos } from '../context/FavoritosContext';
import FavoriteButton from './FavoriteButton';

function PokemonCard({
  pokemon,
  id,
  nombre,
  tipo,
  imagen,
  tema = 'claro',
  esFavorito,
  onToggleFavorito,
  onOpen,
  onSelect,
  indice = 0,
  index = 0,
}) {
  const favoritosCtx = useFavoritos();
  const data = pokemon || { id, nombre, tipoTexto: tipo, imagen };
  const pokeId = data.id ?? id;
  const pokeNombre = data.nombre ?? nombre ?? 'Pokémon';
  const pokeTipo = data.tipoTexto ?? data.tipo ?? tipo ?? 'Cargando tipo...';
  const pokeImagen = data.imagen ?? imagen;
  const numero = formatearNumeroPokemon(pokeId);

  const favorito =
    typeof esFavorito === 'boolean' ? esFavorito : favoritosCtx.favoritos.includes(pokeId);
  const toggle =
    typeof onToggleFavorito === 'function' ? onToggleFavorito : favoritosCtx.toggleFavorito;

  const handleOpen = () => {
    if (onOpen) onOpen(data);
    else if (onSelect) onSelect(pokeId);
  };

  const handleToggle = (e) => {
    e?.stopPropagation?.();
    toggle(pokeId);
  };

  const animationIndex = typeof indice === 'number' ? indice : index;

  return (
    <article
      className="pokemon-card"
      style={{ '--animation-index': animationIndex }}
    >
      <button
        type="button"
        className="pokemon-card__open"
        onClick={handleOpen}
        aria-label={`Ver detalle de ${pokeNombre}`}
      >
        <span className="pokemon-card__image-wrap">
          <img
            className="pokemon-card__image pokemon-card__image--contain"
            src={pokeImagen}
            alt={pokeNombre}
            loading="lazy"
          />
        </span>
        <span className="pokemon-card__meta">
          <strong>{`${numero} ${pokeNombre}`}</strong>
          <span>{pokeTipo}</span>
        </span>
      </button>
      <FavoriteButton
        activo={favorito}
        tamaño="chico"
        tema={tema}
        nombre={pokeNombre}
        onToggle={handleToggle}
      />
    </article>
  );
}

export default PokemonCard;
