
/**
 * Tarjeta reutilizable.
 * Ejecuta onClick al seleccionar una película.
 */
function MovieCard({ movie, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(movie)}
      className="group w-44 shrink-0 cursor-pointer text-left sm:w-56 md:w-64"
      aria-label={`Ver detalles de ${movie.title}`}
    >
      <div className="overflow-hidden rounded-md bg-gray-800">
        {movie.image ? (
          <img
            src={movie.image}
            alt={movie.title}
            loading="lazy"
            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center text-sm text-gray-400">
            Sin imagen
          </div>
        )}
      </div>

      <h3 className="mt-2 truncate text-sm font-medium text-gray-200">
        {movie.title}
      </h3>
    </button>
  );
}

export default MovieCard;
