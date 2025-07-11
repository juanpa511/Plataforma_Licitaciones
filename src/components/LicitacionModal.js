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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detalles de Licitación</h2>
            <p className="text-sm text-gray-600 mt-1">ID: {licitacion.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Descripción */}
          {licitacion.descripcion && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-700 leading-relaxed">{licitacion.descripcion}</p>
            </div>
          )}

          {/* Fechas adicionales */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Datos adicionales</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {licitacion.fechaCierre && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de Cierre:</span>
                  <span className="font-medium">{licitacion.fechaCierre}</span>
                </div>
              )}
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
              {licitacion.fechaAdjudicacion && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Adjudicación:</span>
                  <span className="font-medium">{licitacion.fechaAdjudicacion}</span>
                </div>
              )}
              {licitacion.fechaVisitaTerreno && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Visita a Terreno:</span>
                  <span className="font-medium">{licitacion.fechaVisitaTerreno}</span>
                </div>
              )}
              {licitacion.fechaExtracción && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha Extracción:</span>
                  <span className="font-medium">{licitacion.fechaExtracción}</span>
                </div>
              )}
            </div>
          </div>

          {/* Criterios de Evaluación */}
          {licitacion.criteriosEvaluacion && Array.isArray(licitacion.criteriosEvaluacion) && licitacion.criteriosEvaluacion.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Criterios de Evaluación</h4>
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
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Enlaces y Documentos</h4>
              <div className="space-y-3">
                {licitacion.urlLicitacion && (
                  <a href={licitacion.urlLicitacion} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 p-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                    <span>Ver Licitación Original</span>
                  </a>
                )}
                {licitacion.urlAdjuntos && (
                  <a href={licitacion.urlAdjuntos} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 p-3 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                    <span>Ver Adjuntos</span>
                  </a>
                )}
                {licitacion.url_original && (
                  <a href={licitacion.url_original} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-green-600 hover:text-green-800 p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                    <span>Mercado Público</span>
                  </a>
                )}
                {licitacion.link && (
                  <a href={licitacion.link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 p-3 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                    <span>Enlace Externo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
} 