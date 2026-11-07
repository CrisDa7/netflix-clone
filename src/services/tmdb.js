
/**
 * Servicio de integración con TMDB.
 *
 * Responsabilidades:
 * - Consultar películas y series.
 * - Consultar contenido por géneros.
 * - Buscar películas y series por nombre.
 * - Normalizar los resultados.
 * - Centralizar el manejo de errores.
 */

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";

const IMAGE_URL = "https://image.tmdb.org/t/p/w780";

/**
 * Identificadores oficiales de géneros de TMDB.
 */
const MOVIE_GENRES = {
  ACTION: 28,
  COMEDY: 35,
  HORROR: 27,
};

/**
 * Transforma los resultados de TMDB al formato
 * utilizado por nuestros componentes React.
 *
 * @param {Array} results - Resultados de TMDB.
 * @param {string} mediaType - Tipo predeterminado.
 * @returns {Array} Contenido normalizado.
 */
function normalizeMovies(results, mediaType = "movie") {
  return results.map((item) => ({
    id: item.id,

    title: item.title || item.name,

    image: item.backdrop_path
      ? `${IMAGE_URL}${item.backdrop_path}`
      : null,

    overview: item.overview || "",

    rating: item.vote_average,

    releaseDate:
      item.release_date || item.first_air_date || "",

    mediaType: item.media_type || mediaType,
  }));
}

/**
 * Realiza solicitudes a TMDB.
 *
 * @param {string} endpoint - Endpoint solicitado.
 * @param {Object} params - Parámetros adicionales.
 * @returns {Promise<Array>} Resultados normalizados.
 */
async function fetchMovies(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error(
      "No se encontró la API Key de TMDB."
    );
  }

  const url = new URL(`${BASE_URL}${endpoint}`);

  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "es-ES");

  // Añade parámetros adicionales a la solicitud.
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Error al consultar TMDB: ${response.status}`
    );
  }

  const data = await response.json();

  /**
   * Identifica el tipo de contenido.
   * Los resultados mixtos conservan su media_type.
   */
  const mediaType =
    endpoint.startsWith("/tv/") ||
    endpoint.startsWith("/trending/tv/")
      ? "tv"
      : "movie";

  return normalizeMovies(data.results || [], mediaType);
}

/* =====================================================
   PELÍCULAS
===================================================== */

/**
 * Obtiene películas populares.
 */
export const getPopularMovies = () =>
  fetchMovies("/movie/popular");

/**
 * Obtiene películas mejor valoradas.
 */
export const getTopRated = () =>
  fetchMovies("/movie/top_rated");

/**
 * Obtiene próximos estrenos de películas.
 */
export const getUpcoming = () =>
  fetchMovies("/movie/upcoming");

/**
 * Obtiene películas en tendencia esta semana.
 */
export const getTrendingMovies = () =>
  fetchMovies("/trending/movie/week");

/* =====================================================
   PELÍCULAS POR GÉNERO
===================================================== */

/**
 * Función reutilizable para consultar películas
 * pertenecientes a un género específico.
 *
 * @param {number} genreId - Identificador del género.
 * @returns {Promise<Array>} Películas del género.
 */
function getMoviesByGenre(genreId) {
  return fetchMovies("/discover/movie", {
    with_genres: genreId,
    sort_by: "popularity.desc",
    include_adult: false,
  });
}

/**
 * Obtiene películas de acción.
 */
export const getActionMovies = () =>
  getMoviesByGenre(MOVIE_GENRES.ACTION);

/**
 * Obtiene películas de comedia.
 */
export const getComedyMovies = () =>
  getMoviesByGenre(MOVIE_GENRES.COMEDY);

/**
 * Obtiene películas de terror.
 */
export const getHorrorMovies = () =>
  getMoviesByGenre(MOVIE_GENRES.HORROR);

/* =====================================================
   TENDENCIAS GENERALES
===================================================== */

/**
 * Obtiene películas y series en tendencia
 * durante la última semana.
 */
export const getTrending = () =>
  fetchMovies("/trending/all/week");

/* =====================================================
   SERIES
===================================================== */

/**
 * Obtiene series populares.
 */
export const getPopularSeries = () =>
  fetchMovies("/tv/popular");

/**
 * Obtiene series mejor valoradas.
 */
export const getTopRatedSeries = () =>
  fetchMovies("/tv/top_rated");

/**
 * Obtiene series en tendencia esta semana.
 */
export const getTrendingSeries = () =>
  fetchMovies("/trending/tv/week");

/**
 * Obtiene series que se encuentran en emisión.
 */
export const getOnAirSeries = () =>
  fetchMovies("/tv/on_the_air");

/* =====================================================
   BÚSQUEDA
===================================================== */

/**
 * Busca películas y series por nombre.
 *
 * @param {string} query - Texto de búsqueda.
 * @returns {Promise<Array>} Resultados normalizados.
 */
export async function searchMovies(query) {
  const searchTerm = query.trim();

  if (!searchTerm) {
    return [];
  }

  if (!API_KEY) {
    throw new Error(
      "No se encontró la API Key de TMDB."
    );
  }

  const url = new URL(`${BASE_URL}/search/multi`);

  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "es-ES");
  url.searchParams.set("query", searchTerm);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `No se pudo realizar la búsqueda: ${response.status}`
    );
  }

  const data = await response.json();

  /**
   * El endpoint multi también devuelve personas.
   * Solo conservamos películas y series.
   */
  const results = (data.results || []).filter(
    (item) =>
      item.media_type === "movie" ||
      item.media_type === "tv"
  );

  return normalizeMovies(results);
}
