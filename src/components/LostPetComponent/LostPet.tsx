import { Search, CheckCircle, AlertTriangle, Clock, MapPin, Share2, MessageSquare, Eye, Plus } from "lucide-react";

export default function LostPetComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      {/* Encabezado */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              CatDog
            </h1>
            <div className="text-center flex-1 mx-8">
              <h2 className="text-3xl font-bold text-gray-900">Mascotas Perdidas</h2>
              <p className="text-gray-600 text-sm mt-1">
                Ayuda a encontrar mascotas desaparecidas y colabora con la comunidad
              </p>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 whitespace-nowrap">
              <Plus size={20} />
              <span className="hidden sm:inline">Reportar Mascota</span>
              <span className="sm:hidden">Reportar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Search size={24} className="opacity-80" />
              <span className="text-xs font-bold opacity-70">Mascotas</span>
            </div>
            <p className="text-3xl font-bold">3</p>
            <p className="text-sm opacity-90 mt-2">Mascotas reportadas</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle size={24} className="opacity-80" />
              <span className="text-xs font-bold opacity-70">Encontradas</span>
            </div>
            <p className="text-3xl font-bold">1</p>
            <p className="text-sm opacity-90 mt-2">Encontradas</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle size={24} className="opacity-80" />
              <span className="text-xs font-bold opacity-70">Reportes</span>
            </div>
            <p className="text-3xl font-bold">2</p>
            <p className="text-sm opacity-90 mt-2">Reportes activos</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Clock size={24} className="opacity-80" />
              <span className="text-xs font-bold opacity-70">Últimos</span>
            </div>
            <p className="text-3xl font-bold">5</p>
            <p className="text-sm opacity-90 mt-2">Últimos reportes</p>
          </div>

        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-blue-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">🔍 Buscar</label>
              <input
                type="text"
                placeholder="Nombre o ubicación..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">🐾 Tipo</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Todos</option>
                <option>Perro</option>
                <option>Gato</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">📊 Estado</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Todos</option>
                <option>Perdido</option>
                <option>Encontrado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Resultados</label>
              <div className="px-4 py-2 bg-blue-100 text-blue-900 rounded-lg font-semibold">
                1 reporte
              </div>
            </div>
          </div>
        </div>

        {/* Single Pet Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
            <div className="relative h-64 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1574158622682-e40ad41c3a5b?w=400&h=400&fit=crop"
                alt="Luna"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-white font-bold text-sm bg-red-500">
                🔍 Perdido
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Luna</h3>
              <p className="text-sm text-gray-600 mb-4">Gato • Persa</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin size={16} className="text-blue-600 flex-shrink-0" />
                  <span className="truncate">Barrio Centro, Calle Principal</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock size={16} className="text-blue-600 flex-shrink-0" />
                  <span>15 Nov 2024</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                Gato persa gris y blanco muy cariñoso. Desaparecido desde el 15 de noviembre.
              </p>

              <div className="grid grid-cols-3 gap-2">
                <button className="bg-blue-100 text-blue-700 py-2 rounded-lg font-semibold flex items-center justify-center gap-1 text-sm">
                  <Eye size={16} />
                  <span className="hidden sm:inline">Ver</span>
                </button>
                <button className="bg-cyan-100 text-cyan-700 py-2 rounded-lg font-semibold flex items-center justify-center gap-1 text-sm">
                  <Share2 size={16} />
                  <span className="hidden sm:inline">Compartir</span>
                </button>
                <button className="bg-emerald-100 text-emerald-700 py-2 rounded-lg font-semibold flex items-center justify-center gap-1 text-sm">
                  <MessageSquare size={16} />
                  <span className="hidden sm:inline">Contactar</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
