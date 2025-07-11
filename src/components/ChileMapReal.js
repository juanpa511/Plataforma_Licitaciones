import React, { useState } from 'react';

export default function ChileMapReal({ regiones, licitaciones, onRegionSelect, selectedRegion, resumenPorRegion }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Obtener licitaciones por región desde resumenPorRegion
  const getLicitacionesPorRegion = (nombreRegion) => {
    if (resumenPorRegion && resumenPorRegion[nombreRegion]) {
      return resumenPorRegion[nombreRegion];
    }
    // Fallback: contar desde el array de licitaciones
    return licitaciones ? licitaciones.filter(lic => lic.region === nombreRegion).length : 0;
  };

  // Obtener color según número de licitaciones
  const getRegionColor = (nombreRegion) => {
    const count = getLicitacionesPorRegion(nombreRegion);
    if (count === 0) return '#f3f4f6'; // gray-100
    if (count <= 2) return '#dbeafe'; // blue-100
    if (count <= 4) return '#93c5fd'; // blue-300
    if (count <= 8) return '#3b82f6'; // blue-500
    return '#1d4ed8'; // blue-700
  };

  // Coordenadas más precisas del mapa de Chile (simplificadas pero más realistas)
  const regionPaths = {
    'Arica y Parinacota': {
      path: "M 50 20 L 80 20 L 85 25 L 80 35 L 50 35 Z",
      center: { x: 65, y: 27.5 },
      label: "Arica y Parinacota"
    },
    'Tarapacá': {
      path: "M 45 40 L 90 40 L 95 50 L 90 70 L 45 70 Z",
      center: { x: 67.5, y: 55 },
      label: "Tarapacá"
    },
    'Antofagasta': {
      path: "M 40 75 L 100 75 L 105 85 L 100 120 L 40 120 Z",
      center: { x: 70, y: 97.5 },
      label: "Antofagasta"
    },
    'Atacama': {
      path: "M 35 125 L 110 125 L 115 135 L 110 160 L 35 160 Z",
      center: { x: 72.5, y: 142.5 },
      label: "Atacama"
    },
    'Coquimbo': {
      path: "M 30 165 L 120 165 L 125 175 L 120 200 L 30 200 Z",
      center: { x: 75, y: 182.5 },
      label: "Coquimbo"
    },
    'Valparaíso': {
      path: "M 25 205 L 130 205 L 135 215 L 130 235 L 25 235 Z",
      center: { x: 77.5, y: 220 },
      label: "Valparaíso"
    },
    'Metropolitana': {
      path: "M 20 240 L 140 240 L 145 250 L 140 265 L 20 265 Z",
      center: { x: 80, y: 252.5 },
      label: "Metropolitana"
    },
    "O'Higgins": {
      path: "M 15 270 L 150 270 L 155 280 L 150 300 L 15 300 Z",
      center: { x: 82.5, y: 285 },
      label: "O'Higgins"
    },
    'Maule': {
      path: "M 10 305 L 160 305 L 165 315 L 160 340 L 10 340 Z",
      center: { x: 85, y: 322.5 },
      label: "Maule"
    },
    'Ñuble': {
      path: "M 5 345 L 170 345 L 175 355 L 170 370 L 5 370 Z",
      center: { x: 87.5, y: 357.5 },
      label: "Ñuble"
    },
    'Biobío': {
      path: "M 0 375 L 180 375 L 185 385 L 180 410 L 0 410 Z",
      center: { x: 90, y: 392.5 },
      label: "Biobío"
    },
    'Araucanía': {
      path: "M 10 415 L 160 415 L 165 425 L 160 450 L 10 450 Z",
      center: { x: 85, y: 432.5 },
      label: "Araucanía"
    },
    'Los Ríos': {
      path: "M 20 455 L 140 455 L 145 465 L 140 485 L 20 485 Z",
      center: { x: 80, y: 470 },
      label: "Los Ríos"
    },
    'Los Lagos': {
      path: "M 30 490 L 120 490 L 125 500 L 120 530 L 30 530 Z",
      center: { x: 75, y: 510 },
      label: "Los Lagos"
    },
    'Aysén': {
      path: "M 40 535 L 100 535 L 105 545 L 100 580 L 40 580 Z",
      center: { x: 70, y: 557.5 },
      label: "Aysén"
    },
    'Magallanes': {
      path: "M 50 585 L 80 585 L 85 595 L 80 620 L 50 620 Z",
      center: { x: 65, y: 602.5 },
      label: "Magallanes"
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mapa SVG */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <svg
              viewBox="0 0 200 650"
              className="w-full h-auto max-h-[700px]"
              style={{ aspectRatio: '200/650' }}
            >
              {/* Fondo del mapa con gradiente */}
              <defs>
                <linearGradient id="mapGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#dbeafe', stopOpacity: 0.3 }} />
                  <stop offset="50%" style={{ stopColor: '#f8fafc', stopOpacity: 0.5 }} />
                  <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.1"/>
                </filter>
              </defs>

              {/* Fondo */}
              <rect x="0" y="0" width="200" height="650" fill="url(#mapGradient)" />

              {/* Línea costera decorativa */}
              <path
                d="M 0 0 L 200 0 L 200 650 L 0 650 Z"
                fill="none"
                stroke="#1e40af"
                strokeWidth="0.5"
                strokeDasharray="3,3"
                opacity="0.2"
              />

              {/* Regiones */}
              {Object.entries(regionPaths).map(([regionName, regionData]) => {
                const licitacionesCount = getLicitacionesPorRegion(regionName);
                const isHovered = hoveredRegion === regionName;
                const isSelected = selectedRegion === regionName;

                return (
                  <g key={regionName}>
                    <path
                      d={regionData.path}
                      fill={getRegionColor(regionName)}
                      stroke={isSelected ? '#1d4ed8' : isHovered ? '#3b82f6' : '#9ca3af'}
                      strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredRegion(regionName)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => onRegionSelect(regionName)}
                      opacity={isHovered ? 0.9 : 1}
                      filter={isSelected ? "url(#shadow)" : "none"}
                    />
                    
                    {/* Texto de la región */}
                    <text
                      x={regionData.center.x}
                      y={regionData.center.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-medium pointer-events-none"
                      fill={licitacionesCount > 4 ? 'white' : '#374151'}
                      style={{ fontSize: '10px', fontWeight: '500' }}
                    >
                      {regionData.label.length > 12 ? regionData.label.substring(0, 10) + '...' : regionData.label}
                    </text>
                    
                    {/* Contador de licitaciones */}
                    {licitacionesCount > 0 && (
                      <g>
                        <circle
                          cx={regionData.center.x + 15}
                          cy={regionData.center.y - 10}
                          r="10"
                          fill="#dc2626"
                          className="pointer-events-none"
                          filter="url(#shadow)"
                        />
                        <text
                          x={regionData.center.x + 15}
                          y={regionData.center.y - 10}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-bold fill-white pointer-events-none"
                          style={{ fontSize: '8px' }}
                        >
                          {licitacionesCount}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Título del mapa */}
              <text
                x="100"
                y="15"
                textAnchor="middle"
                className="text-sm font-bold fill-gray-700 pointer-events-none"
                style={{ fontSize: '12px', fontWeight: '600' }}
              >
                REPÚBLICA DE CHILE
              </text>
            </svg>
          </div>
        </div>

        {/* Panel de información */}
        <div className="lg:w-80">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información del Mapa
            </h3>
            
            {/* Leyenda mejorada */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-100 rounded border border-gray-300"></div>
                <span className="text-sm text-gray-600">Sin licitaciones</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-100 rounded border border-blue-300"></div>
                <span className="text-sm text-gray-600">1-2 licitaciones</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-300 rounded border border-blue-500"></div>
                <span className="text-sm text-gray-600">3-4 licitaciones</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded border border-blue-600"></div>
                <span className="text-sm text-gray-600">5-8 licitaciones</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-700 rounded border border-blue-800"></div>
                <span className="text-sm text-gray-600">9+ licitaciones</span>
              </div>
            </div>

            {/* Información de región seleccionada */}
            {hoveredRegion && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
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

            {/* Estadísticas rápidas */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Estadísticas</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total regiones:</span>
                  <span className="font-medium">{regiones.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Con licitaciones:</span>
                  <span className="font-medium">
                    {regiones.filter(r => getLicitacionesPorRegion(r.nombre) > 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total licitaciones:</span>
                  <span className="font-medium">{licitaciones.length}</span>
                </div>
              </div>
            </div>

            {/* Lista de regiones */}
            <div>
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