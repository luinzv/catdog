import { Plus } from "lucide-react";

export default function PetReminders() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Recordatorios
          </h1>

          <p className="text-gray-600 text-lg">
            Organiza vacunas, controles y cuidados de tus mascotas
          </p>

        </div>

        {/* BOTÓN CREAR */}
        <div className="flex justify-start mb-8">

          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">

            <Plus className="w-5 h-5" />
            Nuevo Recordatorio

          </button>

        </div>

        {/* RECORDATORIOS PENDIENTES */}
        <div className="mb-10">

          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">

            Pendientes

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* CARD */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

              <div className="flex items-start justify-between mb-4">

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Vacuna Antirrábica
                  </h3>

                  <p className="text-gray-500 text-sm">
                    Luna
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  Pendiente
                </span>

              </div>

              <div className="space-y-2 mb-5">

                <p className="text-gray-700">
                  20 Dic 2024
                </p>

              </div>

              <div className="flex gap-3">

                <button className="flex-1 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition">
                  Editar
                </button>

                <button className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition">
                  Completar
                </button>

              </div>

            </div>

            {/* CARD */}
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

              <div className="flex items-start justify-between mb-4">

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Control Veterinario
                  </h3>

                  <p className="text-gray-500 text-sm">
                    Mateo
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                  Pendiente
                </span>

              </div>

              <div className="space-y-2 mb-5">

                <p className="text-gray-700">
                  22 Dic 2024
                </p>

              </div>

              <div className="flex gap-3">

                <button className="flex-1 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition">
                  Editar
                </button>

                <button className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition">
                  Completar
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* RECORDATORIOS COMPLETADOS */}
        <div className="mb-10">

          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">

            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>

            Completados

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 opacity-80 hover:opacity-100 transition-all duration-300">

              <div className="flex items-start justify-between mb-4">

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Medicación Pulgas
                  </h3>

                  <p className="text-gray-500 text-sm">
                    Rocky
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  Completado
                </span>

              </div>

              <div className="space-y-2 mb-5">

                <p className="text-gray-700">
                    18 Dic 2024
                </p>

                <p className="text-gray-700">
                    09:00 AM
                </p>

              </div>

              <button className="w-full py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold">
                Finalizado
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}