import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, TrendingUp, Building, Users, ArrowRight } from 'lucide-react';
import ChileMapReal from './ChileMapReal';
import { apiService } from '../services/api';

export default function HomePage() {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState({
    totalLicitaciones: 0,
    licitacionesAbiertas: 0,
    organismos: 0,
    montoTotal: 0,
    resumenPorRegion: {},
    fechaUltimaActualizacion: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    loadEstadisticas();
  }, []);

  const loadEstadisticas = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEstadisticas();
      
      if (response.success) {
        setEstadisticas(response.data);
      } else {
        setError('Error al cargar las estadísticas');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading estadisticas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionSelect = (regionNombre) => {
    setSelectedRegion(regionNombre);
    navigate(`/dashboard/${encodeURIComponent(regionNombre)}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadEstadisticas}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/licitaciones-hero.jpg')" }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Portal de Licitaciones
              <span className="block text-blue-200">de Chile</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Descubre oportunidades de negocio en todo el territorio nacional. 
              Explora licitaciones por región y accede a información detallada.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center space-x-2 bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              <span>Explorar Licitaciones</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Estadísticas Generales
            </h2>
            <p className="text-xl text-gray-600">
              Datos actualizados del portal de licitaciones
            </p>
            {estadisticas.fechaUltimaActualizacion && (
              <p className="text-sm text-gray-500 mt-2">
                Última actualización: {formatDate(estadisticas.fechaUltimaActualizacion)}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-blue-50 rounded-xl">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {formatCurrency(estadisticas.montoTotal)}
              </h3>
              <p className="text-gray-600">Monto Total en Licitaciones</p>
            </div>
            
            <div className="text-center p-8 bg-green-50 rounded-xl">
              <Building className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {estadisticas.licitacionesAbiertas}
              </h3>
              <p className="text-gray-600">Licitaciones Abiertas</p>
            </div>
            
            <div className="text-center p-8 bg-purple-50 rounded-xl">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {estadisticas.organismos}
              </h3>
              <p className="text-gray-600">Organismos Licitantes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa de Chile */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explora por Región
            </h2>
            <p className="text-xl text-gray-600">
              Haz clic en una región para ver las licitaciones disponibles
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <ChileMapReal
              regiones={Object.keys(estadisticas.resumenPorRegion || {}).map(region => ({
                id: region,
                nombre: region,
                codigo: region.substring(0, 3).toUpperCase(),
                capital: region,
                coordenadas: { lat: 0, lng: 0 } // Coordenadas por defecto
              }))}
              licitaciones={[]} // No necesitamos las licitaciones completas aquí
              onRegionSelect={handleRegionSelect}
              selectedRegion={selectedRegion}
              resumenPorRegion={estadisticas.resumenPorRegion || {}}
            />
          </div>
        </div>
      </section>

      {/* Información adicional */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Total de Licitaciones por Región
            </h2>
            <p className="text-xl text-gray-600">
              Distribución de oportunidades en todo Chile
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(estadisticas.resumenPorRegion || {}).map(([region, count]) => (
              <div key={region} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <span className="text-sm text-gray-500">Licitaciones</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {region}
                </h3>
                
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {count}
                </div>
                
                <p className="text-sm text-gray-600">
                  oportunidades disponibles
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <span>Ver Todas las Licitaciones</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 