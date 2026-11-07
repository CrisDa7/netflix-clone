
import { useRef } from "react";
import MovieCard from "./MovieCard";

/**
 * MovieRow
 * Muestra películas en un carrusel horizontal.
 * Permite navegar mediante flechas o desplazamiento táctil.
 */
function MovieRow({ title, movies, onMovieClick }) {
  // Referencia al contenedor desplazable.
  const rowRef = useRef(null);

  // Desplaza el carrusel hacia la izquierda o derecha.
  const scroll = (direction) => {
    if (!rowRef.current) return;

    const distance = rowRef.current.clientWidth * 0.8;

    rowRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <section className="group relative w-full min-w-0 overflow-hidden py-5">
      <h2 className="mb-4 px-5 text-xl font-bold md:px-12 md:text-2xl">
        {title}
      </h2>

      <div className="relative">
        {/* Flecha izquierda */}
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label={`Desplazar ${title} a la izquierda`}
          className="absolute left-0 top-0 z-10 hidden h-full w-10 items-center justify-center bg-black/60 text-3xl opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100 focus:opacity-100 md:flex"
        >
          ‹
        </button>

        {/* Películas */}
        <div
          ref={rowRef}
          className="scrollbar-hide flex w-full min-w-0 gap-4 overflow-x-auto overscroll-x-contain px-5 pb-5 md:px-12"
        >
          {movies.map((movie) => (
            <MovieCard
              key={`${movie.mediaType}-${movie.id}`}
              movie={movie}
              onClick={onMovieClick}
            />
          ))}
        </div>

        {/* Flecha derecha */}
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label={`Desplazar ${title} a la derecha`}
          className="absolute right-0 top-0 z-10 hidden h-full w-10 items-center justify-center bg-black/60 text-3xl opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100 focus:opacity-100 md:flex"
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default MovieRow;
