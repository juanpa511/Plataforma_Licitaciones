import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Building, ExternalLink, Download, Clock, User, DollarSign, FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { isValidAttachmentLink, getAttachmentFileName } from '../utils/api';

const LicitacionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [licitacion, setLicitacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLicitacion = async () => {
      try {
        const response = await apiService.getLicitacionDetail(id);
        
        if (response.success) {
          setLicitacion(response.data);
        } else {
          setError(response.error || 'Error al cargar la licitación');
        }
      } catch (err) {
        setError('Error al cargar la licitación');
        console.error('Error fetching licitacion:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLicitacion();
  }, [id]);

  const formatFecha = (fecha) => {
    if (!fecha || fecha === 'N/A' || fecha === 'No disponible') return 'No disponible';
    try {
      return new Date(fecha).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fecha;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 'No disponible') return 'No disponible';
    const montoMatch = amount.match(/[\d.,]+/);
    if (montoMatch) {
      const monto = parseFloat(montoMatch[0].replace(/[.,]/g, ''));
      if (!isNaN(monto)) {
        return new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(monto);
      }
    }
    return amount;
  };

  const getEstadoColor = (estado) => {
    if (!estado) return 'bg-gray-100 text-gray-800';
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('abierta')) return 'bg-green-100 text-green-800';
    if (estadoLower.includes('cerrada')) return 'bg-red-100 text-red-800';
    if (estadoLower.includes('adjudicada')) return 'bg-blue-100 text-blue-800';
    if (estadoLower.includes('desierta')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getEstadoIcon = (estado) => {
    if (!estado) return <AlertCircle className="h-4 w-4" />;
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('abierta')) return <CheckCircle className="h-4 w-4" />;
    if (estadoLower.includes('cerrada')) return <XCircle className="h-4 w-4" />;
    if (estadoLower.includes('adjudicada')) return <CheckCircle className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  const isLinkValid = (link) => {
    return link && 
           link !== 'No disponible' && 
           link !== 'N/A' && 
           link !== '' && 
           (link.startsWith('http') || link.startsWith('https'));
  };

  const handleAdjuntosClick = async (link) => {
    try {
      // Intentar abrir el link en una nueva pestaña
      const newWindow = window.open(link, '_blank', 'noopener,noreferrer');
      
      // Si el navegador bloquea la ventana emergente, mostrar un mensaje
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        alert('El navegador bloqueó la ventana emergente. Por favor, habilita las ventanas emergentes para este sitio o copia el link manualmente.');
      }
    } catch (error) {
      console.error('Error al abrir adjuntos:', error);
      alert('Error al abrir los adjuntos. Por favor, intenta copiar el link manualmente.');
    }
  };

  const copyAdjuntosLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      alert('Link de adjuntos copiado al portapapeles');
    } catch (error) {
      console.error('Error al copiar link:', error);
      alert('Error al copiar el link. Por favor, cópialo manualmente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
              </button>
              <div className="flex items-center space-x-3">
                <Building className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Detalle de Licitación</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header de la licitación */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{licitacion.titulo}</h2>
                <p className="text-blue-100">ID: {licitacion.id}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getEstadoIcon(licitacion.estado)}
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getEstadoColor(licitacion.estado)} bg-opacity-20 text-white`}>
                  {licitacion.estado}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="truncate">{licitacion.region}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="truncate">Publicado: {formatFecha(licitacion.fechaPublicacion)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span className="truncate">Cierre: {formatFecha(licitacion.fechaCierre)}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                <span className="truncate">{formatCurrency(licitacion.Monto)}</span>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-6 space-y-6">
            {/* Información general */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Información General
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Responsable</p>
                    <p className="text-sm text-gray-600">{licitacion.responsable}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Monto</p>
                    <p className="text-sm text-gray-600 font-semibold">{formatCurrency(licitacion.Monto)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Región</p>
                    <p className="text-sm text-gray-600">{licitacion.region}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Fecha de Extracción</p>
                    <p className="text-sm text-gray-600">{formatFecha(licitacion.fechaExtraccion)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Fechas Importantes
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900">Inicio de Preguntas</span>
                    <span className="text-sm text-gray-600">{formatFecha(licitacion.fechaInicioPreguntas)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900">Fin de Preguntas</span>
                    <span className="text-sm text-gray-600">{formatFecha(licitacion.fechaFinPreguntas)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900">Publicación de Respuestas</span>
                    <span className="text-sm text-gray-600">{formatFecha(licitacion.fechaPublicacionRespuestas)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900">Fecha de Adjudicación</span>
                    <span className="text-sm text-gray-600">{formatFecha(licitacion.fechaAdjudicacion)}</span>
                  </div>
                  {licitacion.fechaVisitaTerreno && licitacion.fechaVisitaTerreno !== 'N/A' && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-900">Visita a Terreno</span>
                      <span className="text-sm text-gray-600">{formatFecha(licitacion.fechaVisitaTerreno)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Criterios de Evaluación */}
            {licitacion.criteriosEvaluacion && licitacion.criteriosEvaluacion.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Criterios de Evaluación
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Criterio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ponderación
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {licitacion.criteriosEvaluacion.map((criterio, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {criterio.item}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {criterio.ponderacion}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
              <div className="flex flex-wrap gap-4">
                {isLinkValid(licitacion.link) && (
                  <a
                    href={licitacion.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver en Mercado Público
                  </a>
                )}
                
                {isValidAttachmentLink(licitacion.linkAdjuntos) ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAdjuntosClick(licitacion.linkAdjuntos)}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center"
                      title={`Abrir adjuntos: ${getAttachmentFileName(licitacion.linkAdjuntos)}`}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Adjuntos
                    </button>
                    <button
                      onClick={() => copyAdjuntosLink(licitacion.linkAdjuntos)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                      title="Copiar link de adjuntos al portapapeles"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Copiar Link
                    </button>
                  </div>
                ) : (
                  <button
                    disabled
                    className="bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed inline-flex items-center"
                    title="Adjuntos no disponibles para esta licitación"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Adjuntos No Disponibles
                  </button>
                )}

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(licitacion.link || '');
                    alert('Link copiado al portapapeles');
                  }}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Copiar Link
                </button>

                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Dashboard
                </button>
              </div>
            </div>

            {/* Información adicional */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Técnica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900">ID de Licitación</p>
                  <p className="text-gray-600 font-mono">{licitacion.id}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Estado</p>
                  <p className="text-gray-600">{licitacion.estado}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Fecha de Extracción</p>
                  <p className="text-gray-600">{formatFecha(licitacion.fechaExtraccion)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Región</p>
                  <p className="text-gray-600">{licitacion.region}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LicitacionDetail;