export const REGIONES = [
  { id: 'kanto', nombre: 'Kanto', generacion: 'Generación I', fuente: 'generation', fuenteId: 1, cantidad: 151 },
  { id: 'johto', nombre: 'Johto', generacion: 'Generación II', fuente: 'generation', fuenteId: 2, cantidad: 100 },
  { id: 'hoenn', nombre: 'Hoenn', generacion: 'Generación III', fuente: 'generation', fuenteId: 3, cantidad: 135 },
  { id: 'sinnoh', nombre: 'Sinnoh', generacion: 'Generación IV', fuente: 'generation', fuenteId: 4, cantidad: 107 },
  { id: 'teselia', nombre: 'Teselia', generacion: 'Generación V', fuente: 'generation', fuenteId: 5, cantidad: 156 },
  { id: 'kalos', nombre: 'Kalos', generacion: 'Generación VI', fuente: 'generation', fuenteId: 6, cantidad: 72 },
  { id: 'alola', nombre: 'Alola', generacion: 'Generación VII', fuente: 'generation', fuenteId: 7, cantidad: 88 },
  { id: 'galar', nombre: 'Galar', generacion: 'Generación VIII', fuente: 'generation', fuenteId: 8, cantidad: 96 },
  { id: 'paldea', nombre: 'Paldea', generacion: 'Generación IX', fuente: 'generation', fuenteId: 9, cantidad: 120 },
  { id: 'hisui', nombre: 'Hisui', generacion: 'Leyendas: Arceus', fuente: 'pokedex', fuenteId: 'hisui', cantidad: 242 },
];

export const REGION_POR_DEFECTO = REGIONES[0];

export function obtenerRegion(id) {
  return REGIONES.find((region) => region.id === id) || REGION_POR_DEFECTO;
}
