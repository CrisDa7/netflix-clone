
import { useEffect, useState } from "react";

/**
 * Caché compartida del catálogo.
 *
 * Almacena las categorías consultadas correctamente
 * para evitar solicitudes repetidas durante la sesión.
 */
const catalogCache = new Map();

/**
 * Solicitudes actualmente en ejecución.
 *
 * Evita duplicar peticiones cuando varios componentes
 * solicitan una misma categoría.
 */
const pendingRequests = new Map();

/**
 * Obtiene una categoría desde la caché o TMDB.
 *
 * @param {Object} category - Configuración de categoría.
 * @returns {Promise<Array>} Películas o series.
 */
async function fetchCategory(category) {
  const { id, fetcher } = category;

  // Recupera los resultados existentes.
  if (catalogCache.has(id)) {
    return catalogCache.get(id);
  }

  // Reutiliza una solicitud que ya está ejecutándose.
  if (pendingRequests.has(id)) {
    return pendingRequests.get(id);
  }

  // Crea una nueva solicitud.
  const request = Promise.resolve()
    .then(() => fetcher())
    .then((movies) => {
      catalogCache.set(id, movies);

      return movies;
    })
    .finally(() => {
      pendingRequests.delete(id);
    });

  pendingRequests.set(id, request);

  return request;
}

/**
 * Construye el estado inicial a partir de la caché.
 *
 * Esta función es pura respecto al estado de React:
 * solamente consulta los datos existentes.
 *
 * @param {Array} categories - Categorías solicitadas.
 * @returns {Object} Estado inicial del catálogo.
 */
function getInitialCatalog(categories) {
  const catalog = {};

  categories.forEach((category) => {
    if (catalogCache.has(category.id)) {
      catalog[category.id] = catalogCache.get(category.id);
    }
  });

  return catalog;
}

/**
 * Hook personalizado para administrar el catálogo.
 *
 * Responsabilidades:
 * - Consultar solamente las categorías necesarias.
 * - Reutilizar resultados almacenados.
 * - Evitar peticiones duplicadas.
 * - Gestionar errores independientes.
 * - Mantener el estado de carga.
 *
 * @param {Array} categories - Categorías de la página.
 * @returns {Object} Catálogo, carga y errores.
 */
export function useMovieCatalog(categories) {
  /**
   * Identifica el conjunto de categorías solicitado.
   */
  const categoryKey = categories
    .map((category) => category.id)
    .join("|");

  /**
   * Guarda los resultados de la última carga.
   *
   * Se identifica con categoryKey para evitar
   * mostrar resultados de otra página.
   */
  const [result, setResult] = useState(() => ({
    key: categoryKey,
    catalog: getInitialCatalog(categories),
    errors: {},
  }));

  /**
   * Obtiene los resultados aplicables a la página.
   *
   * Cuando cambia la ruta, no utilizamos datos
   * pendientes pertenecientes a otra categoría.
   */
  const currentResult =
    result.key === categoryKey ? result : null;

  /**
   * Recupera datos existentes de la caché.
   *
   * No modifica el estado de React durante el render.
   */
  const cachedCatalog = getInitialCatalog(categories);

  /**
   * Combina los resultados de la caché con el
   * último estado correspondiente a esta página.
   */
  const catalog = {
    ...cachedCatalog,
    ...(currentResult?.catalog || {}),
  };

  /**
   * Comprueba las categorías pendientes.
   */
  const missingCategories = categories.filter(
    (category) =>
      !Object.prototype.hasOwnProperty.call(
        catalog,
        category.id
      )
  );

  /**
   * Los errores solo corresponden a la página actual.
   */
  const errors = currentResult?.errors || {};

  /**
   * Mantiene el indicador de carga mientras
   * existan categorías pendientes sin errores.
   */
  const loading = missingCategories.some(
    (category) => !errors[category.id]
  );

  /**
   * Carga las categorías necesarias.
   *
   * Promise.allSettled permite conservar las
   * consultas correctas aunque alguna falle.
   */
  useEffect(() => {
    let active = true;

    /**
     * Se obtiene la lista de categorías que todavía
     * no están almacenadas en caché.
     */
    const pendingCategories = categories.filter(
      (category) => !catalogCache.has(category.id)
    );

    // No hay solicitudes pendientes.
    if (pendingCategories.length === 0) {
      return () => {
        active = false;
      };
    }

    async function loadCatalog() {
      const results = await Promise.allSettled(
        pendingCategories.map(fetchCategory)
      );

      // Evita actualizar un componente desmontado
      // o un efecto que ya fue reemplazado.
      if (!active) return;

      const newCatalog = getInitialCatalog(categories);
      const newErrors = {};

      results.forEach((response, index) => {
        const category = pendingCategories[index];

        if (response.status === "fulfilled") {
          newCatalog[category.id] = response.value;
        } else {
          newErrors[category.id] =
            response.reason?.message ||
            "No se pudo cargar esta categoría.";
        }
      });

      /**
       * Actualiza el estado después de finalizar
       * las operaciones asíncronas.
       */
      setResult({
        key: categoryKey,
        catalog: newCatalog,
        errors: newErrors,
      });
    }

    loadCatalog();

    return () => {
      active = false;
    };

    // categoryKey identifica las categorías de la página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryKey]);

  return {
    catalog,
    loading,
    errors,
  };
}
