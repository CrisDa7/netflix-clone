
/**
 * Muestra la película destacada en la página de inicio.
 * Por ahora utilizamos información de ejemplo.
 */

function HeroBanner() {
  return (
    <section
      className="relative flex min-h-[450px] items-end bg-cover bg-center md:min-h-[600px]"
      style={{
        backgroundImage:
          "linear-gradient(to top, #141414 2%, transparent 80%), linear-gradient(to right, rgba(0,0,0,0.85), transparent 85%), url('https://image.tmdb.org/t/p/original/49WJfeN0moxb9IPfGn8AIqMGskD.jpg')",
      }}
    >
      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-3xl px-5 pb-16 md:px-12 md:pb-24">
        <span className="mb-3 inline-block text-sm font-semibold tracking-widest text-red-500">
          SERIE DESTACADA
        </span>

        <h1 className="text-4xl font-extrabold md:text-6xl">
          Stranger Things
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-200 md:text-lg">
          Cuando un niño desaparece, sus amigos descubren
          misterios sobrenaturales y experimentos secretos
          en una pequeña ciudad.
        </p>

        {/* Botones de acción */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-300"
          >
            ▶ Reproducir
          </button>

          <button
            type="button"
            className="rounded bg-gray-600/70 px-6 py-3 font-bold text-white transition hover:bg-gray-600"
          >
            ⓘ Más información
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
