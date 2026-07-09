import {
  MessageCircle,
  Send,
  ArrowLeft,
  Search,
  CheckCheck,
  MapPin,
  Paperclip,
  Navigation,
  X,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../NavbarComponent/Navbar";

type Usuario = {
  _id: string;
  nombre: string;
  email: string;
  imagen?: string;
};

type Ubicacion = {
  lat: number;
  lng: number;
  direccion?: string;
};

type Mensaje = {
  _id: string;
  emisor: string;
  receptor: string;
  contenido: string;
  leido: boolean;
  createdAt: string;
  tipo?: "texto" | "ubicacion";
  ubicacion?: Ubicacion;
};

type Conversacion = {
  amigo: Usuario;
  ultimoMensaje: {
    contenido: string;
    createdAt: string;
    esMio: boolean;
    tipo?: "texto" | "ubicacion";
  } | null;
  noLeidos: number;
};

const AVATAR = "https://i.pinimg.com/736x/08/0a/fb/080afbcc2ed1022bbdc59446190164d8.jpg";

export default function ChatPage() {
  const { amigoId } = useParams<{ amigoId: string }>();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id || user.id;
  const token = localStorage.getItem("token");
  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [loadingConversaciones, setLoadingConversaciones] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const [conversacionActiva, setConversacionActiva] = useState<Usuario | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loadingMensajes, setLoadingMensajes] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  // ── Compartir ubicación ──
  const [menuAdjuntoAbierto, setMenuAdjuntoAbierto] = useState(false);
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Cargar lista de conversaciones ───────────────────

  const cargarConversaciones = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mensajes/conversaciones`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setConversaciones(Array.isArray(data) ? data : []);
    } catch {
      // silencioso: no interrumpir con toasts en el polling
    } finally {
      setLoadingConversaciones(false);
    }
  };

  useEffect(() => {
    cargarConversaciones();
    const interval = setInterval(cargarConversaciones, 8000);
    return () => clearInterval(interval);
  }, []);

  // ── Si viene un amigoId en la URL, abrir esa conversación ──

  useEffect(() => {
    if (amigoId && conversaciones.length > 0) {
      const conv = conversaciones.find((c) => c.amigo._id === amigoId);
      if (conv) setConversacionActiva(conv.amigo);
    }
  }, [amigoId, conversaciones]);

  // ── Cargar mensajes de la conversación activa + polling ──

  const cargarMensajes = async (otroId: string, mostrarLoading = false) => {
    if (mostrarLoading) setLoadingMensajes(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mensajes/${otroId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 403) {
        setError("Solo puedes chatear con tus amistades aceptadas.");
        return;
      }
      const data = await res.json();
      setMensajes(Array.isArray(data) ? data : []);
    } catch {
      setError("Error al cargar los mensajes");
    } finally {
      if (mostrarLoading) setLoadingMensajes(false);
    }
  };

  useEffect(() => {
    if (!conversacionActiva) return;
    setError("");
    cargarMensajes(conversacionActiva._id, true);
    const interval = setInterval(() => cargarMensajes(conversacionActiva._id, false), 4000);
    return () => clearInterval(interval);
  }, [conversacionActiva]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [mensajes]);

  // Cerrar el menú de "adjuntar" al hacer click fuera de él
  useEffect(() => {
    if (!menuAdjuntoAbierto) return;
    const handler = () => setMenuAdjuntoAbierto(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuAdjuntoAbierto]);

  // ── Enviar mensaje ───────────────────────────────────

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversacionActiva || !nuevoMensaje.trim()) return;

    setEnviando(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mensajes/${conversacionActiva._id}`,
        {
          method: "POST",
          headers: headers(),
          body: JSON.stringify({ contenido: nuevoMensaje.trim() }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al enviar el mensaje");
      setMensajes((prev) => [...prev, data]);
      setNuevoMensaje("");
      cargarConversaciones();
    } catch (err: any) {
      setError(err.message || "Error al enviar el mensaje");
    } finally {
      setEnviando(false);
    }
  };

  // ── Compartir ubicación actual ───────────────────────

  const compartirUbicacionActual = () => {
    if (!conversacionActiva) return;
    setMenuAdjuntoAbierto(false);
    setErrorUbicacion("");

    if (!("geolocation" in navigator)) {
      setErrorUbicacion("Tu dispositivo/navegador no soporta geolocalización.");
      return;
    }

    setObteniendoUbicacion(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await enviarUbicacion(latitude, longitude);
      },
      (geoError) => {
        setObteniendoUbicacion(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setErrorUbicacion(
            "Permiso de ubicación denegado. Actívalo en la configuración de tu navegador/dispositivo."
          );
        } else {
          setErrorUbicacion("No se pudo obtener tu ubicación. Intenta nuevamente.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const enviarUbicacion = async (lat: number, lng: number, direccion?: string) => {
    if (!conversacionActiva) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mensajes/${conversacionActiva._id}/ubicacion`,
        {
          method: "POST",
          headers: headers(),
          body: JSON.stringify({ lat, lng, direccion }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al compartir la ubicación");
      setMensajes((prev) => [...prev, data]);
      cargarConversaciones();
    } catch (err: any) {
      setErrorUbicacion(err.message || "Error al compartir la ubicación");
    } finally {
      setObteniendoUbicacion(false);
    }
  };

  const abrirConversacion = (amigo: Usuario) => {
    setConversacionActiva(amigo);
    navigate(`/mensajes/${amigo._id}`);
  };

  const volverALista = () => {
    setConversacionActiva(null);
    navigate("/mensajes");
  };

  const conversacionesFiltradas = conversaciones.filter((c) =>
    c.amigo.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formatearHora = (fecha: string) =>
    new Date(fecha).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar title="Mensajes" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-[calc(100vh-220px)] min-h-[500px] flex">
          {/* ── LISTA DE CONVERSACIONES ── */}
          <div
            className={`w-full md:w-80 border-r border-slate-100 flex flex-col ${
              conversacionActiva ? "hidden md:flex" : "flex"
            }`}
          >
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Conversaciones</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar amigo..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingConversaciones ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : conversacionesFiltradas.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-7 h-7 text-blue-500" />
                  </div>
                  <p className="text-slate-500 text-sm">
                    {conversaciones.length === 0
                      ? "Agrega amigos para comenzar a chatear."
                      : "Sin resultados."}
                  </p>
                  {conversaciones.length === 0 && (
                    <button
                      onClick={() => navigate("/amigos")}
                      className="mt-3 text-blue-600 text-sm font-semibold hover:underline"
                    >
                      Ir a Amistades
                    </button>
                  )}
                </div>
              ) : (
                conversacionesFiltradas.map((c) => (
                  <button
                    key={c.amigo._id}
                    onClick={() => abrirConversacion(c.amigo)}
                    className={`w-full flex items-center gap-3 p-4 border-b border-slate-50 hover:bg-slate-50 transition text-left ${
                      conversacionActiva?._id === c.amigo._id ? "bg-blue-50" : ""
                    }`}
                  >
                    <img
                      src={c.amigo.imagen || AVATAR}
                      alt={c.amigo.nombre}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-900 truncate">{c.amigo.nombre}</p>
                        {c.ultimoMensaje && (
                          <span className="text-xs text-slate-400 shrink-0 ml-2">
                            {formatearHora(c.ultimoMensaje.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 truncate flex items-center gap-1">
                        {c.ultimoMensaje?.tipo === "ubicacion" && (
                          <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        )}
                        {c.ultimoMensaje
                          ? `${c.ultimoMensaje.esMio ? "Tú: " : ""}${
                              c.ultimoMensaje.tipo === "ubicacion"
                                ? "Ubicación compartida"
                                : c.ultimoMensaje.contenido
                            }`
                          : "Inicia la conversación"}
                      </p>
                    </div>
                    {c.noLeidos > 0 && (
                      <span className="shrink-0 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {c.noLeidos}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ── VENTANA DE CHAT ── */}
          <div className={`flex-1 flex flex-col ${conversacionActiva ? "flex" : "hidden md:flex"}`}>
            {!conversacionActiva ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Selecciona una conversación</h3>
                <p className="text-slate-500 text-sm">Elige a un amigo de la lista para empezar a chatear.</p>
              </div>
            ) : (
              <>
                {/* HEADER CHAT */}
                <div className="flex items-center gap-3 p-4 border-b border-slate-100 shrink-0">
                  <button
                    onClick={volverALista}
                    className="md:hidden w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <img
                    src={conversacionActiva.imagen || AVATAR}
                    alt={conversacionActiva.nombre}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
                  />
                  <div>
                    <p className="font-bold text-slate-900">{conversacionActiva.nombre}</p>
                    <p className="text-xs text-slate-400">{conversacionActiva.email}</p>
                  </div>
                </div>

                {/* MENSAJES */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingMensajes ? (
                    <div className="flex justify-center py-12">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 border border-red-100 text-red-500 text-sm rounded-2xl p-4 text-center">
                      {error}
                    </div>
                  ) : mensajes.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center h-full">
                      <p className="text-slate-400 text-sm">Aún no hay mensajes. ¡Saluda a {conversacionActiva.nombre}!</p>
                    </div>
                  ) : (
                    mensajes.map((m) => {
                      const esMio = m.emisor === userId;
                      const esUbicacion = m.tipo === "ubicacion" && m.ubicacion;

                      if (esUbicacion) {
                        const { lat, lng, direccion } = m.ubicacion!;
                        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                        const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=15&size=300x150&markers=${lat},${lng},red-pushpin`;
                        return (
                          <div key={m._id} className={`flex ${esMio ? "justify-end" : "justify-start"}`}>
                            <a
                              href={mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`max-w-[75%] sm:max-w-[60%] rounded-2xl overflow-hidden border block hover:opacity-90 transition ${
                                esMio
                                  ? "border-blue-200 rounded-br-md"
                                  : "border-slate-200 rounded-bl-md"
                              }`}
                            >
                              <div className="relative bg-slate-100">
                                <img
                                  src={staticMapUrl}
                                  alt="Ubicación compartida"
                                  className="w-full h-32 object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                  }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <MapPin className="w-8 h-8 text-red-500 drop-shadow" fill="currentColor" />
                                </div>
                              </div>
                              <div
                                className={`px-3 py-2 text-sm ${
                                  esMio
                                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                                    : "bg-slate-100 text-slate-800"
                                }`}
                              >
                                <p className="font-semibold flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                                  Ubicación compartida
                                </p>
                                {direccion && (
                                  <p className="text-xs opacity-90 mt-0.5 break-words">{direccion}</p>
                                )}
                                <div
                                  className={`flex items-center gap-1 mt-1 text-[11px] ${
                                    esMio ? "text-white/70 justify-end" : "text-slate-400"
                                  }`}
                                >
                                  {formatearHora(m.createdAt)}
                                  {esMio && <CheckCheck className="w-3 h-3" />}
                                </div>
                              </div>
                            </a>
                          </div>
                        );
                      }

                      return (
                        <div key={m._id} className={`flex ${esMio ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[75%] sm:max-w-[60%] rounded-2xl px-4 py-2.5 text-sm ${
                              esMio
                                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-br-md"
                                : "bg-slate-100 text-slate-800 rounded-bl-md"
                            }`}
                          >
                            <p className="break-words">{m.contenido}</p>
                            <div
                              className={`flex items-center gap-1 mt-1 text-[11px] ${
                                esMio ? "text-white/70 justify-end" : "text-slate-400"
                              }`}
                            >
                              {formatearHora(m.createdAt)}
                              {esMio && <CheckCheck className="w-3 h-3" />}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* AVISO ERROR UBICACIÓN */}
                {errorUbicacion && (
                  <div className="mx-4 mb-2 flex items-start gap-2 bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl p-3">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="flex-1">{errorUbicacion}</p>
                    <button onClick={() => setErrorUbicacion("")} className="shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* INPUT ENVIAR */}
                <form onSubmit={handleEnviar} className="p-4 border-t border-slate-100 flex gap-2 shrink-0 relative">
                  {/* Menú adjuntar (compartir ubicación) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setMenuAdjuntoAbierto((v) => !v)}
                      disabled={!!error || obteniendoUbicacion}
                      title="Compartir ubicación"
                      className="w-11 h-11 shrink-0 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition disabled:opacity-50"
                    >
                      {obteniendoUbicacion ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Paperclip className="w-5 h-5" />
                      )}
                    </button>

                    {menuAdjuntoAbierto && (
                      <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-10">
                        <button
                          type="button"
                          onClick={compartirUbicacionActual}
                          className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 transition"
                        >
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <Navigation className="w-4 h-4 text-red-500" />
                          </div>
                          Compartir mi ubicación actual
                        </button>
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    disabled={!!error}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-slate-50"
                  />
                  <button
                    type="submit"
                    disabled={enviando || !nuevoMensaje.trim() || !!error}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-5 py-2.5 flex items-center gap-2 font-semibold text-sm transition"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Enviar</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}