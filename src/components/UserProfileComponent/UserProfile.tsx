import {
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Shield,
  LogOut,
  Edit3,
  Cat,
  Cake,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function UserProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/");
};
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              CatDog
            </h1>

            <nav className="hidden sm:flex gap-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">
                Inicio
              </a>

              <a href="#" className="text-gray-600 hover:text-blue-600 transition">
                Mascotas
              </a>

              <a href="#" className="text-blue-600 font-medium">
                Perfil
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* PERFIL */}
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 mb-8">

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">

            {/* Avatar */}
            <div className="relative">
              <img
                src="https://i.pinimg.com/736x/08/0a/fb/080afbcc2ed1022bbdc59446190164d8.jpg"
                alt="profile"
                className="w-32 h-32 rounded-full border-4 border-blue-100 object-cover shadow-lg"
              />

              <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
            </div>

            {/* Información */}
            <div className="flex-1 text-center sm:text-left">

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.nombre || "Anonimo"}
              </h1>

              <p className="text-gray-600 text-lg mb-6">
                {user.email || "correo@example.com"}
              </p>

              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-md">
                <Edit3 size={18} />
                Editar perfil
              </button>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

          {/* INFORMACIÓN */}
          <div className="lg:col-span-1">

            <div className="bg-white rounded-2xl shadow-lg p-6 h-full">

              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Información Personal
              </h2>

              <div className="space-y-4">

                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                  <Mail className="text-blue-600 shrink-0" size={20} />

                  <div>
                    <p className="text-xs text-gray-600 font-medium">
                      Correo
                    </p>

                    <p className="text-sm font-semibold text-gray-900">
                      {user.email || "correo@example.com"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition">
                  <Phone className="text-purple-600 shrink-0" size={20} />

                  <div>
                    <p className="text-xs text-gray-600 font-medium">
                      Teléfono
                    </p>

                    <p className="text-sm font-semibold text-gray-900">
                      +56 9 1234 5678
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition">
                  <MapPin className="text-orange-600 shrink-0" size={20} />

                  <div>
                    <p className="text-xs text-gray-600 font-medium">
                      Ciudad
                    </p>

                    <p className="text-sm font-semibold text-gray-900">
                      Valparaíso
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition">
                  <Cake className="text-green-600 shrink-0" size={20} />

                  <div>
                    <p className="text-xs text-gray-600 font-medium">
                      Se unió
                    </p>

                    <p className="text-sm font-semibold text-gray-900">
                      Mayo 2026
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* CONFIGURACIÓN */}
          <div className="lg:col-span-2">

            <div className="bg-white rounded-2xl shadow-lg p-6 h-full">

              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Configuración
              </h2>

              <div className="space-y-3">

                <button className="w-full flex items-center justify-between p-4 bg-linear-to-r from-blue-50 to-transparent rounded-xl hover:from-blue-100 transition group">
                  <div className="flex items-center gap-3">
                    <Lock className="text-blue-600" size={20} />
                    <span className="font-semibold text-gray-900">
                      Cambiar contraseña
                    </span>
                  </div>

                  <span className="text-gray-400">→</span>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-linear-to-r from-purple-50 to-transparent rounded-xl hover:from-purple-100 transition group">
                  <div className="flex items-center gap-3">
                    <Bell className="text-purple-600" size={20} />
                    <span className="font-semibold text-gray-900">
                      Notificaciones
                    </span>
                  </div>

                  <span className="text-gray-400">→</span>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-linear-to-r from-orange-50 to-transparent rounded-xl hover:from-orange-100 transition group">
                  <div className="flex items-center gap-3">
                    <Shield className="text-orange-600" size={20} />
                    <span className="font-semibold text-gray-900">
                      Privacidad y seguridad
                    </span>
                  </div>

                  <span className="text-gray-400">→</span>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-linear-to-r from-red-50 to-transparent rounded-xl hover:from-red-100 transition group">
                  <div className="flex items-center gap-3">
                    <LogOut className="text-red-600" size={20} />
                    <button className="font-semibold text-gray-900" onClick={handleLogout}>
                      Cerrar sesión
                    </button>
                  </div>

                  <span className="text-gray-400">→</span>
                </button>

              </div>
            </div>
          </div>
        </div>

        {/* MASCOTAS */}
        <div>

          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Mis Mascotas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* CARD */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">

              <div className="relative h-40 overflow-hidden bg-linear-to-br from-blue-100 to-purple-100">

                <img
                  src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop"
                  alt="pet"
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg">
                  <Cat className="text-gray-700" size={20} />
                </div>
              </div>

              <div className="p-5">

                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Luna
                </h3>

                <p className="text-sm text-gray-600 mb-4 font-medium">
                  Gato
                </p>

                <div className="space-y-3">

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Edad</span>

                    <span className="font-semibold text-gray-900">
                      3 años
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Salud</span>

                    <span className="font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                      Excelente
                    </span>
                  </div>
                </div>

                <button className="w-full mt-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2 rounded-lg transition-all shadow-md">
                  Ver detalles
                </button>

              </div>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-16 text-center text-gray-600 text-sm pb-8">
          <p>© 2026 CatDog - Cuidado integral para tus mascotas</p>
        </div>

      </main>
    </div>
  );
}