import React, { useState } from 'react';

export default function ChileMapImages({ regiones, licitaciones, onRegionSelect, selectedRegion }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Contar licitaciones por región
  const getLicitacionesPorRegion = (nombreRegion) => {
    return licitaciones.filter(lic => lic.region === nombreRegion).length;
  };

  // Obtener color según número de licitaciones
  const getRegionColor = (nombreRegion) => {
    const count = getLicitacionesPorRegion(nombreRegion);
    if (count === 0) return 'rgba(229, 231, 235, 0.3)'; // gray-200 con transparencia
    if (count <= 2) return 'rgba(219, 234, 254, 0.6)'; // blue-100 con transparencia
    if (count <= 4) return 'rgba(147, 197, 253, 0.7)'; // blue-300 con transparencia
    return 'rgba(37, 99, 235, 0.8)'; // blue-600 con transparencia
  };

  // Configuración de las regiones con imágenes y posiciones
  const regionConfig = {
    'Arica y Parinacota': {
      image: '/images/regions/arica-parinacota.jpg',
      position: { top: '2%', left: '25%', width: '30%', height: '6%' },
      fallbackColor: '#dbeafe'
    },
    'Tarapacá': {
      image: '/images/regions/tarapaca.jpg',
      position: { top: '8%', left: '22%', width: '35%', height: '8%' },
      fallbackColor: '#dbeafe'
    },
    'Antofagasta': {
      image: '/images/regions/antofagasta.jpg',
      position: { top: '16%', left: '20%', width: '40%', height: '10%' },
      fallbackColor: '#93c5fd'
    },
    'Atacama': {
      image: '/images/regions/atacama.jpg',
      position: { top: '26%', left: '17%', width: '45%', height: '8%' },
      fallbackColor: '#93c5fd'
    },
    'Coquimbo': {
      image: '/images/regions/coquimbo.jpg',
      position: { top: '34%', left: '15%', width: '50%', height: '8%' },
      fallbackColor: '#93c5fd'
    },
    'Valparaíso': {
      image: '/images/regions/valparaiso.jpg',
      position: { top: '42%', left: '12%', width: '55%', height: '6%' },
      fallbackColor: '#2563eb'
    },
    'Metropolitana': {
      image: '/images/regions/metropolitana.jpg',
      position: { top: '48%', left: '10%', width: '60%', height: '5%' },
      fallbackColor: '#2563eb'
    },
    "O'Higgins": {
      image: '/images/regions/ohiggins.jpg',
      position: { top: '53%', left: '7%', width: '65%', height: '6%' },
      fallbackColor: '#2563eb'
    },
    'Maule': {
      image: '/images/regions/maule.jpg',
      position: { top: '59%', left: '5%', width: '70%', height: '7%' },
      fallbackColor: '#2563eb'
    },
    'Ñuble': {
      image: '/images/regions/nuble.jpg',
      position: { top: '66%', left: '2%', width: '75%', height: '5%' },
      fallbackColor: '#2563eb'
    },
    'Biobío': {
      image: '/images/regions/biobio.jpg',
      position: { top: '71%', left: '0%', width: '80%', height: '7%' },
      fallbackColor: '#2563eb'
    },
    'Araucanía': {
      image: '/images/regions/araucania.jpg',
      position: { top: '78%', left: '5%', width: '70%', height: '8%' },
      fallbackColor: '#93c5fd'
    },
    'Los Ríos': {
      image: '/images/regions/los-rios.jpg',
      position: { top: '86%', left: '10%', width: '60%', height: '6%' },
      fallbackColor: '#93c5fd'
    },
    'Los Lagos': {
      image: '/images/regions/los-lagos.jpg',
      position: { top: '92%', left: '15%', width: '50%', height: '8%' },
      fallbackColor: '#dbeafe'
    },
    'Aysén': {
      image: '/images/regions/aysen.jpg',
      position: { top: '100%', left: '20%', width: '40%', height: '10%' },
      fallbackColor: '#dbeafe'
    },
    'Magallanes': {
      image: '/images/regions/magallanes.jpg',
      position: { top: '110%', left: '25%', width: '30%', height: '8%' },
      fallbackColor: '#dbeafe'
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mapa con imágenes */}
        <div className="flex-1">
          <div className="relative w-full h-[700px] border border-gray-200 rounded-lg bg-gradient-to-b from-blue-50 to-white overflow-hidden">
            {/* Fondo del mapa */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-blue-50"></div>
            
            {/* Regiones con imágenes */}
            {Object.entries(regionConfig).map(([regionName, config]) => {
              const licitacionesCount = getLicitacionesPorRegion(regionName);
              const isHovered = hoveredRegion === regionName;
              const isSelected = selectedRegion === regionName;

              return (
                <div
                  key={regionName}
                  className="absolute cursor-pointer transition-all duration-300 group"
                  style={{
                    top: config.position.top,
                    left: config.position.left,
                    width: config.position.width,
                    height: config.position.height,
                    zIndex: isHovered || isSelected ? 10 : 1
                  }}
                  onMouseEnter={() => setHoveredRegion(regionName)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => onRegionSelect(regionName)}
                >
                  {/* Imagen de la región */}
                  <div
                    className="w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-300"
                    style={{
                      borderColor: isSelected ? '#1d4ed8' : isHovered ? '#3b82f6' : '#e5e7eb',
                      borderWidth: isSelected ? '3px' : isHovered ? '2px' : '1px',
                      backgroundColor: config.fallbackColor,
                      opacity: isHovered ? 0.9 : 1
                    }}
                  >
                    {/* Fallback con color si no hay imagen */}
                    <div
                      className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-700"
                      style={{
                        background: `linear-gradient(135deg, ${getRegionColor(regionName)}, ${config.fallbackColor})`
                      }}
                    >
                      {regionName.length > 12 ? regionName.substring(0, 10) + '...' : regionName}
                    </div>
                  </div>

                  {/* Contador de licitaciones */}
                  {licitacionesCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {licitacionesCount}
                    </div>
                  )}

                  {/* Tooltip en hover */}
                  {isHovered && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-20">
                      {regionName}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Línea costera decorativa */}
            <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M 0 0 L 100 0 L 100 100 L 0 100 Z"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="0.1"
                  strokeDasharray="0.5,0.5"
                  opacity="0.3"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Panel de información */}
        <div className="lg:w-80">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información del Mapa
            </h3>
            
            {/* Leyenda */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <span className="text-sm text-gray-600">Sin licitaciones</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-100 rounded"></div>
                <span className="text-sm text-gray-600">1-2 licitaciones</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-300 rounded"></div>
                <span className="text-sm text-gray-600">3-4 licitaciones</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span className="text-sm text-gray-600">5+ licitaciones</span>
              </div>
            </div>

            {/* Información de región seleccionada */}
            {hoveredRegion && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {hoveredRegion}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {getLicitacionesPorRegion(hoveredRegion)} licitaciones disponibles
                </p>
                <p className="text-xs text-blue-600">
                  Haz clic para ver detalles
                </p>
              </div>
            )}

            {/* Lista de regiones */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Todas las Regiones</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {regiones.map((region) => {
                  const count = getLicitacionesPorRegion(region.nombre);
                  return (
                    <button
                      key={region.id}
                      onClick={() => onRegionSelect(region.nombre)}
                      className="w-full flex justify-between items-center p-2 text-left hover:bg-gray-50 rounded text-sm transition-colors"
                    >
                      <span className="text-gray-700">{region.nombre}</span>
                      {count > 0 && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 