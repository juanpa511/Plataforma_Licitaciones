const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api-gateway-url.amazonaws.com';

export const apiClient = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getLicitaciones(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/licitaciones?${queryString}`);
  },

  async getLicitacion(id) {
    return this.get(`/licitaciones/${id}`);
  },

  async getEstadisticas() {
    return this.get('/estadisticas');
  }
};

// Función de utilidad para validar links de adjuntos
export const isValidAttachmentLink = (link) => {
  if (!link) return false;
  
  // Verificar que no sea un valor vacío o no disponible
  if (link === 'No disponible' || link === 'N/A' || link === '' || link === null || link === undefined) {
    return false;
  }
  
  // Verificar que sea una URL válida
  if (!link.startsWith('http://') && !link.startsWith('https://')) {
    return false;
  }
  
  // Verificar que sea específicamente un link de Mercado Público para adjuntos
  if (link.includes('mercadopublico.cl') && link.includes('Attachment')) {
    return true;
  }
  
  // También aceptar otros links válidos de adjuntos que no sean de Mercado Público
  if (link.includes('attachment') || link.includes('adjunto') || link.includes('documento')) {
    return true;
  }
  
  return false;
};

// Función para obtener el nombre del archivo adjunto desde la URL
export const getAttachmentFileName = (link) => {
  if (!isValidAttachmentLink(link)) return 'Adjunto';
  
  try {
    const url = new URL(link);
    const pathname = url.pathname;
    const filename = pathname.split('/').pop();
    
    if (filename && filename.includes('.')) {
      return filename;
    }
    
    // Si no hay extensión, intentar extraer del parámetro enc
    const encParam = url.searchParams.get('enc');
    if (encParam) {
      return `Adjunto_${encParam.substring(0, 8)}`;
    }
    
    return 'Adjunto';
  } catch (error) {
    return 'Adjunto';
  }
};