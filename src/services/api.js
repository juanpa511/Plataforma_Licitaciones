import React from 'react';
import { API_CONFIG, buildApiUrl, handleApiError } from '../config/api';

// Función helper para hacer requests
const apiRequest = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error en la petición');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Servicios de la API
export const apiService = {
  // Obtener licitaciones con filtros
  getLicitaciones: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.region) queryParams.append('region', params.region);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.estado) queryParams.append('estado', params.estado);
    if (params.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
    if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.LICITACIONES}${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  // Obtener detalles de una licitación específica usando el endpoint dedicado
  getLicitacionDetail: async (id) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.LICITACIONES_DETAILS}/${id}`;
    return apiRequest(endpoint);
  },

  // Obtener estadísticas generales usando el endpoint dedicado
  getEstadisticas: async () => {
    return apiRequest(API_CONFIG.ENDPOINTS.ESTADISTICAS);
  },
};

// Hook personalizado para manejar estados de carga y error
export const useApiState = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const executeRequest = async (apiCall) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, executeRequest };
}; 