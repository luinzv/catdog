import {
  UserPlus,
  UserCheck,
  UserX,
  Search,
  Users,
  Clock,
  Trash2,
  Send,
  X,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavbarComponent/Navbar";

type Usuario = {
  _id: string;
  nombre: string;
  email: string;
  imagen?: string;
};

type Amistad = {
  _id: string;
  solicitante: Usuario;
  receptor: Usuario;
  estado: "pendiente" | "aceptada" | "rechazada";
  createdAt: string;
};

const AVATAR = "https://i.pinimg.com/736x/08/0a/fb/080afbcc2ed1022bbdc59446190164d8.jpg";

export default function FriendsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id || user.id;
  const token = localStorage.getItem("token");
  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const [tab, setTab] = useState<"amigos" | "solicitudes" | "buscar">("amigos");

  const [amigos, setAmigos] = useState<Amistad[]>([]);
  const [loadingAmigos, setLoadingAmigos] = useState(true);

  const [solicitudes, setSolicitudes] = useState<Amistad[]>([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<Usuario[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [enviadas, setEnviadas] = useState<Set<string>>(new Set());

  const [toast, setToast] = useState<{ msg: string; tipo: "ok" | "err" } | null>(null);

  const mostrarToast = (msg: string, tipo: "ok" | "err" = "ok") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const cargarAmigos = async () => {
    setLoadingAmigos(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/amistades`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setAmigos(Array.isArray(data) ? data : []);
    } catch { mostrarToast("Error cargando amigos", "err"); }
    finally { setLoadingAmigos(false); }
  };

  const cargarSolicitudes = async () => {
    setLoadingSolicitudes(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/amistades/solicitudes`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch { mostrarToast("Error cargando solicitudes", "err"); }
    finally { setLoadingSolicitudes(false); }
  };

  useEffect(() => {
    cargarAmigos();
    cargarSolicitudes();
  }, []);

  useEffect(() => {
    if (busqueda.trim().length < 2) {
      setResultados([]);
      return;
    }
    const timer = setTimeout(async () => {
      setBuscando(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/amistades/buscar?q=${encodeURIComponent(busqueda)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setResultados((Array.isArray(data) ? data : []).filter((u: Usuario) => u._id !== userId));
      } catch { mostrarToast("Error al buscar", "err"); }
      finally { setBuscando(false); }
    }, 400);
    return () => clearTimeout(timer);
  }, [busqueda]);

  const enviarSolicitud = async (receptorId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/amistades/${receptorId}`, {
        method: "POST",
        headers: headers(),
      });
      if (!res.ok) {
        const err = await res.json();
        mostrarToast(err.msg || "No se pudo enviar la solicitud", "err");
        return;
      }
      setEnviadas(prev => new Set(prev).add(receptorId));
      mostrarToast("Solicitud enviada");
    } catch { mostrarToast("Error al enviar solicitud", "err"); }
  };

  const aceptarSolicitud = async (id: string) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/amistades/${id}/aceptar`, {
        method: "PUT",
        headers: headers(),
      });
      setSolicitudes(prev => prev.filter(s => s._id !== id));
      mostrarToast("Solicitud aceptada");
      cargarAmigos();
    } catch { mostrarToast("Error al aceptar solicitud", "err"); }
  };

  const rechazarSolicitud = async (id: string) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/amistades/${id}/rechazar`, {
        method: "PUT",
        headers: headers(),
      });
      setSolicitudes(prev => prev.filter(s => s._id !== id));
      mostrarToast("Solicitud rechazada");
    } catch { mostrarToast("Error al rechazar solicitud", "err"); }
  };

  const eliminarAmigo = async (id: string) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/amistades/${id}`, {
        method: "DELETE",
        headers: headers(),
      });
      setAmigos(prev => prev.filter(a => a._id !== id));
      mostrarToast("Amistad eliminada");
    } catch { mostrarToast("Error al eliminar amistad", "err"); }
  };

  const getOtroUsuario = (amistad: Amistad): Usuario =>
    amistad.solicitante._id === userId ? amistad.receptor : amistad.solicitante;

  const yaEsAmigo = (uid: string) =>
    amigos.some(a => getOtroUsuario(a)._id === uid);

  const yaTieneSolicitud = (uid: string) =>
    enviadas.has(uid) ||
    solicitudes.some(s => s.solicitante._id === uid);

  const tabs = [
    { id: "amigos", label: "Mis Amigos", icon: Users, badge: amigos.length },
    { id: "solicitudes", label: "Solicitudes", icon: Clock, badge: solicitudes.length },
    { id: "buscar", label: "Buscar", icon: Search, badge: 0 },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar title="Amistades" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Amigos</p>
                <p className="text-4xl font-bold text-slate-900 mt-1">{amigos.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Solicitudes Pendientes</p>
                <p className="text-4xl font-bold text-amber-500 mt-1">{solicitudes.length}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Solicitudes Enviadas</p>
                <p className="text-4xl font-bold text-blue-600 mt-1">{enviadas.size}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6 p-1.5 flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.badge > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  tab === t.id ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"
                }`}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "amigos" && (
          <div className="space-y-3">
            {loadingAmigos ? (
              <div className="flex justify-center py-16">
                <div className="w-9 h-9 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : amigos.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Aún no tienes amigos</h3>
                <p className="text-slate-500 text-sm mb-4">Busca usuarios para enviar solicitudes de amistad.</p>
                <button
                  onClick={() => setTab("buscar")}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition"
                >
                  Buscar usuarios
                </button>
              </div>
            ) : (
              amigos.map((amistad) => {
                const otro = getOtroUsuario(amistad);
                return (
                  <div
                    key={amistad._id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition"
                  >
                    <img
                      src={otro.imagen || AVATAR}
                      alt={otro.nombre}
                      className="w-14 h-14 rounded-full object-cover border-2 border-blue-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{otro.nombre}</p>
                      <p className="text-sm text-slate-500 truncate">{otro.email}</p>
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium mt-0.5">
                        <CheckCircle className="w-3 h-3" /> Amigos desde {new Date(amistad.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => navigate(`/mensajes/${otro._id}`)}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/30 text-white font-semibold px-4 py-2 rounded-xl text-sm transition"
                        title="Enviar mensaje"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Mensaje</span>
                      </button>
                      <button
                        onClick={() => eliminarAmigo(amistad._id)}
                        className="w-9 h-9 rounded-xl border border-red-200 hover:bg-red-50 flex items-center justify-center transition shrink-0"
                        title="Eliminar amistad"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === "solicitudes" && (
          <div className="space-y-3">
            {loadingSolicitudes ? (
              <div className="flex justify-center py-16">
                <div className="w-9 h-9 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : solicitudes.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Sin solicitudes pendientes</h3>
                <p className="text-slate-500 text-sm">Cuando alguien te envíe una solicitud, aparecerá aquí.</p>
              </div>
            ) : (
              solicitudes.map((sol) => {
                const solicitante = sol.solicitante;
                return (
                  <div
                    key={sol._id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition"
                  >
                    <img
                      src={solicitante.imagen || AVATAR}
                      alt={solicitante.nombre}
                      className="w-14 h-14 rounded-full object-cover border-2 border-amber-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{solicitante.nombre}</p>
                      <p className="text-sm text-slate-500 truncate">{solicitante.email}</p>
                      <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-medium mt-0.5">
                        <Clock className="w-3 h-3" /> Recibida {new Date(sol.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => aceptarSolicitud(sol._id)}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition"
                      >
                        <UserCheck className="w-4 h-4" />
                        Aceptar
                      </button>
                      <button
                        onClick={() => rechazarSolicitud(sol._id)}
                        className="flex items-center gap-1.5 border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-600 hover:text-red-500 font-semibold px-4 py-2 rounded-xl text-sm transition"
                      >
                        <UserX className="w-4 h-4" />
                        Rechazar
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === "buscar" && (
          <div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por nombre o correo..."
                  className="w-full pl-9 pr-9 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                />
                {busqueda && (
                  <button
                    onClick={() => { setBusqueda(""); setResultados([]); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {busqueda.length > 0 && busqueda.length < 2 && (
                <p className="text-xs text-slate-400 mt-2 ml-1">Escribe al menos 2 caracteres para buscar.</p>
              )}
            </div>

            <div className="space-y-3">
              {buscando ? (
                <div className="flex justify-center py-12">
                  <div className="w-9 h-9 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : resultados.length === 0 && busqueda.length >= 2 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm">
                  <p className="text-slate-500 text-sm">No se encontraron usuarios con ese nombre o correo.</p>
                </div>
              ) : (
                resultados.map((u) => {
                  const esAmigo = yaEsAmigo(u._id);
                  const enviada = yaTieneSolicitud(u._id);
                  return (
                    <div
                      key={u._id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition"
                    >
                      <img
                        src={u.imagen || AVATAR}
                        alt={u.nombre}
                        className="w-14 h-14 rounded-full object-cover border-2 border-blue-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{u.nombre}</p>
                        <p className="text-sm text-slate-500 truncate">{u.email}</p>
                      </div>
                      <div className="shrink-0">
                        {esAmigo ? (
                          <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold px-4 py-2 bg-emerald-50 rounded-xl">
                            <UserCheck className="w-4 h-4" /> Amigos
                          </span>
                        ) : enviada ? (
                          <span className="flex items-center gap-1.5 text-sm text-slate-500 font-semibold px-4 py-2 bg-slate-100 rounded-xl">
                            <Clock className="w-4 h-4" /> Enviada
                          </span>
                        ) : (
                          <button
                            onClick={() => enviarSolicitud(u._id)}
                            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/30 text-white font-semibold px-4 py-2 rounded-xl text-sm transition"
                          >
                            <UserPlus className="w-4 h-4" />
                            Agregar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {busqueda.length === 0 && (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Busca a alguien</h3>
                  <p className="text-slate-500 text-sm">Ingresa el nombre o correo de un usuario registrado en CatDog.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold transition-all ${
          toast.tipo === "ok"
            ? "bg-emerald-600 text-white"
            : "bg-red-500 text-white"
        }`}>
          {toast.tipo === "ok"
            ? <CheckCircle className="w-4 h-4 shrink-0" />
            : <X className="w-4 h-4 shrink-0" />
          }
          {toast.msg}
        </div>
      )}
    </div>
  );
}