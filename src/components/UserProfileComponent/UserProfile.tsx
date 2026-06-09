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
  Eye,
  X,
  Camera,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

type Mascota = {
  _id: string;
  imagen: string;
  nombre: string;
  tipo: string;
  edad: number;
  estadoSalud: string;
};

export default function UserProfile() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [editarModal, setEditarModal] = useState(false);

  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [imagenPreview, setImagenPreview] = useState("");
  const [imagenBase64, setImagenBase64] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [guardando, setGuardando] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    obtenerMascotas();
  }, []);

  const obtenerMascotas = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        }
        setMascotas([]);
        return;
      }
      const data = await res.json();
      setMascotas(Array.isArray(data.mascotas) ? data.mascotas : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const abrirEditarModal = () => {
    setNombre(user.nombre || "");
    setEmail(user.email || "");
    setPassword("");
    setConfirmarPassword("");
    setImagenPreview(user.imagen || "");
    setImagenBase64("");
    setErrorMsg("");
    setEditarModal(true);
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limitar tamaño a 2MB
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("La imagen no puede superar los 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagenPreview(base64);
      setImagenBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const guardarPerfil = async () => {
    setErrorMsg("");

    if (password && password !== confirmarPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    setGuardando(true);
    try {
      const token = localStorage.getItem("token");
      const body: any = { nombre, email };
      if (password) body.password = password;
      if (imagenBase64) body.imagen = imagenBase64;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/perfil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        setErrorMsg(err.msg || "Error al guardar.");
        return;
      }

      const data = await res.json();

      // Actualizar localStorage con los nuevos datos
      localStorage.setItem("user", JSON.stringify(data.usuario));

      setEditarModal(false);
      // Recargar para reflejar cambios
      window.location.reload();
    } catch (err) {
      console.error(err);
      setErrorMsg("Error de conexión.");
    } finally {
      setGuardando(false);
    }
  };

  const avatarSrc =
    user.imagen ||
    "https://i.pinimg.com/736x/08/0a/fb/080afbcc2ed1022bbdc59446190164d8.jpg";

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100">

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                CatDog
              </h1>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Mi perfil
              </h1>
            </div>
            <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4">
              <nav className="flex gap-6 sm:gap-8">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Inicio</a>
                <a href="/mascotas" className="text-gray-600 hover:text-blue-600 transition">Mascotas</a>
                <a href="/recordatorios" className="text-gray-600 hover:text-blue-600 transition">Recordatorios</a>
                <a href="/perfil" className="text-blue-600 font-medium">Perfil</a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* PERFIL */}
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="relative">
              <img
                src={avatarSrc}
                alt="profile"
                className="w-32 h-32 rounded-full border-4 border-blue-100 object-cover shadow-lg"
              />
              <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.nombre || "Anonimo"}
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                {user.email || "correo@example.com"}
              </p>
              <button
                onClick={abrirEditarModal}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-md"
              >
                <Edit3 size={18} />
                Editar perfil
              </button>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Información Personal</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                  <Mail className="text-blue-600 shrink-0" size={20} />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Correo</p>
                    <p className="text-sm font-semibold text-gray-900">{user.email || "correo@example.com"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition">
                  <Phone className="text-purple-600 shrink-0" size={20} />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Teléfono</p>
                    <p className="text-sm font-semibold text-gray-900">+56 9 1234 5678</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition">
                  <MapPin className="text-orange-600 shrink-0" size={20} />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Ciudad</p>
                    <p className="text-sm font-semibold text-gray-900">Valparaíso</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition">
                  <Cake className="text-green-600 shrink-0" size={20} />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Se unió</p>
                    <p className="text-sm font-semibold text-gray-900">Mayo 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Configuración</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-linear-to-r from-blue-50 to-transparent rounded-xl hover:from-blue-100 transition group">
                  <div className="flex items-center gap-3">
                    <Lock className="text-blue-600" size={20} />
                    <span className="font-semibold text-gray-900">Cambiar contraseña</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-linear-to-r from-purple-50 to-transparent rounded-xl hover:from-purple-100 transition group">
                  <div className="flex items-center gap-3">
                    <Bell className="text-purple-600" size={20} />
                    <span className="font-semibold text-gray-900">Notificaciones</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-linear-to-r from-orange-50 to-transparent rounded-xl hover:from-orange-100 transition group">
                  <div className="flex items-center gap-3">
                    <Shield className="text-orange-600" size={20} />
                    <span className="font-semibold text-gray-900">Privacidad y seguridad</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-4 bg-linear-to-r from-red-50 to-transparent rounded-xl hover:from-red-100 transition group"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="text-red-600" size={20} />
                    <span className="font-semibold text-gray-900">Cerrar sesión</span>
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
            <h2 className="text-2xl font-bold text-gray-900">Mis Mascotas</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mascotas.map((pet) => (
              <div
                key={pet._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-transform duration-300 hover:scale-105"
              >
                <div className="relative h-44 overflow-hidden rounded-t-2xl bg-gradient-to-br from-blue-100 to-purple-100">
                  <img
                    src={pet.imagen || "https://via.placeholder.com/150"}
                    alt={pet.nombre}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg">
                    <Cat className="text-gray-700" size={20} />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{pet.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-4 font-medium">{pet.tipo}</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Edad</span>
                      <span className="font-semibold text-gray-900">{pet.edad} años</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Salud</span>
                      <span className={`font-semibold px-3 py-1 rounded-full ${
                        pet.estadoSalud === "Excelente" ? "bg-green-100 text-green-700"
                        : pet.estadoSalud === "Buena" ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                      }`}>
                        {pet.estadoSalud}
                      </span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-2 rounded-lg shadow-md transition-all flex items-center justify-center gap-2">
                    <Eye size={16} />
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-16 text-center text-gray-600 text-sm pb-8">
          <p>© 2026 CatDog - Cuidado integral para tus mascotas</p>
        </div>
      </main>

      {/* MODAL EDITAR PERFIL */}
      {editarModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">

            {/* Encabezado del modal */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Editar perfil</h2>
              <button
                onClick={() => setEditarModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Avatar con botón de cambio */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img
                  src={imagenPreview || avatarSrc}
                  alt="preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-md"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-lg transition"
                >
                  <Camera size={14} />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImagenChange}
              />
              <p className="text-xs text-gray-400 mt-2">Máximo 2MB</p>
            </div>

            {/* Campos */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Correo</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="correo@example.com"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Nueva contraseña <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="••••••••"
                />
              </div>

              {password && (
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Confirmar contraseña</label>
                  <input
                    type="password"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="••••••••"
                  />
                </div>
              )}

              {errorMsg && (
                <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditarModal(false)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={guardarPerfil}
                disabled={guardando}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-60"
              >
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}