import { useState, useEffect } from 'react';
import Header from './components/Header';
import PokemonCard from './components/PokemonCard';

const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=20';

function App() {
  // Estados para datos de la API, carga y error (Pasos 3 y 4)
  const [pokemones, setPokemones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estados de interacción heredados de la etapa anterior
  const [busqueda, setBusqueda] = useState('');
  const [favoritos, setFavoritos] = useState([]);

  // Paso 2 y 3: Consumo de API con useEffect
  useEffect(() => {
    const obtenerPokemones = async () => {
      try {
        setCargando(true);
        setError(null);

        // 1. Petición GET principal
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        const data = await res.json();

        // Paso 2: Mostrar los datos crudos en la consola
        console.log('Datos obtenidos de PokéAPI (res.json()):', data);

        // 2. Obtener detalles (id, tipos e imagen) de cada Pokémon de la lista
        const detallesPromesas = data.results.map(async (poke) => {
          const resDetalle = await fetch(poke.url);
          const detalle = await resDetalle.json();
          return {
            id: detalle.id,
            nombre: detalle.name.charAt(0).toUpperCase() + detalle.name.slice(1),
            tipo: detalle.types.map((t) => t.type.name).join(' / '),
            imagen: detalle.sprites.front_default
          };
        });

        const listaCompleta = await Promise.all(detallesPromesas);
        setPokemones(listaCompleta);
      } catch (err) {
        console.error('Error al consumir la API:', err);
        setError('No se pudieron cargar los Pokémon. Verifica tu conexión e intenta nuevamente.');
      } finally {
        setCargando(false);
      }
    };

    obtenerPokemones();
  }, []);

  const toggleFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter((favId) => favId !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

  const pokemonesFiltrados = pokemones.filter((pokemon) =>
    pokemon.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <Header />

      <main className="main-content">
        <section className="hero-section">
          <h2>Pokédex Conectada a PokéAPI</h2>
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

        {/* Paso 4: Renderizado condicional para Carga y Error */}
        {cargando && (
          <p style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Cargando Pokémon desde la API...
          </p>
        )}

        {error && (
          <p style={{ textAlign: 'center', color: '#ef5350', fontWeight: 'bold' }}>
            {error}
          </p>
        )}

        {/* Paso 3: Renderizado de la lista obtenida */}
        {!cargando && !error && (
          <section className="pokedex-grid">
            {pokemonesFiltrados.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                id={pokemon.id}
                nombre={pokemon.nombre}
                tipo={pokemon.tipo}
                imagen={pokemon.imagen}
                esFavorito={favoritos.includes(pokemon.id)}
                onToggleFavorito={toggleFavorito}
              />
            ))}
          </section>
        )}
      </main>
    </>
  );
}

export default App;
