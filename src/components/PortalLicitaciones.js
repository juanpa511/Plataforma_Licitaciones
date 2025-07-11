import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building, Calendar, MapPin, Users, TrendingUp, Download, Filter, ChevronRight, ExternalLink, Eye, FileText } from 'lucide-react';
import { apiService } from '../services/api';
import { isValidAttachmentLink } from '../utils/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api-gateway-url.amazonaws.com';

const PortalLicitaciones = () => {
  const navigate = useNavigate();
  const [licitaciones, setLicitaciones] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    region: 'all',
    estado: 'all',
    fechaInicio: '',
    fechaFin: '',
    page: 1,
    limit: 10
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const regiones = [
    { codigo: 'all', nombre: 'Todas las regiones' },
    { codigo: 'Tarapaca', nombre: 'Tarapacá' },
    { codigo: 'Antofagasta', nombre: 'Antofagasta' },
    { codigo: 'Atacama', nombre: 'Atacama' },
    { codigo: 'Coquimbo', nombre: 'Coquimbo' },
    { codigo: 'Valparaiso', nombre: 'Valparaíso' },
    { codigo: 'OHiggins', nombre: "O'Higgins" },
    { codigo: 'Maule', nombre: 'Maule' },
    { codigo: 'Biobio', nombre: 'Biobío' },
    { codigo: 'Araucania', nombre: 'Araucanía' },
    { codigo: 'LosLagos', nombre: 'Los Lagos' },
    { codigo: 'Aysen', nombre: 'Aysén' },
    { codigo: 'Magallanes', nombre: 'Magallanes' },
    { codigo: 'Metropolitana', nombre: 'Metropolitana' },
    { codigo: 'LosRios', nombre: 'Los Ríos' },
    { codigo: 'AricaParinacota', nombre: 'Arica y Parinacota' },
    { codigo: 'Nuble', nombre: 'Ñuble' }
  ];

  const fetchLicitaciones = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filtros).toString();
      const response = await fetch(`${API_BASE_URL}/licitaciones?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setLicitaciones(data.data);
        setEstadisticas(data.estadisticas);
      }
    } catch (error) {
      console.error('Error fetching licitaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEstadisticasGenerales = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/estadisticas`);
      const data = await response.json();
      
      if (data.success) {
        setEstadisticas(data.data);
      }
    } catch (error) {
      console.error('Error fetching estadísticas:', error);
    }
  };

  useEffect(() => {
    fetchLicitaciones();
    fetchEstadisticasGenerales();
  }, [filtros]);

  const formatMonto = (monto) => {
    if (!monto || monto === 'No disponible') return 'No disponible';
    return monto;
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    return new Date(fecha).toLocaleDateString('es-CL');
  };

  const getEstadoColor = (estado) => {
    if (estado.toLowerCase().includes('abierta')) return 'bg-green-100 text-green-800';
    if (estado.toLowerCase().includes('cerrada')) return 'bg-red-100 text-red-800';
    if (estado.toLowerCase().includes('adjudicada')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleFiltroChange = (key, value) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page when filters change
    }));
  };

  const handleVerDetalles = (licitacionId) => {
    navigate(`/licitacion/${licitacionId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Portal de Licitaciones</h1>
              <span className="text-sm text-gray-500">de Chile</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                <Users className="h-5 w-5 inline mr-1" />
                Inicio
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Search className="h-4 w-4 inline mr-1" />
                Explorar Licitaciones
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Portal de Licitaciones
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            de Chile
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Descubre oportunidades de negocio en todo el territorio
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Explora licitaciones por región y accede a información detallada
          </p>
          <button 
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Explorar Licitaciones
            <ChevronRight className="h-5 w-5 inline ml-2" />
          </button>
        </div>
      </section>

      {/* Estadísticas Generales */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-center mb-4">Estadísticas Generales</h3>
          <p className="text-gray-600 text-center mb-12">Datos actualizados del portal de licitaciones</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-lg text-center">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-3xl font-bold text-gray-900">
                ${estadisticas.montoTotal ? estadisticas.montoTotal.toLocaleString() : '853,550,000,000'}
              </h4>
              <p className="text-gray-600">Monto Total en Licitaciones</p>
            </div>
            
            <div className="bg-green-50 p-8 rounded-lg text-center">
              <Building className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-3xl font-bold text-gray-900">
                {estadisticas.licitacionesAbiertas || 11}
              </h4>
              <p className="text-gray-600">Licitaciones Abiertas</p>
            </div>
            
            <div className="bg-purple-50 p-8 rounded-lg text-center">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h4 className="text-3xl font-bold text-gray-900">
                {estadisticas.organismos || 16}
              </h4>
              <p className="text-gray-600">Organismos Licitantes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros */}
      {mostrarFiltros && (
        <section className="py-8 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-700">Filtros:</span>
              </div>
              
              <select 
                value={filtros.region}
                onChange={(e) => handleFiltroChange('region', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {regiones.map(region => (
                  <option key={region.codigo} value={region.codigo}>
                    {region.nombre}
                  </option>
                ))}
              </select>
              
              <select 
                value={filtros.estado}
                onChange={(e) => handleFiltroChange('estado', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="abierta">Abierta</option>
                <option value="cerrada">Cerrada</option>
                <option value="adjudicada">Adjudicada</option>
              </select>
              
              <input
                type="date"
                value={filtros.fechaInicio}
                onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Fecha inicio"
              />
              
              <input
                type="date"
                value={filtros.fechaFin}
                onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Fecha fin"
              />
              
              <button
                onClick={() => setFiltros({
                  region: 'all',
                  estado: 'all',
                  fechaInicio: '',
                  fechaFin: '',
                  page: 1,
                  limit: 10
                })}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Lista de Licitaciones */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold">Licitaciones Disponibles</h3>
            <div className="text-sm text-gray-600">
              {estadisticas.total || 0} resultados encontrados
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando licitaciones...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {licitaciones.map((licitacion) => (
                <div key={licitacion.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {licitacion.titulo}
                      </h4>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {licitacion.region}
                        <span className="mx-2">•</span>
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatFecha(licitacion.fechaPublicacion)}
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Responsable:</strong> {licitacion.responsable}
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Monto:</strong> {formatMonto(licitacion.Monto)}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Fecha de cierre:</strong> {formatFecha(licitacion.fechaCierre)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(licitacion.estado)}`}>
                        {licitacion.estado}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleVerDetalles(licitacion.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Eye className="h-4 w-4 inline mr-1" />
                          Ver detalles
                        </button>
                        <a 
                          href={licitacion.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <ExternalLink className="h-4 w-4 inline mr-1" />
                          Mercado Público
                        </a>
                        {isValidAttachmentLink(licitacion.linkAdjuntos) ? (
                          <a 
                            href={licitacion.linkAdjuntos}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                            title="Abrir adjuntos en nueva pestaña"
                          >
                            <Download className="h-4 w-4 inline mr-1" />
                            Adjuntos
                          </a>
                        ) : (
                          <button
                            disabled
                            className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed text-sm"
                            title="Adjuntos no disponibles"
                          >
                            <Download className="h-4 w-4 inline mr-1" />
                            Sin Adjuntos
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 pt-3 border-t">
                    ID: {licitacion.id}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Paginación */}
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => handleFiltroChange('page', Math.max(1, filtros.page - 1))}
                disabled={filtros.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Página {filtros.page}
              </span>
              <button
                onClick={() => handleFiltroChange('page', filtros.page + 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            Portal de Licitaciones de Chile - Desarrollado con tecnología AWS
          </p>
          <p className="text-xs mt-2 text-gray-400">
            Última actualización: {estadisticas.fechaUltimaActualizacion ? new Date(estadisticas.fechaUltimaActualizacion).toLocaleString('es-CL') : 'No disponible'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PortalLicitaciones;