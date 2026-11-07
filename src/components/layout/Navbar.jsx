
import { useState } from "react";
import { NavLink } from "react-router-dom";

/**
 * Configuración centralizada de navegación.
 *
 * Cada elemento contiene:
 * - label: texto visible en el menú.
 * - path: ruta de navegación.
 */
const navigationItems = [
  { label: "Inicio", path: "/" },
  { label: "Series", path: "/series" },
  { label: "Películas", path: "/peliculas" },
  { label: "Mi lista", path: "/mi-lista" },
];

/**
 * Navbar principal de Netflix Clone.
 *
 * Funcionalidades:
 * - Navegación mediante React Router.
 * - Diseño responsive.
 * - Menú hamburguesa para dispositivos móviles.
 * - Resaltado de la ruta activa.
 * - Cierre automático del menú al navegar.
 */
function Navbar() {
  /**
   * Controla si el menú móvil está abierto.
   */
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * Cierra el menú móvil.
   */
  const closeMenu = () => {
    setMenuOpen(false);
  };

  /**
   * Estilos para enlaces de escritorio.
   */
  const desktopLinkClass = ({ isActive }) =>
    `text-sm transition-colors ${
      isActive
        ? "font-bold text-white"
        : "font-medium text-gray-400 hover:text-white"
    }`;

  /**
   * Estilos para enlaces móviles.
   */
  const mobileLinkClass = ({ isActive }) =>
    `block rounded px-3 py-3 text-sm transition-colors ${
      isActive
        ? "bg-white/10 font-bold text-white"
        : "text-gray-300 hover:bg-white/10"
    }`;

  return (
    <header className="relative z-50 bg-[#141414] text-white">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6"
      >
        {/* Logo principal */}
        <NavLink
          to="/"
          onClick={closeMenu}
          className="text-2xl font-extrabold tracking-wide text-[#E50914]"
        >
          NETFLIX
        </NavLink>

        {/* Navegación para computadoras */}
        <ul className="hidden items-center gap-6 md:flex">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={desktopLinkClass}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Acciones del Navbar */}
        <div className="flex items-center gap-3">
          {/* Acceso al buscador */}
          <NavLink
            to="/buscar"
            onClick={closeMenu}
            aria-label="Buscar películas y series"
            className={({ isActive }) =>
              `rounded p-2 text-sm transition-colors hover:bg-white/10 ${
                isActive
                  ? "font-bold text-white"
                  : "text-gray-300"
              }`
            }
          >
            Buscar
          </NavLink>

          {/* Botón del menú móvil */}
          <button
            type="button"
            aria-label={
              menuOpen ? "Cerrar menú" : "Abrir menú"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded p-2 text-xl hover:bg-white/10 md:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Menú desplegable para celulares */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="absolute left-0 right-0 top-full border-t border-gray-800 bg-[#141414] shadow-xl md:hidden"
        >
          <ul className="flex flex-col px-4 py-3">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  onClick={closeMenu}
                  className={mobileLinkClass}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navbar;
