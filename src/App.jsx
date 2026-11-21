import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AppHeader from './components/AppHeader';
import RegionPicker from './components/RegionPicker';
import { useFavoritos } from './context/FavoritosContext';
import { REGIONES, REGION_POR_DEFECTO, obtenerRegion } from './data/regiones';
import {
  hidratarPokemonesEnLotes,
  obtenerDetallePokemon,
  obtenerListaRegion,
  obtenerPokemonPorIdONombre,
} from './services/pokeapi';
import { filtrarPokemones, normalizarTexto } from './utils/pokemonUtils';
import AcercaScreen from './screens/AcercaScreen';
import AjustesScreen from './screens/AjustesScreen';
import BuscarScreen from './screens/BuscarScreen';
import CapturaScreen from './screens/CapturaScreen';
import CatalogoScreen from './screens/CatalogoScreen';
import DetalleScreen from './screens/DetalleScreen';
import InicioScreen from './screens/InicioScreen';
import MenuScreen from './screens/MenuScreen';

const PANTALLAS_COMPACTAS = new Set(['menu', 'ajustes', 'acerca', 'buscar', 'captura']);
const MAX_HISTORIAL = 20;

function obtenerTemaInicial() {
  if (typeof window === 'undefined') return 'claro';
  const guardado = localStorage.getItem('tema-pokedex');
  if (guardado === 'oscuro' || guardado === 'claro' || guardado === 'calido') return guardado;
  return 'claro';
}

function App() {
  const { favoritos, toggleFavorito } = useFavoritos();

  const [tema, setTema] = useState(obtenerTemaInicial);
  const [pantalla, setPantalla] = useState('inicio');
  const [, setHistorial] = useState([]);
  const [pantallaOrigenMenu, setPantallaOrigenMenu] = useState('inicio');

  const [regionId, setRegionId] = useState(REGION_POR_DEFECTO.id);
  const [regionPickerAbierto, setRegionPickerAbierto] = useState(false);

  const [listasPorRegion, setListasPorRegion] = useState({});
  const [cargasPorRegion, setCargasPorRegion] = useState({});
  const [erroresPorRegion, setErroresPorRegion] = useState({});
  const [progresosPorRegion, setProgresosPorRegion] = useState({});

  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [busquedaRapida, setBusquedaRapida] = useState('');

  const [resultadoExterno, setResultadoExterno] = useState(null);
  const [buscandoExterno, setBuscandoExterno] = useState(false);

  const [pokemonSeleccionadoId, setPokemonSeleccionadoId] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [detalleCargando, setDetalleCargando] = useState(false);
  const [detalleError, setDetalleError] = useState(null);

  const [capturados, setCapturados] = useState([]);
  const [ultimaCaptura, setUltimaCaptura] = useState(null);

  const abortRef = useRef(null);
  const requestSeqRef = useRef(0);
  const catalogSearchRef = useRef(null);
  const detalleCacheRef = useRef(new Map());
  const listasRef = useRef({});
  const progresosRef = useRef({});

  useEffect(() => {
    listasRef.current = listasPorRegion;
  }, [listasPorRegion]);

  useEffect(() => {
    progresosRef.current = progresosPorRegion;
  }, [progresosPorRegion]);

  const region = useMemo(() => obtenerRegion(regionId), [regionId]);
  const pokemonesRegion = useMemo(() => listasPorRegion[regionId] || [], [listasPorRegion, regionId]);
  const cargandoRegion = !!cargasPorRegion[regionId];
  const errorRegion = erroresPorRegion[regionId] || null;
  const progresoRegion = useMemo(
    () => progresosPorRegion[regionId] || { cargados: 0, total: region.cantidad || 0 },
    [progresosPorRegion, regionId, region.cantidad],
  );

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    try {
      localStorage.setItem('tema-pokedex', tema);
    } catch {
      // ignore storage errors
    }
  }, [tema]);

  const cargarRegion = useCallback(async (idRegion, { force = false } = {}) => {
    const regionObjetivo = obtenerRegion(idRegion);
    const existente = listasRef.current[idRegion];
    const tieneDatos = Array.isArray(existente) && existente.length > 0;
    const progresoExistente = progresosRef.current[idRegion];
    const hidratadoCompleto =
      !force &&
      tieneDatos &&
      progresoExistente &&
      progresoExistente.total > 0 &&
      progresoExistente.cargados >= progresoExistente.total;

    if (hidratadoCompleto) {
      setCargasPorRegion((prev) => ({ ...prev, [idRegion]: false }));
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    const seq = ++requestSeqRef.current;
    const esActual = () => !controller.signal.aborted && requestSeqRef.current === seq;

    setErroresPorRegion((prev) => ({ ...prev, [idRegion]: null }));
    setCargasPorRegion((prev) => ({ ...prev, [idRegion]: !tieneDatos || force }));

    try {
      let base = force ? null : existente;
      if (!base || base.length === 0) {
        base = await obtenerListaRegion(regionObjetivo, { signal: controller.signal });
        if (!esActual()) return;
        listasRef.current = { ...listasRef.current, [idRegion]: base };
        setListasPorRegion((prev) => ({ ...prev, [idRegion]: base }));
        setCargasPorRegion((prev) => ({ ...prev, [idRegion]: false }));
        const prog = { cargados: 0, total: base.length || regionObjetivo.cantidad || 0 };
        progresosRef.current = { ...progresosRef.current, [idRegion]: prog };
        setProgresosPorRegion((prev) => ({ ...prev, [idRegion]: prog }));
      }

      const listaBase = listasRef.current[idRegion] || base || [];
      await hidratarPokemonesEnLotes(listaBase, {
        concurrency: 12,
        signal: controller.signal,
        shouldContinue: esActual,
        onUpdate: ({ id, data, completados, total }) => {
          if (!esActual()) return;
          if (data) {
            detalleCacheRef.current.set(id, data);
            if (data.nombreEn) detalleCacheRef.current.set(normalizarTexto(data.nombreEn), data);
            if (data.nombre) detalleCacheRef.current.set(normalizarTexto(data.nombre), data);
            listasRef.current = {
              ...listasRef.current,
              [idRegion]: (listasRef.current[idRegion] || []).map((p) => (p.id === id ? { ...p, ...data } : p)),
            };
            setListasPorRegion((prev) => {
              const actual = prev[idRegion] || [];
              const actualizada = actual.map((p) => (p.id === id ? { ...p, ...data } : p));
              return { ...prev, [idRegion]: actualizada };
            });
          }
          if (typeof completados === 'number' && typeof total === 'number') {
            const prog = { cargados: completados, total };
            progresosRef.current = { ...progresosRef.current, [idRegion]: prog };
            setProgresosPorRegion((prev) => ({ ...prev, [idRegion]: prog }));
          }
        },
      });

      if (esActual()) {
        setCargasPorRegion((prev) => ({ ...prev, [idRegion]: false }));
      }
    } catch (err) {
      if (err?.name === 'AbortError') return;
      if (!esActual()) return;
      const teniaDatos = (listasRef.current[idRegion] || []).length > 0;
      setErroresPorRegion((prev) => ({
        ...prev,
        [idRegion]: teniaDatos
          ? 'No se pudieron actualizar todos los datos de la región. Puedes reintentar.'
          : '¡Ups! No pudimos conectar con la PokéAPI en este momento. Revisa tu conexión e inténtalo de nuevo.',
      }));
      setCargasPorRegion((prev) => ({ ...prev, [idRegion]: false }));
    }
  }, []);

  useEffect(() => {
    cargarRegion(regionId);
    return () => {
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionId]);

  useEffect(() => {
    const termino = normalizarTexto(busqueda);
    const locales = filtrarPokemones(pokemonesRegion, termino);
    const debeBuscarExterno = termino.length >= 3 && locales.length === 0;

    if (!debeBuscarExterno) {
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (controller.signal.aborted) return;
      setBuscandoExterno(true);
      try {
        const clave = termino.replace(/^#/, '');
        const pokemon = await obtenerPokemonPorIdONombre(clave, { signal: controller.signal });
        if (controller.signal.aborted) return;
        detalleCacheRef.current.set(pokemon.id, pokemon);
        detalleCacheRef.current.set(normalizarTexto(pokemon.nombre), pokemon);
        if (pokemon.nombreEn) detalleCacheRef.current.set(normalizarTexto(pokemon.nombreEn), pokemon);
        setResultadoExterno(pokemon);
      } catch (err) {
        if (err?.name !== 'AbortError' && !controller.signal.aborted) setResultadoExterno(null);
      } finally {
        if (!controller.signal.aborted) setBuscandoExterno(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
      setBuscandoExterno(false);
    };
  }, [busqueda, pokemonesRegion]);

  useEffect(() => {
    if (!pokemonSeleccionadoId) return undefined;
    let activo = true;
    const controller = new AbortController();

    const cargarDetalle = async () => {
      setDetalleCargando(true);
      setDetalleError(null);
      setDetalle(null);
      try {
        const cacheado = detalleCacheRef.current.get(pokemonSeleccionadoId);
        let data = cacheado;
        if (!data || !data.stats || !data.descripcion) {
          data = await obtenerDetallePokemon(pokemonSeleccionadoId, { signal: controller.signal });
          detalleCacheRef.current.set(data.id, data);
          detalleCacheRef.current.set(normalizarTexto(data.nombre), data);
          if (data.nombreEn) detalleCacheRef.current.set(normalizarTexto(data.nombreEn), data);
        }
        if (activo) setDetalle(data);
      } catch (err) {
        if (err?.name === 'AbortError') return;
        if (activo) setDetalleError('No se pudo cargar el detalle del Pokémon.');
      } finally {
        if (activo) setDetalleCargando(false);
      }
    };

    void cargarDetalle();
    return () => {
      activo = false;
      controller.abort();
    };
  }, [pokemonSeleccionadoId]);

  const pokemonesVisiblesBase = useMemo(() => {
    let lista = pokemonesRegion;
    if (filtroTipo !== 'Todos') {
      lista = lista.filter((p) => (p.tipos || []).includes(filtroTipo));
    }
    if (soloFavoritos) {
      lista = lista.filter((p) => favoritos.includes(p.id));
    }
    const filtrados = filtrarPokemones(lista, busqueda);
    return filtrados;
  }, [pokemonesRegion, filtroTipo, soloFavoritos, favoritos, busqueda]);

  const pokemonesCatalogo = useMemo(() => {
    const termino = normalizarTexto(busqueda);
    if (!resultadoExterno || !termino) return pokemonesVisiblesBase;
    if (pokemonesVisiblesBase.some((p) => p.id === resultadoExterno.id)) return pokemonesVisiblesBase;
    const coincideBusqueda = filtrarPokemones([resultadoExterno], busqueda).length > 0;
    const coincideTipo = filtroTipo === 'Todos' || (resultadoExterno.tipos || []).includes(filtroTipo);
    const coincideFavorito = !soloFavoritos || favoritos.includes(resultadoExterno.id);
    if (coincideBusqueda && coincideTipo && coincideFavorito) {
      return [...pokemonesVisiblesBase, resultadoExterno];
    }
    return pokemonesVisiblesBase;
  }, [pokemonesVisiblesBase, resultadoExterno, busqueda, filtroTipo, soloFavoritos, favoritos]);

  const todosLosPokemones = useMemo(() => {
    const mapa = new Map();
    Object.values(listasPorRegion).forEach((lista) => {
      (lista || []).forEach((p) => {
        if (p?.id != null && !mapa.has(p.id)) mapa.set(p.id, p);
      });
    });
    if (resultadoExterno?.id != null && !mapa.has(resultadoExterno.id)) {
      mapa.set(resultadoExterno.id, resultadoExterno);
    }
    return Array.from(mapa.values());
  }, [listasPorRegion, resultadoExterno]);

  const pokemonesFavoritos = useMemo(() => {
    return todosLosPokemones.filter((p) => favoritos.includes(p.id));
  }, [todosLosPokemones, favoritos]);

  const destacado = pokemonesRegion[0] || null;

  // busquedaRapida se usa en la pantalla Buscar con fallback global

  useEffect(() => {
    const termino = normalizarTexto(busquedaRapida);
    if (!termino || termino.length < 3) {
      return undefined;
    }
    const locales = filtrarPokemones(pokemonesRegion, termino);
    if (locales.length > 0) {
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (controller.signal.aborted) return;
      setBuscandoExterno(true);
      try {
        const clave = termino.replace(/^#/, '');
        const pokemon = await obtenerPokemonPorIdONombre(clave, { signal: controller.signal });
        if (controller.signal.aborted) return;
        detalleCacheRef.current.set(pokemon.id, pokemon);
        detalleCacheRef.current.set(normalizarTexto(pokemon.nombre), pokemon);
        if (pokemon.nombreEn) detalleCacheRef.current.set(normalizarTexto(pokemon.nombreEn), pokemon);
        setResultadoExterno(pokemon);
      } catch (err) {
        if (err?.name !== 'AbortError' && !controller.signal.aborted) setResultadoExterno(null);
      } finally {
        if (!controller.signal.aborted) setBuscandoExterno(false);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
      setBuscandoExterno(false);
    };
  }, [busquedaRapida, pokemonesRegion]);

  const resultadosBuscarPantalla = useMemo(() => {
    const termino = normalizarTexto(busquedaRapida);
    const locales = filtrarPokemones(pokemonesRegion, termino).slice(0, 20);
    if (resultadoExterno && termino && filtrarPokemones([resultadoExterno], termino).length > 0) {
      if (!locales.some((p) => p.id === resultadoExterno.id)) return [resultadoExterno, ...locales].slice(0, 20);
    }
    return locales;
  }, [busquedaRapida, pokemonesRegion, resultadoExterno]);

  const navegarA = (nuevaPantalla) => {
    if (!nuevaPantalla || nuevaPantalla === pantalla) {
      setRegionPickerAbierto(false);
      return;
    }
    setHistorial((prev) => {
      const siguiente = [...prev, pantalla];
      if (siguiente.length > MAX_HISTORIAL) siguiente.shift();
      return siguiente;
    });
    setPantalla(nuevaPantalla);
    setRegionPickerAbierto(false);
  };

  const abrirMenu = () => {
    if (pantalla === 'menu') return;
    setPantallaOrigenMenu(pantalla);
    setHistorial((prev) => {
      const siguiente = [...prev, pantalla];
      if (siguiente.length > MAX_HISTORIAL) siguiente.shift();
      return siguiente;
    });
    setPantalla('menu');
    setRegionPickerAbierto(false);
  };

  const volverAPantalla = () => {
    setHistorial((prev) => {
      if (prev.length === 0) {
        setPantalla('inicio');
        return prev;
      }
      const siguiente = [...prev];
      const destino = siguiente.pop() || 'inicio';
      setPantalla(destino);
      return siguiente;
    });
    setRegionPickerAbierto(false);
  };

  const seleccionarDesdeMenu = (destino) => {
    setRegionPickerAbierto(false);
    if (destino === 'buscar') {
      setBusquedaRapida('');
      setResultadoExterno(null);
      setPantalla('buscar');
      return;
    }
    if (destino === 'captura') {
      setPantalla('captura');
      return;
    }
    if (destino === 'favoritos') {
      setBusqueda('');
      setFiltroTipo('Todos');
      setSoloFavoritos(true);
      setResultadoExterno(null);
      setPantalla('favoritos');
      return;
    }
    if (destino === 'catalogo') {
      setSoloFavoritos(false);
      setPantalla('catalogo');
      return;
    }
    setPantalla(destino);
  };

  const resetFiltros = () => {
    setBusqueda('');
    setFiltroTipo('Todos');
    setSoloFavoritos(false);
    setResultadoExterno(null);
  };

  const cambiarRegion = (nuevaRegionId) => {
    if (!nuevaRegionId || nuevaRegionId === regionId) {
      setRegionPickerAbierto(false);
      return;
    }
    setRegionId(nuevaRegionId);
    setRegionPickerAbierto(false);
    setBusqueda('');
    setFiltroTipo('Todos');
    setSoloFavoritos(false);
    setResultadoExterno(null);
    setPantalla((p) => {
      if (p === 'inicio' || p === 'menu' || p === 'ajustes' || p === 'acerca') return p;
      return 'catalogo';
    });
  };

  const abrirDetalle = (pokemonOId) => {
    const id = typeof pokemonOId === 'object' ? pokemonOId?.id : pokemonOId;
    if (!id) return;
    setPokemonSeleccionadoId(id);
    navegarA('detalle');
  };

  const capturarPokemon = (pokemon) => {
    if (!pokemon?.id) return;
    setCapturados((prev) => {
      if (prev.some((p) => p.id === pokemon.id)) return prev;
      return [...prev, { id: pokemon.id, nombre: pokemon.nombre, imagen: pokemon.imagen, tipoTexto: pokemon.tipoTexto }];
    });
    setUltimaCaptura(pokemon);
    navegarA('captura');
  };

  const relacionados = useMemo(() => {
    if (!detalle || !pokemonesRegion.length) return [];
    const tipos = detalle.tipos || [];
    if (tipos.length === 0) return [];
    return pokemonesRegion
      .filter((p) => p.id !== detalle.id && (p.tipos || []).some((t) => tipos.includes(t)))
      .slice(0, 3);
  }, [detalle, pokemonesRegion]);

  const irABuscar = () => {
    setBusquedaRapida('');
    setResultadoExterno(null);
    navegarA('buscar');
  };

  const irACatalogo = () => {
    if (pantalla === 'favoritos') {
      setSoloFavoritos(false);
      setPantalla('catalogo');
      setRegionPickerAbierto(false);
      return;
    }
    navegarA('catalogo');
  };

  const reintentarRegion = () => {
    listasRef.current = { ...listasRef.current, [regionId]: [] };
    progresosRef.current = { ...progresosRef.current, [regionId]: { cargados: 0, total: 0 } };
    setErroresPorRegion((prev) => ({ ...prev, [regionId]: null }));
    setProgresosPorRegion((prev) => ({ ...prev, [regionId]: { cargados: 0, total: 0 } }));
    setListasPorRegion((prev) => ({ ...prev, [regionId]: [] }));
    cargarRegion(regionId, { force: true });
  };

  const pantallaContenido = (() => {
    switch (pantalla) {
      case 'inicio':
        return (
          <InicioScreen
            tema={tema}
            region={region}
            destacado={destacado}
            cargando={cargandoRegion}
            error={errorRegion}
            progreso={progresoRegion}
            esFavorito={(id) => favoritos.includes(id)}
            onToggleFavorito={toggleFavorito}
            onCapturar={capturarPokemon}
            onVerDetalle={abrirDetalle}
            onExplorar={irACatalogo}
            onIrACatalogo={irACatalogo}
            onOpenRegion={() => setRegionPickerAbierto(true)}
            onReintentar={reintentarRegion}
          />
        );
      case 'catalogo':
        return (
          <CatalogoScreen
            key={regionId}
            tema={tema}
            region={region}
            pokemones={pokemonesCatalogo}
            totalRegion={pokemonesRegion.length || region.cantidad}
            cargando={cargandoRegion}
            error={errorRegion}
            progreso={progresoRegion}
            busqueda={busqueda}
            onBusquedaChange={(v) => {
              setBusqueda(v);
              setResultadoExterno(null);
            }}
            filtroTipo={filtroTipo}
            onFiltroTipoChange={setFiltroTipo}
            soloFavoritos={soloFavoritos}
            onSoloFavoritosChange={setSoloFavoritos}
            onRestablecer={resetFiltros}
            esFavorito={(id) => favoritos.includes(id)}
            onToggleFavorito={toggleFavorito}
            onOpen={abrirDetalle}
            onOpenRegion={() => setRegionPickerAbierto(true)}
            onReintentar={reintentarRegion}
            buscandoExterno={buscandoExterno}
            inputRef={catalogSearchRef}
          />
        );
      case 'favoritos':
        return (
          <CatalogoScreen
            key={`favoritos-${regionId}`}
            tema={tema}
            region={region}
            pokemones={pokemonesFavoritos.filter((p) => filtrarPokemones([p], busqueda).length > 0)}
            totalRegion={pokemonesFavoritos.length}
            cargando={false}
            error={null}
            progreso={{ cargados: 0, total: 0 }}
            busqueda={busqueda}
            onBusquedaChange={setBusqueda}
            filtroTipo="Todos"
            onFiltroTipoChange={() => {}}
            soloFavoritos
            onSoloFavoritosChange={() => navegarA('catalogo')}
            onRestablecer={() => setBusqueda('')}
            esFavorito={(id) => favoritos.includes(id)}
            onToggleFavorito={toggleFavorito}
            onOpen={abrirDetalle}
            onOpenRegion={() => setRegionPickerAbierto(true)}
            onReintentar={reintentarRegion}
            buscandoExterno={false}
            titulo="Favoritos"
            descripcion="Consulta los Pokémon que has guardado. Puedes abrir su detalle o quitarlos de favoritos."
            mostrarTipos={false}
            mostrarToggleFavoritos={false}
            inputRef={catalogSearchRef}
          />
        );
      case 'detalle':
        return (
          <DetalleScreen
            tema={tema}
            region={region}
            pokemon={detalle}
            cargando={detalleCargando}
            error={detalleError}
            esFavorito={(id) => favoritos.includes(id)}
            onToggleFavorito={toggleFavorito}
            onCapturar={capturarPokemon}
            onVolver={irACatalogo}
            relacionados={relacionados}
            onOpenRelacionado={abrirDetalle}
          />
        );
      case 'menu':
        return (
          <MenuScreen
            pantallaActual={pantallaOrigenMenu || 'inicio'}
            favoritosCount={favoritos.length}
            onNavigate={seleccionarDesdeMenu}
            onVolver={volverAPantalla}
          />
        );
      case 'ajustes':
        return <AjustesScreen tema={tema} onTemaChange={setTema} onVolver={volverAPantalla} />;
      case 'acerca':
        return (
          <AcercaScreen
            onExplorar={irACatalogo}
            onAjustes={() => navegarA('ajustes')}
            onVolver={volverAPantalla}
          />
        );
      case 'buscar':
        return (
          <BuscarScreen
            tema={tema}
            busqueda={busquedaRapida}
            onBusquedaChange={setBusquedaRapida}
            resultados={resultadosBuscarPantalla}
            buscando={buscandoExterno && normalizarTexto(busquedaRapida).length >= 3 && resultadosBuscarPantalla.length === 0}
            onOpen={abrirDetalle}
            onVolver={volverAPantalla}
            onIrCatalogo={irACatalogo}
          />
        );
      case 'captura':
        return (
          <CapturaScreen
            pokemon={ultimaCaptura}
            totalCapturados={capturados.length}
            onVerFicha={abrirDetalle}
            onSeguirExplorando={irACatalogo}
            onVolver={volverAPantalla}
          />
        );
      default:
        return null;
    }
  })();

  const compacta = PANTALLAS_COMPACTAS.has(pantalla);

  return (
    <div className="app-shell">
      <AppHeader
        tema={tema}
        pantalla={pantalla}
        compacta={compacta}
        onHome={() => navegarA('inicio')}
        onMenu={abrirMenu}
        onSearch={irABuscar}
        onNavigate={(destino) => {
          if (destino === 'catalogo') setSoloFavoritos(false);
          navegarA(destino);
        }}
      />

      {pantallaContenido}

      <RegionPicker
        abierto={regionPickerAbierto}
        regiones={REGIONES}
        regionActivaId={regionId}
        onSelect={cambiarRegion}
        onClose={() => setRegionPickerAbierto(false)}
      />
    </div>
  );
}

export default App;
