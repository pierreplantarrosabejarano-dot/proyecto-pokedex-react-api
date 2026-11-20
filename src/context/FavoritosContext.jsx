import { createContext, useState, useContext } from 'react';

const FavoritosContext = createContext();

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState([]);

  const toggleFavorito = (id) => {
    setFavoritos((prevFavoritos) =>
      prevFavoritos.includes(id)
        ? prevFavoritos.filter((favId) => favId !== id)
        : [...prevFavoritos, id]
    );
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos debe usarse dentro de un FavoritosProvider');
  }
  return context;
}
