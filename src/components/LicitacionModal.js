import React from 'react';
import { X, ExternalLink, Paperclip, Calendar, MapPin, Building, DollarSign, FileText, Clock, User } from 'lucide-react';

export default function LicitacionModal({ licitacion, isOpen, onClose }) {
  if (!isOpen || !licitacion) return null;

  const formatCurrency = (amount) => {
    if (!amount) return 'No especificado';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-CL');
  };

  const getDaysUntilClose = (fechaCierre) => {
    if (!fechaCierre) return null;
    const today = new Date();
    const closeDate = new Date(fechaCierre);
    const diffTime = closeDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilClose = getDaysUntilClose(licitacion.fechaCierre || licitacion.fecha_cierre);

  // Badge de estado
  const getEstadoBadge = (estado) => {
    if (!estado) return <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">Desconocido</span>;
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('abierta')) return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Abierta</span>;
    if (estadoLower.includes('cerrada')) return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">Cerrada</span>;
    if (estadoLower.includes('adjudicada')) return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">Adjudicada</span>;
    if (estadoLower.includes('desierta')) return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">Desierta</span>;
    return <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">{estado}</span>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-500" /> Detalles de Licitación
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-mono">ID: {licitacion.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-blue-600 transition-colors rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Información principal */}
        <div className="px-8 py-6 space-y-8">
          {/* Título y estado */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" /> {licitacion.titulo || licitacion.nombre}
            </h3>
            <div>{getEstadoBadge(licitacion.estado)}</div>
          </div>

          {/* Grid de datos clave */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="h-5 w-5 text-blue-400" />
                <span className="font-medium">Responsable:</span>
                <span>{licitacion.responsable}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-5 w-5 text-green-400" />
                <span className="font-medium">Región:</span>
                <span>{licitacion.region}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Monto:</span>
                <span className="font-semibold">{licitacion.Monto || licitacion.monto || formatCurrency(licitacion.monto)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Building className="h-5 w-5 text-purple-400" />
                <span className="font-medium">Organismo:</span>
                <span>{licitacion.organismo || licitacion.empresa_solicitante}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-5 w-5 text-pink-400" />
                <span className="font-medium">Publicación:</span>
                <span>{licitacion.fechaPublicacion || licitacion.fecha_publicacion}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-5 w-5 text-red-400" />
                <span className="font-medium">Cierre:</span>
                <span>{licitacion.fechaCierre || licitacion.fecha_cierre}</span>
              </div>
              {daysUntilClose !== null && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-5 w-5 text-orange-400" />
                  <span className="font-medium">Días hasta cierre:</span>
                  <span className={`font-bold ${daysUntilClose <= 7 ? 'text-red-600' : daysUntilClose <= 30 ? 'text-yellow-600' : 'text-green-600'}`}>{daysUntilClose} días</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Adjudicación:</span>
                <span>{licitacion.fechaAdjudicacion}</span>
              </div>
            </div>
          </div>

          {/* Descripción */}
          {licitacion.descripcion && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" /> Descripción
              </h4>
              <p className="text-gray-700 leading-relaxed">{licitacion.descripcion}</p>
            </div>
          )}

          {/* Fechas adicionales */}
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-pink-400" /> Fechas Importantes
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {licitacion.fechaInicioPreguntas && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Inicio Preguntas:</span>
                  <span className="font-medium">{licitacion.fechaInicioPreguntas}</span>
                </div>
              )}
              {licitacion.fechaFinPreguntas && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fin Preguntas:</span>
                  <span className="font-medium">{licitacion.fechaFinPreguntas}</span>
                </div>
              )}
              {licitacion.fechaPublicacionRespuestas && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Publicación Respuestas:</span>
                  <span className="font-medium">{licitacion.fechaPublicacionRespuestas}</span>
                </div>
              )}
              {licitacion.fechaVisitaTerreno && licitacion.fechaVisitaTerreno !== 'N/A' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Visita a Terreno:</span>
                  <span className="font-medium">{licitacion.fechaVisitaTerreno}</span>
                </div>
              )}
              {licitacion.fechaExtraccion && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha Extracción:</span>
                  <span className="font-medium">{licitacion.fechaExtraccion}</span>
                </div>
              )}
            </div>
          </div>

          {/* Criterios de Evaluación */}
          {licitacion.criteriosEvaluacion && Array.isArray(licitacion.criteriosEvaluacion) && licitacion.criteriosEvaluacion.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" /> Criterios de Evaluación
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criterio</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ponderación</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {licitacion.criteriosEvaluacion.map((criterio, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 text-sm text-gray-900">{criterio.item}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{criterio.ponderacion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Enlaces y adjuntos */}
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-blue-400" /> Enlaces y Documentos
            </h4>
            <div className="flex flex-col gap-3">
              {licitacion.urlLicitacion && (
                <a href={licitacion.urlLicitacion} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 p-2 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                  <ExternalLink className="h-4 w-4" /> Ver Licitación Original
                </a>
              )}
              {licitacion.urlAdjuntos && (
                <a href={licitacion.urlAdjuntos} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-purple-600 hover:text-purple-800 p-2 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors font-medium">
                  <Paperclip className="h-4 w-4" /> Ver Adjuntos
                </a>
              )}
              {licitacion.linkAdjuntos && (
                <a href={licitacion.linkAdjuntos} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-purple-600 hover:text-purple-800 p-2 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors font-medium">
                  <Paperclip className="h-4 w-4" /> Ver Adjuntos (Alternativo)
                </a>
              )}
              {licitacion.url_original && (
                <a href={licitacion.url_original} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 hover:text-green-800 p-2 border border-green-100 rounded-lg hover:bg-green-50 transition-colors font-medium">
                  <ExternalLink className="h-4 w-4" /> Mercado Público
                </a>
              )}
              {licitacion.link && (
                <a href={licitacion.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 p-2 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors font-medium">
                  <ExternalLink className="h-4 w-4" /> Enlace Externo
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-8 py-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
} 