import { describe, it, expect } from 'vitest';
import { formatearNumeroPokemon, filtrarPokemones } from './pokemonUtils';

describe('Pruebas unitarias de pokemonUtils', () => {
  it('formatea correctamente el ID con ceros a la izquierda', () => {
    expect(formatearNumeroPokemon(1)).toBe('#001');
    expect(formatearNumeroPokemon(25)).toBe('#025');
    expect(formatearNumeroPokemon(150)).toBe('#150');
  });

  it('filtra la lista de Pokémon por nombre sin importar mayúsculas/minúsculas', () => {
    const mockLista = [
      { id: 1, nombre: 'Bulbasaur' },
      { id: 4, nombre: 'Charmander' },
      { id: 25, nombre: 'Pikachu' },
    ];

    const resultado = filtrarPokemones(mockLista, 'pika');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].nombre).toBe('Pikachu');
  });
});
