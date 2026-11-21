import { traducirTipo } from '../data/tipos';
import { normalizarTexto } from '../utils/pokemonUtils';

const API_BASE = 'https://pokeapi.co/api/v2';

export function imagenOficial(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function capitalizar(nombre = '') {
  if (!nombre) return '';
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

export function extraerIdPokemonDesdeUrl(url = '') {
  const match = String(url).match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}

export function extraerIdSpeciesDesdeUrl(url = '') {
  const match = String(url).match(/\/pokemon-species\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}

export function mapearPokemonBasico(detalle) {
  const tiposEn = (detalle.types || []).map((t) => t.type.name);
  const tipos = tiposEn.map(traducirTipo);
  return {
    id: detalle.id,
    nombre: capitalizar(detalle.name),
    nombreEn: detalle.name,
    tipos,
    tiposEn,
    tipoTexto: tipos.join(' / ') || 'Tipo no disponible',
    imagen:
      detalle.sprites?.other?.['official-artwork']?.front_default ||
      detalle.sprites?.front_default ||
      imagenOficial(detalle.id),
    altura: detalle.height != null ? `${(detalle.height / 10).toFixed(1).replace('.', ',')} m` : '—',
    peso: detalle.weight != null ? `${(detalle.weight / 10).toFixed(1).replace('.', ',')} kg` : '—',
    habilidades: (detalle.abilities || [])
      .map((a) => capitalizar(a.ability?.name || '').replace(/-/g, ' '))
      .filter(Boolean),
    stats: (detalle.stats || []).map((s) => ({
      clave: s.stat?.name || '',
      nombre: formatearNombreStat(s.stat?.name || ''),
      valor: s.base_stat ?? 0,
    })),
    speciesUrl: detalle.species?.url || null,
    speciesId: extraerIdSpeciesDesdeUrl(detalle.species?.url || ''),
  };
}

export function formatearNombreStat(nombre = '') {
  const mapa = {
    hp: 'PS',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'Ataque Especial',
    'special-defense': 'Defensa Especial',
    speed: 'Velocidad',
  };
  return mapa[nombre] || capitalizar(nombre).replace(/-/g, ' ');
}

export async function fetchJson(url, { signal } = {}) {
  const respuesta = await fetch(url, { signal });
  if (!respuesta.ok) {
    const error = new Error(`Error ${respuesta.status}`);
    error.status = respuesta.status;
    throw error;
  }
  return respuesta.json();
}

export async function obtenerListaRegion(region, { signal } = {}) {
  if (region.fuente === 'pokedex') {
    const json = await fetchJson(`${API_BASE}/pokedex/${region.fuenteId}`, { signal });
    const entries = (json.pokemon_entries || [])
      .map((entry) => {
        const id = extraerIdSpeciesDesdeUrl(entry.pokemon_species?.url || '');
        const name = entry.pokemon_species?.name || '';
        if (!id || !name) return null;
        return {
          id,
          nombre: capitalizar(name),
          nombreEn: name,
          tipos: [],
          tipoTexto: '',
          imagen: imagenOficial(id),
          speciesId: id,
        };
      })
      .filter(Boolean);

    // Hisui y dex regionales pueden tener orden distinto; ordenar por id estable para UX consistente
    const vistos = new Set();
    return entries.filter((p) => {
      if (vistos.has(p.id)) return false;
      vistos.add(p.id);
      return true;
    }).sort((a, b) => a.id - b.id);
  }

  const json = await fetchJson(`${API_BASE}/generation/${region.fuenteId}`, { signal });
  const species = (json.pokemon_species || [])
    .map((sp) => {
      const id = extraerIdSpeciesDesdeUrl(sp.url || '');
      const name = sp.name || '';
      if (!id || !name) return null;
      return {
        id,
        nombre: capitalizar(name),
        nombreEn: name,
        tipos: [],
        tipoTexto: '',
        imagen: imagenOficial(id),
        speciesId: id,
      };
    })
    .filter(Boolean);

  const vistos = new Set();
  return species
    .filter((p) => {
      if (vistos.has(p.id)) return false;
      vistos.add(p.id);
      return true;
    })
    .sort((a, b) => a.id - b.id);
}

export async function obtenerPokemonPorIdONombre(idONombre, { signal } = {}) {
  const termino = normalizarTexto(String(idONombre)).replace(/^#/, '');
  if (!termino) throw new Error('Término vacío');
  const json = await fetchJson(`${API_BASE}/pokemon/${encodeURIComponent(termino)}`, { signal });
  return mapearPokemonBasico(json);
}

export async function obtenerDetallePokemon(id, { signal } = {}) {
  const pokemon = await obtenerPokemonPorIdONombre(id, { signal });
  const speciesId = pokemon.speciesId || pokemon.id;

  let descripcion = '';
  let categoria = '';
  let habitat = '';
  try {
    const species = await fetchJson(`${API_BASE}/pokemon-species/${speciesId}`, { signal });
    const flavorEs = (species.flavor_text_entries || []).find((f) => f.language?.name === 'es');
    const flavorEn = (species.flavor_text_entries || []).find((f) => f.language?.name === 'en');
    const generoEs = (species.genera || []).find((g) => g.language?.name === 'es');
    const generoEn = (species.genera || []).find((g) => g.language?.name === 'en');
    descripcion = (flavorEs?.flavor_text || flavorEn?.flavor_text || '')
      .replace(/\f|\n|\r/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    categoria = generoEs?.genus || generoEn?.genus || '';
    habitat = species.habitat?.name ? capitalizar(species.habitat.name).replace(/-/g, ' ') : '';
  } catch {
    // species es opcional para no romper el detalle
  }

  return {
    ...pokemon,
    descripcion: descripcion || 'Descripción no disponible por el momento.',
    categoria: categoria || 'Pokémon',
    habitat: habitat || '—',
  };
}

export async function hidratarPokemonesEnLotes(lista, { concurrency = 12, signal, onUpdate, shouldContinue } = {}) {
  const pendientes = lista.filter((p) => !p.tipos || p.tipos.length === 0 || !p.tipoTexto);
  const total = lista.length;
  let completados = total - pendientes.length;
  let indice = 0;

  const worker = async () => {
    while (indice < pendientes.length) {
      if (signal?.aborted || (shouldContinue && !shouldContinue())) return;
      const actual = pendientes[indice];
      indice += 1;
      try {
        const detalle = await obtenerPokemonPorIdONombre(actual.id, { signal });
        if (signal?.aborted || (shouldContinue && !shouldContinue())) return;
        completados += 1;
        onUpdate?.({ id: actual.id, data: { ...actual, ...detalle }, completados, total });
      } catch (err) {
        if (err?.name === 'AbortError') return;
        if (signal?.aborted || (shouldContinue && !shouldContinue())) return;
        completados += 1;
        onUpdate?.({
          id: actual.id,
          data: { ...actual, tipoTexto: actual.tipoTexto || 'Tipo no disponible' },
          completados,
          total,
          error: err,
        });
      }
    }
  };

  const n = Math.min(concurrency, Math.max(pendientes.length, 1));
  if (pendientes.length === 0) {
    onUpdate?.({ completados: total, total, done: true });
    return;
  }
  await Promise.all(Array.from({ length: n }, () => worker()));
}
