import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import PokemonCard from './PokemonCard';
import { FavoritosProvider } from '../context/FavoritosContext';

describe('Pruebas de integración del componente PokemonCard', () => {
  const mockPokemon = {
    id: 1,
    nombre: 'Bulbasaur',
    tipo: 'grass / poison',
    imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  };

  it('renderiza el nombre, número y tipo del Pokémon correctamente', () => {
    render(
      <FavoritosProvider>
        <PokemonCard {...mockPokemon} />
      </FavoritosProvider>
    );

    // Paso 3: Verificación con getByText y getByRole
    expect(screen.getByText('#001 Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('grass / poison')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Agregar a favoritos/i })).toBeInTheDocument();
  });

  it('cambia el estado visual del botón al hacer clic con userEvent', async () => {
    const user = userEvent.setup();

    render(
      <FavoritosProvider>
        <PokemonCard {...mockPokemon} />
      </FavoritosProvider>
    );

    const botonFavorito = screen.getByRole('button', { name: /Agregar a favoritos/i });

    // Paso 4: Simular clic con userEvent y verificar el cambio
    await user.click(botonFavorito);

    expect(screen.getByRole('button', { name: /★ Favorito/i })).toBeInTheDocument();
  });
});
