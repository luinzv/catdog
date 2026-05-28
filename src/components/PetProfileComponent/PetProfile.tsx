import {
  Plus,
  CheckCircle,
  Clock,
  Zap,
  PawPrint,
  Edit2,
  FileText,
  Eye,
} from "lucide-react";

export default function PetsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

            <div>


              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                Mis Mascotas
              </h1>
            </div>

            <button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/30 text-white font-semibold rounded-2xl px-6 py-3 flex items-center gap-2 transition-all">
              <Plus className="w-5 h-5" />
              Agregar Mascota
            </button>

          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Mascotas</p>
                <p className="text-4xl font-bold text-slate-900 mt-1">4</p>
              </div>

              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Saludables</p>
                <p className="text-4xl font-bold text-emerald-600 mt-1">2</p>
              </div>

              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Revisión Pendiente</p>
                <p className="text-4xl font-bold text-blue-600 mt-1">1</p>
              </div>

              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">En Tratamiento</p>
                <p className="text-4xl font-bold text-amber-600 mt-1">1</p>
              </div>

              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

        </div>

        {/* GRID MASCOTAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          {/* CARD MASCOTA */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-100 group">

            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">

              <img
                src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop"
                alt="Mascota"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />

            </div>

            <div className="p-6">

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Luna</h3>
                </div>
              </div>


              <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="bg-blue-50 rounded-2xl p-3">
                  <p className="text-xs text-slate-600 font-medium">Edad</p>
                  <p className="text-lg font-bold text-blue-600 mt-1">3 años</p>
                </div>

                <div className="bg-cyan-50 rounded-2xl p-3">
                  <p className="text-xs text-slate-600 font-medium">Peso</p>
                  <p className="text-lg font-bold text-cyan-600 mt-1">4.2 kg</p>
                </div>
              </div>

              <div className="flex gap-2">

                <button className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2 flex items-center justify-center gap-1 text-sm font-medium transition">
                  <Eye className="w-4 h-4" />
                  Perfil
                </button>

                <button className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2 flex items-center justify-center gap-1 text-sm font-medium transition">
                  <FileText className="w-4 h-4" />
                  Ficha
                </button>

                <button className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2 flex items-center justify-center gap-1 text-sm font-medium transition">
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>

              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}