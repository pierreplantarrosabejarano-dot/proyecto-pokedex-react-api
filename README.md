# Pokédex Virtual - Proyecto Web 🔴⚪

Este repositorio contiene el desarrollo evolutivo del proyecto **"Pokédex"**, correspondiente a la materia de **Programación Web I (INF240)**. El proyecto documenta desde la maquetación estática inicial (HTML/CSS/JS), el diseño de interfaz y arquitectura Backend (base para INF340), hasta la migración hacia una aplicación interactiva construida con **React**.

## 👥 Equipo de Desarrollo
- **Pierre Plantarrosa Bejarano**
- **Pither Daniel Condori Villanueva**
- **Grupo:** #002

## 🌐 Enlace del Proyecto (Versión Estática)
La primera versión estática y maquetada del proyecto se encuentra desplegada y visible en el servidor de la materia:
👉 `http://tecnoweb.org.bo/inf240/grupo02sx/`

---

## 🛠️ Tecnologías y Herramientas (Etapa 1: FrontEnd Estático)
- **HTML5:** Uso riguroso de etiquetas semánticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **CSS3:** 
  - Diseño 100% responsivo sin depender exclusivamente de *media queries*.
  - Uso de **Flexbox** para la alineación fluida de la barra de navegación.
  - Uso de **CSS Grid** (`auto-fit`, `minmax`) para la grilla de las tarjetas de los Pokémon.

---

## 🧠 Vida del proyecto (JavaScript Vanilla)
- **JavaScript:** Uso del DOM mediante JavaScript, manejo de eventos e interacción, control de modo oscuro y control de pokemones favoritos (`getElementById`, `querySelectorAll`, `forEach`, `addEventListener`, `contains`, `toggle`, `display`).

---

## ⚙️ Diseño de BackEnd (Planificación para INF340)

### 1. Entidad Central (Recurso)
El recurso principal de nuestra API REST es la entidad **`pokemon`**.

### 2. Lenguaje y Arquitectura
Para la futura implementación del servidor se ha elegido **JavaScript** (utilizando Node.js y Express). Esta tecnología aporta flexibilidad y facilita la estructuración de la lógica bajo el patrón **Modelo-Vista-Controlador (MVC)**, permitiendo además mantener un entorno de desarrollo unificado (Full-Stack JavaScript) junto con el FrontEnd.

### 3. Endpoints (CRUD)
Se han definido las siguientes rutas para la gestión del catálogo:

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/pokemon` | Obtiene la lista completa de Pokémon (soporta paginación). |
| `GET` | `/api/pokemon/{id}` | Obtiene los detalles de un Pokémon específico por su ID. |
| `POST` | `/api/pokemon` | Registra un nuevo Pokémon en la base de datos. |
| `PUT` | `/api/pokemon/{id}` | Actualiza completamente los datos de un Pokémon existente. |
| `DELETE` | `/api/pokemon/{id}` | Elimina un Pokémon del registro. |

### 4. Estructura de Respuesta JSON
Ejemplo de la respuesta que devolverá el endpoint `GET /api/pokemon/1`:

```json
{
  "id": 1,
  "nombre": "Bulbasaur",
  "tipos": ["Planta", "Veneno"],
  "estadisticas": {
    "hp": 45,
    "ataque": 49,
    "defensa": 49,
    "velocidad": 45
  },
  "imagen_url": "[https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png)",
  "descripcion": "Una extraña semilla fue plantada en su espalda al nacer."
}
🏗️ Arquitectura del Proyecto (Etapa 2)
1. Diagrama Cliente-Servidor
El siguiente esquema ilustra la comunicación entre las tres capas principales de la aplicación:

Fragmento de código
graph LR
    A[FrontEnd<br/>HTML / CSS / React] <-->|Peticiones HTTP/REST| B(API BackEnd<br/>Node.js / Express)
    B <-->|Consultas a la DB| C[(Base de Datos)]
2. Flujo de Datos
Recorrido detallado de una petición típica desde la interfaz hasta la pantalla:

Fragmento de código
sequenceDiagram
    participant Usuario
    participant Pantalla (DOM)
    participant Fetch (JS)
    participant API (Backend)
    
    Usuario->>Pantalla (DOM): 1. Acción: Clic en "Ver Bulbasaur"
    Pantalla (DOM)->>Fetch (JS): 2. Intercepta evento
    Fetch (JS)->>API (Backend): 3. fetch('/api/pokemon/1')
    API (Backend)-->>Fetch (JS): 4. Retorna { id: 1, nombre: "Bulbasaur"... } (JSON)
    Fetch (JS)-->>Pantalla (DOM): 5. Procesa el JSON
    Pantalla (DOM)->>Usuario: 6. Renderiza la tarjeta visualmente
🎨 Mini Guía de Estilo (UI/UX) (Etapa 3)
Esta sección define las decisiones de diseño para el proyecto, sirviendo como insumo para el prototipado en Figma.

1. Análisis de Interfaz de Referencia
Web evaluada: Página oficial de Pokedex.com / Wikidex.

Qué funciona (UX/UI): El uso de colores sólidos y representativos para identificar rápidamente los tipos de Pokémon. Las imágenes grandes facilitan el reconocimiento visual inmediato.

Qué no funciona: En algunas wikis, la sobrecarga de tablas y estadísticas de combate en la primera vista satura la pantalla, dificultando la lectura en dispositivos móviles.

2. Paleta de Colores y Roles
Se definieron los siguientes colores, verificando el contraste de los textos sobre los fondos utilizando herramientas de accesibilidad (WebAIM/Lighthouse).

Primario (Rojo Pokédex): #ef5350 — Rol: Encabezados (Header) y elementos de marca.

Secundario / Acento: #ffcb05 — Rol: Efectos hover en enlaces e indicadores de favoritos.

Fondo Principal: #f4f5f7 — Rol: Color base para descansar la vista en el cuerpo de la página.

Superficies (Tarjetas): #ffffff — Rol: Contenedor para destacar a cada Pokémon individualmente.

Texto Principal: #2c3e50 / #333333 — Rol: Títulos y cuerpo de texto (alto contraste sobre fondos claros).

3. Tipografía y Escala
Se seleccionó la familia tipográfica sin serifas 'Segoe UI', Tahoma, sans-serif para garantizar una lectura limpia y moderna en pantallas digitales.

H1 (Título de Página): 2rem (Negrita) — Uso: "Pokédex Virtual".

H2 (Subtítulos de Sección): 1.5rem (Seminegrita) — Uso: Mensajes de bienvenida y divisiones.

H3 (Nombres de Entidades): 1.17rem (Negrita) — Uso: Nombre de cada Pokémon en su tarjeta.

Cuerpo (Body / P): 1rem (Regular) — Uso: Párrafos descriptivos.

Textos secundarios (Tipos): 0.9rem (Regular) — Uso: Etiquetas de tipos (ej. Planta/Veneno) en color gris (#7f8c8d).

4. Jerarquía Visual (Vista Clave: Tarjeta de Pokémon)
En la cuadrícula de la Pokédex, el ojo del usuario es guiado intencionalmente en el siguiente orden de lectura:

Primer nivel de atención: La imagen del Pokémon (ubicada al centro, con un tamaño predominante de 120x120px).

Segundo nivel de atención: El número y nombre del Pokémon (etiqueta H3, con un color oscuro que contrasta con la tarjeta blanca).

Tercer nivel de atención: Los tipos del Pokémon (texto más pequeño y en color gris tenue, sirviendo como información complementaria).

🖌️ Prototipado en Figma (Etapa 4)
Se diseñó un prototipo interactivo que sirve como entregable de diseño y plano principal para la construcción de componentes en React.

Enlace al Prototipo
🔗 https://www.figma.com/design/sibBlzyt5Xu9Kle1vGMCuz/Proyecto-Pokedex?node-id=0-1&t=TfcPuCkKn3z66wau-1

Resumen del Diseño
Estilos Locales: Se registraron la paleta de colores y la escala tipográfica documentadas en la Mini Guía de Estilo.

Pantallas Diseñadas: Se crearon mockups visuales basados en wireframes previos, cubriendo el flujo principal de la aplicación (Inicio, Catálogo Pokédex y Detalle).

Componentes Reutilizables: Se modularizó el diseño creando componentes base, incluyendo un botón estándar y la tarjeta de presentación de cada Pokémon.

Navegación Interactiva: Se configuró el modo Prototype para enlazar las pantallas, permitiendo simular la experiencia de usuario y el flujo de navegación.

⚛️ Continuación del Proyecto: Paso de Estático a Proyecto con React (Etapa 5)
En esta fase se realizó la migración del proyecto estático hacia una arquitectura moderna basada en componentes utilizando React y Vite, separando la base estática original en base_estatica/ como referencia de estilos y estructura.

1. Configuración del Entorno e Inicialización
Creación del proyecto mediante npm create vite@latest (seleccionando React + JavaScript).

Migración de la hoja de estilos original (style.css) hacia src/index.css para mantener la identidad visual y el diseño responsivo basado en Flexbox y CSS Grid.

2. Estructura de Componentes y Props
Se modularizó la interfaz dividiéndola en componentes reutilizables dentro de src/components/:

Header.jsx: Encabezado principal reutilizable con la identidad de la aplicación.

PokemonCard.jsx: Componente encargado de renderizar cada tarjeta individual. Recibe datos dinámicos mediante props (id, nombre, tipo, imagen, esFavorito y la función onToggleFavorito).

3. Renderizado Dinámico, Estado (useState) y Eventos
En el componente raíz src/App.jsx se implementó la lógica reactiva de la aplicación (utilizando datos locales en memoria como paso previo al consumo de la PokéAPI real):

Renderizado de Listas (.map()): Iteración sobre el arreglo de Pokémon filtrados para generar dinámicamente múltiples instancias de <PokemonCard /> con su respectiva clave única (key).

Manejo de Estado con useState:

busqueda: Estado vinculado a un input controlado que filtra el catálogo en tiempo real por nombre.

favoritos: Arreglo de estado que almacena los IDs de los Pokémon seleccionados por el usuario y actualiza un contador dinámico en pantalla.

Conexión de Eventos (onChange / onClick): Interacción directa mediante botones para marcar/desmarcar favoritos y limpiar los criterios de búsqueda al instante.

4. Ejecución del Proyecto React en Local
Para levantar el entorno de desarrollo de esta versión en React:

Clona este repositorio:

Bash
git clone [https://github.com/tu-usuario/proyecto02-pokedex-react.git](https://github.com/tu-usuario/proyecto02-pokedex-react.git)
Ingresa al directorio del proyecto:

Bash
cd proyecto02-pokedex-react
Instala las dependencias necesarias:

Bash
npm install
Inicia el servidor de desarrollo de Vite:

Bash
npm run dev
Abre en tu navegador la dirección local indicada en consola (por defecto http://localhost:5173/).

---

## 🌐 Consumo de API Pública (Etapa 6)

En esta fase del proyecto integrador se conectó la aplicación React con una API pública real mediante peticiones asíncronas (`fetch`), reemplazando los datos estáticos en memoria.

### 1. API Pública Utilizada
- **Nombre:** PokéAPI (RESTful Pokémon API)
- **URL Base del Endpoint:** `https://pokeapi.co/api/v2/pokemon?limit=20`

### 2. Implementación Técnica
- **Petición HTTP (`GET`):** Uso de `fetch()` con `async/await` y conversión de respuesta mediante `res.json()`, verificando la estructura de datos en consola.
- **Ciclo de Vida (`useEffect` + `useState`):** Ejecución controlada de la petición al montar el componente principal (`App.jsx`) para poblar dinámicamente el estado de Pokémon y renderizar los componentes `<PokemonCard />`.
- **Manejo de Estados de Red:** Control visual mediante estados `cargando` (indicador de espera mientras se resuelven las promesas) y `error` (captura de excepciones HTTP o de red con bloques `try/catch`).

### 3. Renderizado de Lista Real en Pantalla (Práctica U3-2)
Se consolidó la visualización dinámica de los datos obtenidos desde la PokéAPI:
- **Petición en Ciclo de Vida:** Ejecución de `fetch` dentro de `useEffect` para obtener la lista de Pokémon y resolver sus detalles mediante `Promise.all`[cite: 11].
- **Gestión de Estados:** Control explícito mediante tres estados independientes en React: `datos` (arreglo de Pokémon), `cargando` (indicador booleano de espera) y `error` (captura de fallos de red o HTTP)[cite: 11].
- **Renderizado con `.map()` y `key`:** Mapeo dinámico de `datos` hacia componentes `<PokemonCard />`, utilizando el `id` único de cada Pokémon como atributo `key`[cite: 11].
- **Experiencia de Usuario (UX):** Implementación de indicador visual `"Cargando..."` durante la petición y un aviso de error amigable con botón de reintento ante fallos de conexión[cite: 11].
