export const TIPOS_POKEMON = [
  'Todos',
  'Planta',
  'Veneno',
  'Fuego',
  'Agua',
  'Eléctrico',
  'Normal',
  'Hada',
  'Lucha',
  'Volador',
  'Bicho',
  'Roca',
  'Tierra',
  'Psíquico',
  'Hielo',
  'Dragón',
  'Fantasma',
  'Siniestro',
  'Acero',
];

export const TIPO_TRADUCCIONES = {
  grass: 'Planta',
  poison: 'Veneno',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  normal: 'Normal',
  fairy: 'Hada',
  fighting: 'Lucha',
  flying: 'Volador',
  bug: 'Bicho',
  rock: 'Roca',
  ground: 'Tierra',
  psychic: 'Psíquico',
  ice: 'Hielo',
  dragon: 'Dragón',
  ghost: 'Fantasma',
  dark: 'Siniestro',
  steel: 'Acero',
};

export function traducirTipo(tipo = '') {
  const clave = String(tipo).toLowerCase();
  return TIPO_TRADUCCIONES[clave] || (tipo ? tipo.charAt(0).toUpperCase() + tipo.slice(1) : '');
}

export function traducirTipos(tipos = []) {
  return tipos.map(traducirTipo).filter(Boolean);
}
