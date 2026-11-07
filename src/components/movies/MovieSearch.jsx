
import { useEffect, useState } from "react";
import { searchMovies } from "../../services/tmdb";
import MovieCard from "./MovieCard";

function MovieSearch({ onMovieClick }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    if (!query.trim()) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const movies = await searchMovies(query);

        if (active) setResults(movies);
      } catch {
        if (active) {
          setError("No se pudieron cargar los resultados.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 500);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const handleChange = (event) => {
    setQuery(event.target.value);
    setResults([]);
    setError("");
    setLoading(false);
  };

  return (
    <section
      id="buscar"
      className="w-full px-5 py-10 md:px-12"
    >
      <h2 className="mb-5 text-2xl font-bold">
        Buscar películas y series
      </h2>

      <input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="Buscar Batman, Stranger Things..."
        aria-label="Buscar películas y series"
        className="w-full max-w-xl rounded-md border border-gray-600 bg-[#222] px-4 py-3 text-white outline-none focus:border-red-600"
      />

      {loading && (
        <p className="mt-5 text-gray-400">
          Buscando...
        </p>
      )}

      {error && (
        <p className="mt-5 text-red-400" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && query.trim() &&
        results.length === 0 && (
          <p className="mt-5 text-gray-400">
            Sin resultados para mostrar.
          </p>
        )}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {results.map((movie) => (
          <MovieCard
            key={`${movie.mediaType}-${movie.id}`}
            movie={movie}
            onClick={onMovieClick}
          />
        ))}
      </div>
    </section>
  );
}

export default MovieSearch;
