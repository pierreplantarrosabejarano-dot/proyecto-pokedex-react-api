import { useState, useEffect } from 'react';
import Header from './components/Header';
import PokemonCard from './components/PokemonCard';

const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=20';

function App() {
  // 2. Los tres estados solicitados: datos, cargando y error
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estados de interacción del usuario
  const [busqueda, setBusqueda] = useState('');
  const [favoritos, setFavoritos] = useState([]);

  // Función de carga reutilizable (para useEffect y botón de reintento)
  const cargarPokemones = async () => {
    try {
      setCargando(true);
      setError(null);

      // 1. Cargar los datos de la API con fetch
      const respuesta = await fetch(API_URL);
      if (!respuesta.ok) {
        throw new Error(`Error del servidor (${respuesta.status})`);
      }
      const json = await respuesta.json();

      // Obtener detalles completos (id, tipos e imagen) para cada elemento
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

  // 1. Ejecutar fetch dentro de useEffect al montar el componente
  useEffect(() => {
    cargarPokemones();
  }, []);

  const toggleFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter((favId) => favId !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

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

        {/* 4. Mensaje exacto de carga */}
        {cargando && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2c3e50' }}>
              Cargando...
            </p>
          </div>
        )}

        {/* 4. Mensaje de error amigable */}
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

        {/* 3. Renderizar la lista con .map() y key único (el id) */}
        {!cargando && !error && (
          <section className="pokedex-grid">
            {datosFiltrados.map((pokemon) => (
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
