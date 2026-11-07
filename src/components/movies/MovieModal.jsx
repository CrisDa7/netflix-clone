
import { useEffect } from "react";

/**
 * MovieModal
 *
 * Muestra los detalles de una película o serie.
 * Permite añadir o eliminar contenido de Mi lista.
 */
function MovieModal({
  movie,
  onClose,
  onToggleWatchlist,
  isSaved,
}) {
  /**
   * Bloquea el desplazamiento del documento
   * mientras el modal está abierto.
   *
   * También permite cerrarlo con Escape.
   */
  useEffect(() => {
    if (!movie) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [movie, onClose]);

  // No renderiza nada si no hay película seleccionada.
  if (!movie) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-modal-title"
        className="relative max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-lg bg-[#181818] text-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Botón para cerrar el modal */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalles"
          className="absolute right-4 top-4 z-10 rounded-full bg-black/80 px-3 py-1 text-2xl hover:bg-gray-700"
        >
          ×
        </button>

        {/* Imagen de la película */}
        {movie.image && (
          <div className="relative">
            <img
              src={movie.image}
              alt=""
              className="aspect-video w-full object-cover"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
          </div>
        )}

        {/* Información de la película */}
        <div className="p-5 sm:p-8">
          <h2
            id="movie-modal-title"
            className="text-2xl font-bold sm:text-3xl"
          >
            {movie.title}
          </h2>

          {/* Calificación, año y tipo */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <span className="font-semibold text-green-400">
              ★ {typeof movie.rating === "number"
                ? movie.rating.toFixed(1)
                : "N/D"}{" "}
              / 10
            </span>

            <span className="text-gray-300">
              {movie.releaseDate?.slice(0, 4) || "Sin fecha"}
            </span>

            <span className="rounded border border-gray-500 px-2">
              {movie.mediaType === "tv" ? "Serie" : "Película"}
            </span>
          </div>

          {/* Botón de favoritos */}
          <button
            type="button"
            onClick={() => onToggleWatchlist(movie)}
            aria-pressed={isSaved}
            className={`mt-6 rounded-md px-5 py-3 font-semibold transition-colors ${
              isSaved
                ? "bg-gray-600 text-white hover:bg-gray-700"
                : "bg-white text-black hover:bg-gray-300"
            }`}
          >
            {isSaved ? "✓ En Mi lista" : "+ Mi lista"}
          </button>

          {/* Sinopsis */}
          <p className="mt-6 leading-relaxed text-gray-300">
            {movie.overview || "Sin descripción disponible."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
