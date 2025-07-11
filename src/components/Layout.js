import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Search, FileText, Home } from 'lucide-react';
import { Toaster } from './ui/Toaster';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Portal de Licitaciones
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Inicio</span>
              </Link>
              <Link
                to="/dashboard"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname.startsWith('/dashboard')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Search className="h-4 w-4" />
                <span>Explorar Licitaciones</span>
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-blue-600">
                <FileText className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">Portal de Licitaciones</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Plataforma integral para la búsqueda y análisis de licitaciones públicas en Chile. 
                Accede a oportunidades de negocio en todo el territorio nacional.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-300 hover:text-white">Inicio</Link></li>
                <li><Link to="/dashboard" className="text-gray-300 hover:text-white">Licitaciones</Link></li>
                <li><button className="text-gray-300 hover:text-white text-left">Ayuda</button></li>
                <li><button className="text-gray-300 hover:text-white text-left">Contacto</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Información</h3>
              <ul className="space-y-2 text-sm">
                <li><button className="text-gray-300 hover:text-white text-left">Términos de Uso</button></li>
                <li><button className="text-gray-300 hover:text-white text-left">Política de Privacidad</button></li>
                <li><button className="text-gray-300 hover:text-white text-left">Soporte</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Portal de Licitaciones Chile. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
} 