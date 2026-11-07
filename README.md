
# 🎬 Netflix Clone

Aplicación web inspirada en la interfaz de Netflix, desarrollada
con React, Vite y Tailwind CSS.

El proyecto consume la API de The Movie Database (TMDB) para
mostrar información actualizada sobre películas y series.

##  Funcionalidades

- Catálogo de películas y series obtenido desde TMDB.
- Página de inicio con banner destacado.
- Carruseles horizontales por categorías.
- Películas populares, tendencias y próximos estrenos.
- Películas de acción, comedia y terror.
- Series populares, mejor valoradas y en emisión.
- Búsqueda de películas y series.
- Ventanas modales con información detallada.
- Lista de favoritos persistente mediante localStorage.
- Navegación mediante React Router.
- Diseño responsive para computadoras y dispositivos móviles.
- Caché en memoria para reducir consultas repetidas.
- Manejo independiente de errores del catálogo.

##  Tecnologías

- React
- JavaScript
- Vite
- Tailwind CSS
- React Router
- TMDB API
- HTML5 y CSS3
- Git y GitHub

##  Estructura del proyecto

```text
netflix-clone/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.jsx
│   │   └── movies/
│   │       ├── HeroBanner.jsx
│   │       ├── MovieCard.jsx
│   │       ├── MovieModal.jsx
│   │       ├── MovieRow.jsx
│   │       └── MovieSearch.jsx
│   ├── hooks/
│   │   └── useMovieCatalog.js
│   ├── services/
│   │   └── tmdb.js
│   ├── utils/
│   │   └── watchlist.js
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

##  Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/CrisDa7/netflix-clone.git
cd netflix-clone
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar TMDB

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_TMDB_API_KEY=TU_API_KEY_DE_TMDB
```

La API Key se obtiene desde:

https://www.themoviedb.org/settings/api

**Nota de seguridad:** Las variables con prefijo `VITE_`
se incorporan al código del navegador. No deben utilizarse
para almacenar credenciales privadas.

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

### 5. Generar la versión de producción

```bash
npm run build
```

##  Despliegue

El proyecto está preparado para publicarse mediante
GitHub Pages y GitHub Actions.

URL prevista:

https://crisda7.github.io/netflix-clone/

##  Diseño responsive

La aplicación adapta su navegación, carruseles y tarjetas
a diferentes tamaños de pantalla.

##  Propósito

Proyecto de portafolio para practicar:

- Desarrollo frontend con React.
- Consumo de APIs REST.
- Componentes reutilizables.
- Hooks personalizados.
- Gestión del estado.
- Persistencia local.
- Optimización de consultas.
- Control de versiones con Git.
- Despliegue de aplicaciones web.

##  Créditos

Este proyecto utiliza datos e imágenes proporcionados
por The Movie Database (TMDB).

Este producto utiliza la API de TMDB, pero no está
respaldado ni certificado por TMDB.

Proyecto educativo inspirado en Netflix.
No es un producto oficial de Netflix.
