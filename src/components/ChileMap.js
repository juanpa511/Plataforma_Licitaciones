import React, { useState } from 'react';

export default function ChileMap({ regiones, licitaciones, onRegionSelect, selectedRegion }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Contar licitaciones por región
  const getLicitacionesPorRegion = (nombreRegion) => {
    return licitaciones.filter(lic => lic.region === nombreRegion).length;
  };

  // Obtener color según número de licitaciones
  const getRegionColor = (nombreRegion) => {
    const count = getLicitacionesPorRegion(nombreRegion);
    if (count === 0) return '#e5e7eb'; // gray-200
    if (count <= 2) return '#dbeafe'; // blue-100
    if (count <= 4) return '#93c5fd'; // blue-300
    return '#2563eb'; // blue-600
  };

  // Regiones simplificadas para el mapa SVG (posiciones aproximadas)
  const regionPositions = [
    { name: 'Arica y Parinacota', x: 50, y: 20, width: 80, height: 40 },
    { name: 'Tarapacá', x: 45, y: 60, width: 90, height: 50 },
    { name: 'Antofagasta', x: 40, y: 110, width: 100, height: 80 },
    { name: 'Atacama', x: 35, y: 190, width: 110, height: 70 },
    { name: 'Coquimbo', x: 30, y: 260, width: 120, height: 60 },
    { name: 'Valparaíso', x: 25, y: 320, width: 130, height: 50 },
    { name: 'Metropolitana', x: 20, y: 370, width: 140, height: 40 },
    { name: "O'Higgins", x: 15, y: 410, width: 150, height: 50 },
    { name: 'Maule', x: 10, y: 460, width: 160, height: 60 },
    { name: 'Ñuble', x: 5, y: 520, width: 170, height: 50 },
    { name: 'Biobío', x: 0, y: 570, width: 180, height: 70 },
    { name: 'Araucanía', x: 10, y: 640, width: 160, height: 80 },
    { name: 'Los Ríos', x: 20, y: 720, width: 140, height: 60 },
    { name: 'Los Lagos', x: 30, y: 780, width: 120, height: 90 },
    { name: 'Aysén', x: 40, y: 870, width: 100, height: 120 },
    { name: 'Magallanes', x: 50, y: 990, width: 80, height: 80 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mapa SVG */}
        <div className="flex-1">
          <svg
            viewBox="0 0 200 1100"
            className="w-full h-auto max-h-[600px] border border-gray-200 rounded-lg bg-blue-50"
            style={{ aspectRatio: '200/1100' }}
          >
            {regionPositions.map((region) => {
              const licitacionesCount = getLicitacionesPorRegion(region.name);
              const isHovered = hoveredRegion === region.name;
              const isSelected = selectedRegion === region.name;

              return (
                <g key={region.name}>
                  <rect
                    x={region.x}
                    y={region.y}
                    width={region.width}
                    height={region.height}
                    fill={getRegionColor(region.name)}
                    stroke={isSelected || isHovered ? '#1d4ed8' : '#9ca3af'}
                    strokeWidth={isSelected || isHovered ? 2 : 1}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredRegion(region.name)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => onRegionSelect(region.name)}
                    opacity={isHovered ? 0.8 : 1}
                  />
                  
                  {/* Texto de la región */}
                  <text
                    x={region.x + region.width / 2}
                    y={region.y + region.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-medium pointer-events-none"
                    fill={licitacionesCount > 4 ? 'white' : '#374151'}
                  >
                    {region.name.length > 12 ? region.name.substring(0, 10) + '...' : region.name}
                  </text>
                  
                  {/* Contador de licitaciones */}
                  {licitacionesCount > 0 && (
                    <circle
                      cx={region.x + region.width - 10}
                      cy={region.y + 10}
                      r="8"
                      fill="#dc2626"
                      className="pointer-events-none"
                    />
                  )}
                  {licitacionesCount > 0 && (
                    <text
                      x={region.x + region.width - 10}
                      y={region.y + 10}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-bold fill-white pointer-events-none"
                    >
                      {licitacionesCount}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Panel de información */}
        <div className="lg:w-80">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
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
              <div className="p-4 bg-blue-50 rounded-lg">
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
                      className="w-full flex justify-between items-center p-2 text-left hover:bg-gray-50 rounded text-sm"
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