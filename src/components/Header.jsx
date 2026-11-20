import { useFavoritos } from '../context/FavoritosContext';

function Header() {
  const { favoritos } = useFavoritos();

  return (
    <header className="header">
      <h1>Pokédex Virtual</h1>
      <p>Proyecto React - Programación Web I | ★ Favoritos: <strong>{favoritos.length}</strong></p>
    </header>
  );
}

export default Header;
