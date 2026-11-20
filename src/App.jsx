import { useState, useEffect } from 'react';
import Header from './components/Header';
import PokemonCard from './components/PokemonCard';
import { useFavoritos } from './context/FavoritosContext';

const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=20';

function App() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  // Leemos favoritos desde el contexto global
  const { favoritos } = useFavoritos();

  const cargarPokemones = async () => {
    try {
      setCargando(true);
      setError(null);

      const respuesta = await fetch(API_URL);
      if (!respuesta.ok) {
        throw new Error(`Error del servidor (${respuesta.status})`);
      }
      const json = await respuesta.json();

      const listaDetallada = await Promise.all(
        json.results.map(async (item) => {
          const resDetalle = await fetch(item.url);
          const detalle = await resDetalle.json();
          return {
            id: detalle.id,
            nombre: detalle.name.charAt(0).toUpperCase() + detalle.name.slice(1),
            tipo: detalle.types.map((t) => t.type.name).join(' / '),
            imagen: detalle.sprites.front_default
          };
        })
      );

      setDatos(listaDetallada);
    } catch (err) {
      setError('¡Ups! No pudimos conectar con la PokéAPI en este momento. Revisa tu conexión a internet e inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPokemones();
  }, []);

  const datosFiltrados = datos.filter((pokemon) =>
    pokemon.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <Header />

      <main className="main-content">
        <section className="hero-section">
          <h2>Pokédex en Vivo</h2>
          <p>Favoritos seleccionados: <strong>{favoritos.length}</strong></p>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <input
              type="text"
              placeholder="Buscar Pokémon por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', width: '250px' }}
            />
            <button
              onClick={() => setBusqueda('')}
              style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', backgroundColor: '#ef5350', color: 'white', cursor: 'pointer' }}
            >
              Limpiar
            </button>
          </div>
        </section>

        {cargando && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2c3e50' }}>
              Cargando...
            </p>
          </div>
        )}

        {error && (
          <div
            style={{
              textAlign: 'center',
              padding: '1.5rem',
              backgroundColor: '#fee2e2',
              border: '1px solid #ef5350',
              borderRadius: '10px',
              maxWidth: '500px',
              margin: '1rem auto',
              color: '#991b1b'
            }}
          >
            <p style={{ marginBottom: '1rem', fontWeight: '500' }}>{error}</p>
            <button
              onClick={cargarPokemones}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#ef5350',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Reintentar carga
            </button>
          </div>
        )}

        {/* Renderizado limpio sin prop drilling de favoritos */}
        {!cargando && !error && (
          <section className="pokedex-grid">
            {datosFiltrados.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                id={pokemon.id}
                nombre={pokemon.nombre}
                tipo={pokemon.tipo}
                imagen={pokemon.imagen}
              />
            ))}
          </section>
        )}
      </main>
    </>
  );
}

export default App;
