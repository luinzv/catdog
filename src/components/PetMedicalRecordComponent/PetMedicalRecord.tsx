import {
  Heart,
  Syringe,
  Calendar,
  AlertCircle,
  Pill,
  Stethoscope,
  Download,
  Share2,
  Edit3,
  Plus,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function PetMedicalRecord() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-sm">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                CatDog
              </span>
            </div>

            <div className="hidden sm:block text-right">
              <h1 className="text-sm font-semibold text-gray-600">
                Gestión Veterinaria
              </h1>
            </div>

          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* TITULO */}
        <div className="mb-8">

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            Ficha Médica
          </h1>

          <p className="text-gray-600">
            Información completa de salud y registro médico
          </p>

        </div>

        {/* TARJETA PRINCIPAL */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-blue-100 hover:shadow-xl transition-shadow duration-300">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 sm:p-8">

            {/* IMAGEN */}
            <div className="sm:col-span-1">

              <div className="w-full aspect-square bg-linear-to-br from-blue-200 to-cyan-200 rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  src="https://images7.memedroid.com/images/UPLOADED322/634084e6e7085.webp"
                  alt="Pet"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* INFO */}
            <div className="sm:col-span-2 flex flex-col justify-between">

              <div>

                <div className="flex items-start justify-between gap-4 mb-4">

                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Fabricio
                    </h2>

                    <p className="text-lg text-gray-600 mt-1">
                      Golden Retriever
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-full font-semibold text-sm border bg-emerald-100 text-emerald-700 border-emerald-300">
                    Excelente
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">

                  <div className="bg-linear-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium">
                      Edad
                    </p>

                    <p className="text-gray-900 text-lg font-bold">
                      4 años
                    </p>
                  </div>

                  <div className="bg-linear-to-br from-cyan-50 to-cyan-100 p-3 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium">
                      Peso
                    </p>

                    <p className="text-gray-900 text-lg font-bold">
                      28.5 kg
                    </p>
                  </div>

                </div>
              </div>

              <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">

                <Edit3 className="w-4 h-4" />
                Editar ficha

              </button>

            </div>
          </div>
        </div>

        {/* TARJETAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          {/* VACUNAS */}
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

            <div className="flex items-center justify-between mb-4">

              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <Syringe className="w-6 h-6 text-blue-600" />
              </div>

              <span className="text-2xl font-bold text-gray-900">
                5
              </span>

            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Vacunas Aplicadas
            </h3>

            <p className="text-gray-600 text-sm">
              DHPP, Rabia, Bordetella
            </p>

          </div>

          {/* PROXIMA */}
          <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

            <div className="flex items-center justify-between mb-4">

              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>

              <Clock className="w-5 h-5 text-purple-500" />

            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Próxima Vacuna
            </h3>

            <p className="text-gray-600 text-sm">
              15 de julio
            </p>

          </div>

          {/* ALERGIAS */}
          <div className="bg-white rounded-xl shadow-md border border-emerald-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

            <div className="flex items-center justify-between mb-4">

              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-emerald-600" />
              </div>

              <CheckCircle className="w-5 h-5 text-emerald-500" />

            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Alergias
            </h3>

            <p className="text-gray-600 text-sm">
              Sin alergias registradas
            </p>

          </div>

        </div>

        {/* RECORDATORIOS */}
        <div className="mb-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recordatorios
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl p-6 text-white shadow-lg">

              <Syringe className="w-8 h-8 mb-3 opacity-90" />

              <h3 className="font-semibold text-lg mb-1">
                Próxima Vacuna
              </h3>

              <p className="text-white/90 text-sm">
                15 de agosto
              </p>

            </div>

            <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl p-6 text-white shadow-lg">

              <Stethoscope className="w-8 h-8 mb-3 opacity-90" />

              <h3 className="font-semibold text-lg mb-1">
                Próximo Control
              </h3>

              <p className="text-white/90 text-sm">
                20 de junio
              </p>

            </div>

          </div>

        </div>

        {/* BOTONES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">

          <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">

            <Plus className="w-5 h-5" />
            Agregar

          </button>

          <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">

            <Edit3 className="w-5 h-5" />
            Editar

          </button>

        </div>

      </main>
    </div>
  );
}