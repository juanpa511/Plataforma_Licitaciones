import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Search, Download, ChevronLeft, ChevronRight,
  Eye, Link as LinkIcon, Paperclip, AlertCircle
} from 'lucide-react';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { apiService } from '../services/api';
import { isValidAttachmentLink } from '../utils/api';
import LicitacionModal from './LicitacionModal';

export default function DashboardPage() {
  const { region: regionParam } = useParams();
  
  const [licitaciones, setLicitaciones] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [totalLicitaciones, setTotalLicitaciones] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking', 'connected', 'error'
  
  // Modal state
  const [selectedLicitacion, setSelectedLicitacion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filtros
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(regionParam ? decodeURIComponent(regionParam) : '');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Ordenamiento
  const [sortField, setSortField] = useState('fechaPublicacion');

  // Listado fijo de regiones y estados
  const REGIONES = [
    'AricaParinacota', 'Tarapaca', 'Antofagasta', 'Atacama', 'Coquimbo', 'Valparaiso',
    'Metropolitana', 'OHiggins', 'Maule', 'Nuble', 'Biobio', 'Araucania',
    'LosRios', 'LosLagos', 'Aysen', 'Magallanes'
  ];
  const ESTADOS = [
    'Publicada', 'Cerrada', 'Adjudicada', 'Desierta', 'Revocada', 'Suspendida'
  ];

  // Cargar datos iniciales
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setApiStatus('checking');
    
    try {
      // Construir parámetros de filtros
      const params = {
        region: selectedRegion || undefined,
        estado: selectedEstado || undefined,
        fechaInicio: fechaDesde || undefined,
        fechaFin: fechaHasta || undefined,
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined
      };
      // Llamar al backend
      const licitacionesResponse = await apiService.getLicitaciones(params);
      if (licitacionesResponse.success) {
        setLicitaciones(licitacionesResponse.data || []);
        setTotalLicitaciones(
          licitacionesResponse.total ||
          (licitacionesResponse.pagination && licitacionesResponse.pagination.total) ||
          (licitacionesResponse.estadisticas && licitacionesResponse.estadisticas.total) ||
          (licitacionesResponse.data ? licitacionesResponse.data.length : 0)
        );
        setApiStatus('connected');
        // Estadísticas
        try {
          const estadisticasResponse = await apiService.getEstadisticas();
          if (estadisticasResponse.success) {
            setEstadisticas(estadisticasResponse.data || {});
          }
        } catch {}
      } else {
        setError('Error al cargar los datos: ' + (licitacionesResponse.error || 'Error desconocido'));
        setApiStatus('error');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
      setApiStatus('error');
    } finally {
      setLoading(false);
    }
  }, [selectedRegion, selectedEstado, fechaDesde, fechaHasta, currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calcular estadísticas locales si no hay del servidor
  const estadisticasLocales = useMemo(() => {
    if (Object.keys(estadisticas).length > 0) {
      return estadisticas;
    }
    
    // Calcular estadísticas desde los datos locales
    const porRegion = {};
    const porEstado = {};
    let licitacionesAbiertas = 0;
    
    licitaciones.forEach(lic => {
      if (lic.region) {
        porRegion[lic.region] = (porRegion[lic.region] || 0) + 1;
      }
      if (lic.estado) {
        porEstado[lic.estado] = (porEstado[lic.estado] || 0) + 1;
        if (lic.estado.toLowerCase().includes('abierta')) {
          licitacionesAbiertas++;
        }
      }
    });
    
    return {
      totalLicitaciones: licitaciones.length,
      licitacionesAbiertas,
      porRegion,
      porEstado,
      fechaUltimaActualizacion: new Date().toISOString()
    };
  }, [licitaciones, estadisticas]);

  // Filtrar licitaciones localmente por búsqueda
  const filteredLicitaciones = useMemo(() => {
    if (!searchTerm) return licitaciones;
    
    return licitaciones.filter(lic => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (lic.nombre && lic.nombre.toLowerCase().includes(searchLower)) ||
        (lic.responsable && lic.responsable.toLowerCase().includes(searchLower)) ||
        (lic.region && lic.region.toLowerCase().includes(searchLower)) ||
        (lic.estado && lic.estado.toLowerCase().includes(searchLower))
      );
    });
  }, [licitaciones, searchTerm]);

  // Calcular paginación
  const totalPagesCalculated = Math.max(1, Math.ceil(totalLicitaciones / itemsPerPage));

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A' || dateString === 'No disponible') return 'No disponible';
    try {
      return new Date(dateString).toLocaleDateString('es-CL');
    } catch {
      return dateString;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSearchInput('');
    setSelectedRegion('');
    setSelectedEstado('');
    setFechaDesde('');
    setFechaHasta('');
    setCurrentPage(1);
  };

  const openModal = async (licitacion) => {
    try {
      const response = await apiService.getLicitacionDetail(licitacion.id);
      if (response.success) {
        setSelectedLicitacion(response.data);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('Error loading licitacion details:', err);
      // Si falla, usar los datos que ya tenemos
      setSelectedLicitacion(licitacion);
      setIsModalOpen(true);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredLicitaciones);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Licitaciones");
    XLSX.writeFile(wb, "licitaciones.xlsx");
  };

  // Datos para CSV
  const csvData = filteredLicitaciones.map(lic => ({
    ID: lic.id,
    Nombre: lic.nombre,
    Responsable: lic.responsable,
    Monto: lic.Monto,
    Región: lic.region,
    Estado: lic.estado,
    'Fecha Publicación': lic.fechaPublicacion,
    'URL Licitación': lic.urlLicitacion,
    'URL Adjuntos': lic.urlAdjuntos
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando licitaciones...</p>
          {apiStatus === 'checking' && (
            <p className="text-sm text-blue-600 mt-2">Verificando conexión con la API...</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error de Conexión</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Estado de la API: {apiStatus}</p>
            <p>URL: {process.env.REACT_APP_API_URL || 'https://sme0l3jfi5.execute-api.us-east-1.amazonaws.com/dev'}</p>
          </div>
          <button
            onClick={loadData}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard de Licitaciones
              </h1>
              {selectedRegion && (
                <p className="text-gray-600 mt-1">
                  Mostrando resultados para: <span className="font-semibold">{selectedRegion}</span>
                </p>
              )}
              {apiStatus === 'connected' && (
                <p className="text-sm text-green-600 mt-1">
                  ✅ Conectado a API Gateway
                </p>
              )}
            </div>
            
            {/* Fecha de extracción */}
            {estadisticasLocales.fechaUltimaActualizacion && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Última actualización:</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(estadisticasLocales.fechaUltimaActualizacion)}
                </p>
              </div>
            )}
            
            {/* Botones de descarga */}
            <div className="flex space-x-2">
              <CSVLink
                data={csvData}
                filename="licitaciones.csv"
                className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>CSV</span>
              </CSVLink>
              
              <button
                onClick={exportToExcel}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Excel</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Layout principal: */}
      <div className="w-full flex flex-row items-start">
        {/* Panel de filtros pegado a la izquierda, compacto y con borde derecho */}
        <aside className="min-w-[220px] max-w-xs w-full lg:w-60 bg-white border-r border-gray-200 h-full p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Limpiar filtros
            </button>
          </div>

          <div className="space-y-6">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Búsqueda
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setCurrentPage(1);
                      setSearchTerm(searchInput);
                    }
                  }}
                  placeholder="Buscar licitaciones..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Región */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Región
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => { setSelectedRegion(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las regiones</option>
                {REGIONES.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={selectedEstado}
                onChange={(e) => { setSelectedEstado(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                {ESTADOS.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            {/* Fechas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fechas
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => { setFechaDesde(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => { setFechaHasta(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </aside>
        {/* Contenido principal sin margen izquierdo, ocupa todo el espacio */}
        <main className="flex-1 px-4">
          {/* Estadísticas de resultados */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {licitaciones.length} licitaciones encontradas
                </h3>
                <p className="text-gray-600">
                  Página {currentPage} de {totalPagesCalculated}
                </p>
                <p className="text-sm text-gray-500">
                  Total: {estadisticasLocales.totalLicitaciones} licitaciones 
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Ordenar por:</span>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="fechaPublicacion">Fecha Publicación</option>
                  <option value="nombre">Nombre</option>
                  <option value="Monto">Monto</option>
                  <option value="region">Región</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabla de licitaciones */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Licitación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Región
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Publicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {licitaciones.map((licitacion) => (
                    <tr key={licitacion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-1">
                            {licitacion.nombre}
                          </h4>
                          <p className="text-xs text-gray-500">
                            ID: {licitacion.id}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{licitacion.titulo}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {licitacion.Monto || 'No disponible'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{licitacion.region}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          licitacion.estado?.toLowerCase().includes('abierta') 
                            ? 'bg-green-100 text-green-800'
                            : licitacion.estado?.toLowerCase().includes('cerrada')
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {licitacion.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(licitacion.fechaPublicacion)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal(licitacion)}
                            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {licitacion.link && (
                            <a
                              href={licitacion.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-green-600 hover:text-green-800"
                              title="Ver en Mercado Público"
                            >
                              <LinkIcon className="h-4 w-4" />
                            </a>
                          )}
                          {isValidAttachmentLink(licitacion.linkAdjuntos) ? (
                            <a
                              href={licitacion.linkAdjuntos}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-purple-600 hover:text-purple-800"
                              title="Ver adjuntos"
                            >
                              <Paperclip className="h-4 w-4" />
                            </a>
                          ) : (
                            <span
                              className="inline-flex items-center space-x-1 text-gray-400 cursor-not-allowed"
                              title="Adjuntos no disponibles"
                            >
                              <Paperclip className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación: */}
            {totalPagesCalculated > 1 && (
              <div className="flex justify-end mt-4">
                <div className="bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPagesCalculated, currentPage + 1))}
                        disabled={currentPage === totalPagesCalculated}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Siguiente
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
                          <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalLicitaciones)}</span> de{' '}
                          <span className="font-medium">{totalLicitaciones}</span> resultados
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          {/* Números de página (máximo 5) */}
                          {Array.from({ length: Math.min(5, totalPagesCalculated) }, (_, i) => {
                            let page = 1;
                            if (totalPagesCalculated <= 5) {
                              page = i + 1;
                            } else if (currentPage <= 3) {
                              page = i + 1;
                            } else if (currentPage >= totalPagesCalculated - 2) {
                              page = totalPagesCalculated - 4 + i;
                            } else {
                              page = currentPage - 2 + i;
                            }
                            if (page < 1 || page > totalPagesCalculated) return null;
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === page
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                          <button
                            onClick={() => setCurrentPage(Math.min(totalPagesCalculated, currentPage + 1))}
                            disabled={currentPage === totalPagesCalculated}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div> {/* <-- cierre correcto del div de la tabla */}
        </main>
      </div> {/* <-- cierre correcto del layout principal */}

      {/* Modal de detalles */}
      <LicitacionModal
        licitacion={selectedLicitacion}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLicitacion(null);
        }}
      />
    </div>
  );
} 