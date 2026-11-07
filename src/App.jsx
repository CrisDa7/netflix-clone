
import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import HeroBanner from "./components/movies/HeroBanner";
import MovieRow from "./components/movies/MovieRow";
import MovieModal from "./components/movies/MovieModal";
import MovieSearch from "./components/movies/MovieSearch";

import { useMovieCatalog } from "./hooks/useMovieCatalog";

import {
  getPopularMovies,
  getTrending,
  getTopRated,
  getUpcoming,
  getPopularSeries,
  getTopRatedSeries,
  getTrendingSeries,
  getOnAirSeries,
  getTrendingMovies,
  getActionMovies,
  getComedyMovies,
  getHorrorMovies,
} from "./services/tmdb";

import {
  getWatchlist,
  saveWatchlist,
  isInWatchlist,
} from "./utils/watchlist";

/**
 * Configuración de categorías de películas.
 */
const movieCategories = [
  {
    id: "popular",
    title: "Películas populares",
    fetcher: getPopularMovies,
  },
  {
    id: "movieTrending",
    title: "Películas en tendencia",
    fetcher: getTrendingMovies,
  },
  {
    id: "topRated",
    title: "Películas mejor valoradas",
    fetcher: getTopRated,
  },
  {
    id: "upcoming",
    title: "Próximos estrenos",
    fetcher: getUpcoming,
  },
  {
    id: "action",
    title: "Películas de acción",
    fetcher: getActionMovies,
  },
  {
    id: "comedy",
    title: "Películas de comedia",
    fetcher: getComedyMovies,
  },
  {
    id: "horror",
    title: "Películas de terror",
    fetcher: getHorrorMovies,
  },
];

/**
 * Configuración de categorías de series.
 */
const seriesCategories = [
  {
    id: "seriesPopular",
    title: "Series populares",
    fetcher: getPopularSeries,
  },
  {
    id: "seriesTopRated",
    title: "Series mejor valoradas",
    fetcher: getTopRatedSeries,
  },
  {
    id: "seriesTrending",
    title: "Series en tendencia",
    fetcher: getTrendingSeries,
  },
  {
    id: "seriesOnAir",
    title: "Series en emisión",
    fetcher: getOnAirSeries,
  },
];

/**
 * Tendencias generales de películas y series.
 */
const generalCategories = [
  {
    id: "trending",
    title: "Tendencias de la semana",
    fetcher: getTrending,
  },
];

/**
 * Categorías que aparecen en Inicio.
 */
const homeCategories = [
  movieCategories[0],
  generalCategories[0],
  movieCategories[2],
  movieCategories[3],
  seriesCategories[0],
];

/**
 * Determina las categorías necesarias
 * según la ruta seleccionada.
 */
function getCategoriesForPath(pathname) {
  switch (pathname) {
    case "/":
      return homeCategories;

    case "/series":
      return seriesCategories;

    case "/peliculas":
      return movieCategories;

    default:
      return [];
  }
}

/**
 * Componente principal de Netflix Clone.
 */
function App() {
  const location = useLocation();

  /**
   * Obtiene las categorías necesarias
   * para la página actual.
   */
  const activeCategories = getCategoriesForPath(
    location.pathname
  );

  /**
   * Hook personalizado del catálogo.
   */
  const {
    catalog,
    loading,
    errors,
  } = useMovieCatalog(activeCategories);

  // Película seleccionada para el modal.
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Favoritos recuperados desde localStorage.
  const [watchlist, setWatchlist] = useState(getWatchlist);

  /**
   * Añade o elimina películas y series favoritas.
   */
  const toggleWatchlist = (movie) => {
    if (!movie) return;

    setWatchlist((currentList) => {
      const exists = isInWatchlist(currentList, movie);

      if (exists) {
        return currentList.filter(
          (item) =>
            !(
              item.id === movie.id &&
              item.mediaType === movie.mediaType
            )
        );
      }

      return [...currentList, movie];
    });
  };

  /**
   * Guarda los favoritos en localStorage.
   */
  useEffect(() => {
    saveWatchlist(watchlist);
  }, [watchlist]);

  /**
   * Renderiza una categoría.
   *
   * Si una consulta falla, muestra un mensaje
   * sin bloquear las demás categorías.
   */
  const renderCategory = (category) => {
    const movies = catalog[category.id];
    const error = errors[category.id];

    if (error) {
      return (
        <p
          key={category.id}
          role="alert"
          className="px-5 py-4 text-sm text-red-400 md:px-12"
        >
          No se pudo cargar {category.title.toLowerCase()}:
          {" "}{error}
        </p>
      );
    }

    if (!movies) {
      return null;
    }

    return (
      <MovieRow
        key={category.id}
        title={category.title}
        movies={movies}
        onMovieClick={setSelectedMovie}
      />
    );
  };

  /**
   * Muestra el indicador de carga.
   */
  const catalogStatus = loading ? (
    <p
      role="status"
      className="px-5 py-8 text-gray-400 md:px-12"
    >
      Cargando catálogo...
    </p>
  ) : null;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#141414] text-white">
      {/* Barra de navegación */}
      <Navbar />

      <main>
        <Routes>
          {/* =========================
              INICIO
          ========================= */}
          <Route
            path="/"
            element={
              <>
                <HeroBanner />

                {catalogStatus}

                {!loading &&
                  homeCategories.map(renderCategory)}
              </>
            }
          />

          {/* =========================
              SERIES
          ========================= */}
          <Route
            path="/series"
            element={
              <section className="min-h-[70vh] py-8">
                <div className="px-5 md:px-12">
                  <h1 className="text-3xl font-bold md:text-4xl">
                    Series
                  </h1>

                  <p className="mt-2 text-sm text-gray-400 md:text-base">
                    Descubre series populares, tendencias,
                    producciones mejor valoradas y series
                    que se encuentran en emisión.
                  </p>
                </div>

                {catalogStatus}

                {!loading &&
                  seriesCategories.map(renderCategory)}
              </section>
            }
          />

          {/* =========================
              PELÍCULAS
          ========================= */}
          <Route
            path="/peliculas"
            element={
              <section className="min-h-[70vh] py-8">
                <div className="px-5 md:px-12">
                  <h1 className="text-3xl font-bold md:text-4xl">
                    Películas
                  </h1>

                  <p className="mt-2 text-sm text-gray-400 md:text-base">
                    Explora películas populares, tendencias,
                    acción, comedia, terror y próximos estrenos.
                  </p>
                </div>

                {catalogStatus}

                {!loading &&
                  movieCategories.map(renderCategory)}
              </section>
            }
          />

          {/* =========================
              MI LISTA
          ========================= */}
          <Route
            path="/mi-lista"
            element={
              <section className="min-h-[70vh] py-8">
                <h1 className="px-5 text-3xl font-bold md:px-12 md:text-4xl">
                  Mi lista
                </h1>

                {watchlist.length > 0 ? (
                  <MovieRow
                    title="Películas y series guardadas"
                    movies={watchlist}
                    onMovieClick={setSelectedMovie}
                  />
                ) : (
                  <p className="px-5 py-6 text-gray-400 md:px-12">
                    Todavía no tienes películas ni series
                    guardadas. Explora el catálogo y añade
                    tus favoritas.
                  </p>
                )}
              </section>
            }
          />

          {/* =========================
              BUSCAR
          ========================= */}
          <Route
            path="/buscar"
            element={
              <section className="min-h-[70vh] py-8">
                <h1 className="px-5 text-3xl font-bold md:px-12 md:text-4xl">
                  Buscar películas y series
                </h1>

                <MovieSearch
                  onMovieClick={setSelectedMovie}
                />
              </section>
            }
          />

          {/* Rutas desconocidas */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>

      {/* Modal compartido */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onToggleWatchlist={toggleWatchlist}
        isSaved={
          selectedMovie
            ? isInWatchlist(watchlist, selectedMovie)
            : false
        }
      />
    </div>
  );
}

export default App;
