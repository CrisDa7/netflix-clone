
/**
 * Gestión de películas y series favoritas.
 *
 * Utilizamos localStorage para conservar los datos
 * incluso después de cerrar el navegador.
 */

const STORAGE_KEY = "netflix-clone-watchlist";

/**
 * Recupera la lista de favoritos almacenada.
 * @returns {Array} Películas y series guardadas.
 */
export function getWatchlist() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error al recuperar Mi lista:", error);
    return [];
  }
}

/**
 * Guarda la lista de favoritos.
 * @param {Array} movies - Lista actualizada.
 */
export function saveWatchlist(movies) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(movies)
    );
  } catch (error) {
    console.error("Error al guardar Mi lista:", error);
  }
}

/**
 * Comprueba si una película o serie está guardada.
 * Compara el ID y el tipo para evitar confusiones
 * entre películas y series.
 */
export function isInWatchlist(movies, movie) {
  return movies.some(
    (item) =>
      item.id === movie.id &&
      item.mediaType === movie.mediaType
  );
}
