import React, { useState, useEffect, useRef } from 'react';

export default function ChileMapGoogle({ regiones, licitaciones, onRegionSelect, selectedRegion }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  // Contar licitaciones por región
  const getLicitacionesPorRegion = (nombreRegion) => {
    return licitaciones.filter(lic => lic.region === nombreRegion).length;
  };

  // Coordenadas aproximadas de las capitales de las regiones de Chile
  const regionCoordinates = {
    'Arica y Parinacota': { lat: -18.4783, lng: -70.3126 },
    'Tarapacá': { lat: -20.2307, lng: -70.1351 },
    'Antofagasta': { lat: -23.6509, lng: -70.4005 },
    'Atacama': { lat: -27.3668, lng: -70.3321 },
    'Coquimbo': { lat: -29.9533, lng: -71.3395 },
    'Valparaíso': { lat: -33.0472, lng: -71.6127 },
    'Metropolitana': { lat: -33.4489, lng: -70.6693 },
    "O'Higgins": { lat: -34.1708, lng: -70.7444 },
    'Maule': { lat: -35.4264, lng: -71.6554 },
    'Ñuble': { lat: -36.6067, lng: -72.1033 },
    'Biobío': { lat: -36.8201, lng: -73.0444 },
    'Araucanía': { lat: -38.7397, lng: -72.5984 },
    'Los Ríos': { lat: -39.8233, lng: -73.2458 },
    'Los Lagos': { lat: -41.4718, lng: -72.9396 },
    'Aysén': { lat: -45.5752, lng: -72.0662 },
    'Magallanes': { lat: -53.1638, lng: -70.9171 }
  };

  useEffect(() => {
    // Cargar Google Maps API
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=TU_API_KEY_AQUI&libraries=geometry`;
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.head.appendChild(script);
      }
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      const mapOptions = {
        center: { lat: -35.6751, lng: -71.5430 }, // Centro de Chile
        zoom: 5,
        styles: [
          {
            featureType: 'administrative',
            elementType: 'geometry',
            stylers: [{ visibility: 'simplified' }]
          },
          {
            featureType: 'landscape',
            stylers: [{ color: '#f5f5f5' }]
          },
          {
            featureType: 'water',
            stylers: [{ color: '#e3f2fd' }]
          }
        ]
      };

      mapInstance.current = new window.google.maps.Map(mapRef.current, mapOptions);
      addMarkers();
    };

    const addMarkers = () => {
      if (!mapInstance.current) return;

      // Limpiar marcadores existentes
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Agregar marcadores para cada región
      Object.entries(regionCoordinates).forEach(([regionName, coords]) => {
        const licitacionesCount = getLicitacionesPorRegion(regionName);
        
        if (licitacionesCount > 0) {
          const marker = new window.google.maps.Marker({
            position: coords,
            map: mapInstance.current,
            title: `${regionName}: ${licitacionesCount} licitaciones`,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8 + Math.min(licitacionesCount, 10),
              fillColor: getMarkerColor(licitacionesCount),
              fillOpacity: 0.8,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }
          });

          // Info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="p-3">
                <h3 class="font-semibold text-gray-900">${regionName}</h3>
                <p class="text-sm text-gray-600">${licitacionesCount} licitaciones disponibles</p>
                <button 
                  onclick="window.selectRegion('${regionName}')"
                  class="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  Ver detalles
                </button>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(mapInstance.current, marker);
          });

          marker.addListener('mouseover', () => {
            setHoveredRegion(regionName);
          });

          marker.addListener('mouseout', () => {
            setHoveredRegion(null);
          });

          markersRef.current.push(marker);
        }
      });

      // Exponer función global para el botón
      window.selectRegion = onRegionSelect;
    };

    const getMarkerColor = (count) => {
      if (count <= 2) return '#dbeafe';
      if (count <= 4) return '#93c5fd';
      return '#2563eb';
    };

    loadGoogleMaps();
  }, [licitaciones, onRegionSelect]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mapa de Google */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div 
              ref={mapRef} 
              className="w-full h-[600px]"
            />
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
                <div className="w-4 h-4 bg-blue-100 rounded-full"></div>
                <span className="text-sm text-gray-600">1-2 licitaciones</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-300 rounded-full"></div>
                <span className="text-sm text-gray-600">3-4 licitaciones</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
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
                  Haz clic en el marcador para ver detalles
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