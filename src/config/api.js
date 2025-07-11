// Configuración de la API
export const API_CONFIG = {
  // URL base del API Gateway
  BASE_URL: process.env.REACT_APP_API_URL || 'https://sme0l3jfi5.execute-api.us-east-1.amazonaws.com/dev',
  
  // Rutas disponibles
  ENDPOINTS: {
    LICITACIONES: '/licitaciones',
    LICITACIONES_DETAILS: '/licitaciones',
    ESTADISTICAS: '/estadisticas'
  },
  
  // Configuración de paginación
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50
  },
  
  // Timeouts
  TIMEOUT: 30000 // 30 segundos
};

// Función para construir URLs completas
export const buildApiUrl = (endpoint, params = {}) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Reemplazar parámetros en la URL
  Object.keys(params).forEach(key => {
    url = url.replace(`{${key}}`, params[key]);
  });
  
  return url;
};

// Función para manejar errores de API
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Error de respuesta del servidor
    return `Error ${error.response.status}: ${error.response.data?.error || 'Error del servidor'}`;
  } else if (error.request) {
    // Error de red
    return 'Error de conexión. Verifica tu conexión a internet.';
  } else {
    // Otro tipo de error
    return error.message || 'Error desconocido';
  }
}; 