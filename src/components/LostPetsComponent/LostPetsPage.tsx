import {
  Plus,
  MapPin,
  Phone,
  X,
  Edit2,
  CheckCircle,
  Search,
  AlertTriangle,
  LocateFixed,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

type MascotaPerdida = {
  _id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  imagen?: string;
  fechaPerdida: string;
  ubicacion: string;
  contacto: string;
  estado: "Perdida" | "Encontrada";
  usuario: { _id: string; nombre: string; email: string };
  lat?: number;
  lng?: number;
};

const EMPTY_FORM = {
  nombre: "",
  tipo: "Perro",
  descripcion: "",
  imagen: "",
  fechaPerdida: "",
  ubicacion: "",
  contacto: "",
  lat: null as number | null,
  lng: null as number | null,
};

type Sugerencia = {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    house_number?: string;
    suburb?: string;
    neighbourhood?: string;
    village?: string;
    town?: string;
    city?: string;
    municipality?: string;
    county?: string;
    state?: string;
  };
};

export default function LostPetsPage() {
  const [mascotas, setMascotas] = useState<MascotaPerdida[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<"Todas" | "Perdida" | "Encontrada">("Todas");
  const [busqueda, setBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [editarModal, setEditarModal] = useState(false);
  const [editarId, setEditarId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([]);
  const [buscandoDireccion, setBuscandoDireccion] = useState(false);
  const [detectandoUbicacion, setDetectandoUbicacion] = useState(false);

  // Guarda la ubicación del usuario para sesgar la búsqueda
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  useEffect(() => {
    obtenerMascotas();
    // Intentar obtener ubicación del usuario al cargar
    detectarUbicacion(false);
  }, []);

  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const obtenerMascotas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas-perdidas`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setMascotas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Detectar ubicación del navegador
  const detectarUbicacion = (setEnForm = true) => {
    if (!navigator.geolocation) return;

    if (setEnForm) setDetectandoUbicacion(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserLocation({ lat, lng });

        if (setEnForm) {
          // Reverse geocoding para obtener la dirección desde las coordenadas
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=es`
            );
            const data = await res.json();
            const direccion = formatearDireccion(data);
            setForm((prev) => ({
              ...prev,
              ubicacion: direccion,
              lat,
              lng,
            }));
          } catch {
            setForm((prev) => ({ ...prev, lat, lng }));
          } finally {
            setDetectandoUbicacion(false);
          }
        }
      },
      () => {
        if (setEnForm) setDetectandoUbicacion(false);
      }
    );
  };

  const formatearDireccion = (s: Sugerencia) => {
    const a = s.address || {};
    const partes = [
      a.road,
      a.house_number,
      a.suburb || a.neighbourhood || a.village || a.town,
      a.city || a.municipality || a.county,
      a.state,
    ].filter(Boolean);

    return partes.length > 0 ? partes.join(", ") : s.display_name;
  };

  const buscarDirecciones = async (texto: string) => {
    if (texto.length < 3) {
      setSugerencias([]);
      return;
    }
    setBuscandoDireccion(true);
    try {
      const query = encodeURIComponent(texto);

      // Si tenemos la ubicación del usuario, construimos un viewbox dinámico
      // de ~50km alrededor de su posición
      let viewboxParam = "";
      const loc = userLocation;
      if (loc) {
        const delta = 0.5; // ~55km
        const viewbox = `${loc.lng - delta},${loc.lat + delta},${loc.lng + delta},${loc.lat - delta}`;
        viewboxParam = `&viewbox=${viewbox}&bounded=0`;
      }

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=7&addressdetails=1&accept-language=es&countrycodes=cl${viewboxParam}`,
        { headers: { "Accept-Language": "es" } }
      );
      const data = await res.json();
      setSugerencias(data);
    } catch (err) {
      console.error(err);
    } finally {
      setBuscandoDireccion(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUbicacionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, ubicacion: e.target.value, lat: null, lng: null });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      buscarDirecciones(e.target.value);
    }, 500);
  };

  const seleccionarSugerencia = (s: Sugerencia) => {
    setForm((prev) => ({
      ...prev,
      ubicacion: formatearDireccion(s),
      lat: parseFloat(s.lat),
      lng: parseFloat(s.lon),
    }));
    setSugerencias([]);
  };

  const crearReporte = async () => {
    if (!form.nombre || !form.descripcion || !form.fechaPerdida || !form.ubicacion || !form.contacto) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas-perdidas`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMascotas((prev) => [data, ...prev]);
      setForm(EMPTY_FORM);
      setSugerencias([]);
      setMostrarModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const abrirEditar = (m: MascotaPerdida) => {
    setEditarId(m._id);
    setForm({
      nombre: m.nombre,
      tipo: m.tipo,
      descripcion: m.descripcion,
      imagen: m.imagen || "",
      fechaPerdida: m.fechaPerdida.slice(0, 10),
      ubicacion: m.ubicacion,
      contacto: m.contacto,
      lat: m.lat || null,
      lng: m.lng || null,
    });
    setSugerencias([]);
    setEditarModal(true);
  };

  const guardarEdicion = async () => {
    if (!editarId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas-perdidas/${editarId}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMascotas((prev) => prev.map((m) => (m._id === editarId ? data : m)));
      setEditarModal(false);
      setEditarId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const eliminar = async (id: string) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas-perdidas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMascotas((prev) => prev.filter((m) => m._id !== id));
      setEditarModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const marcarEncontrada = async (id: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas-perdidas/${id}/encontrada`, {
        method: "PUT",
        headers: headers(),
      });
      const data = await res.json();
      setMascotas((prev) => prev.map((m) => (m._id === id ? data : m)));
    } catch (err) {
      console.error(err);
    }
  };

  const mascotasFiltradas = mascotas
    .filter((m) => filtro === "Todas" || m.estado === filtro)
    .filter((m) =>
      busqueda === "" ||
      m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
    );

  const perdidas = mascotas.filter((m) => m.estado === "Perdida").length;
  const encontradas = mascotas.filter((m) => m.estado === "Encontrada").length;

  const CampoUbicacion = () => (
    <div className="relative">
      <label className="text-xs font-semibold text-slate-700 mb-1 block">Ubicación *</label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleUbicacionChange}
            placeholder="Ej: Calle Los Aromos 123, Placilla"
            autoComplete="off"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300 pr-10"
          />
          {buscandoDireccion && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Botón detectar ubicación actual */}
        <button
          type="button"
          onClick={() => detectarUbicacion(true)}
          disabled={detectandoUbicacion}
          title="Usar mi ubicación actual"
          className="shrink-0 w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition disabled:opacity-50"
        >
          {detectandoUbicacion
            ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            : <LocateFixed className="w-4 h-4 text-blue-500" />
          }
        </button>
      </div>

      {/* Sugerencias */}
      {sugerencias.length > 0 && (
        <div className="absolute z-[100] w-full bg-white border border-gray-200 rounded-xl shadow-xl mt-1 overflow-hidden">
          {sugerencias.map((s, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={() => seleccionarSugerencia(s)}
              className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 border-b border-gray-100 last:border-0 transition flex items-start gap-2"
            >
              <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-700 font-medium">{formatearDireccion(s)}</p>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{s.display_name}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Estado */}
      {form.lat && form.lng ? (
        <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Ubicación confirmada
        </p>
      ) : form.ubicacion.length > 0 ? (
        <p className="text-xs text-amber-500 mt-1 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          Selecciona una sugerencia o usa el botón de ubicación
        </p>
      ) : (
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
          <LocateFixed className="w-3 h-3" />
          Escribe una dirección o presiona el ícono para usar tu ubicación actual
        </p>
      )}
    </div>
  );

  const FormFields = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 block">Nombre *</label>
          <input name="nombre" value={form.nombre} onChange={handleChange}
            placeholder="Nombre de la mascota"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 block">Tipo *</label>
          <select name="tipo" value={form.tipo} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300">
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 mb-1 block">Descripción física *</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
          placeholder="Color, tamaño, características especiales..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 block">Fecha de pérdida *</label>
          <input name="fechaPerdida" type="date" value={form.fechaPerdida} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 block">Contacto *</label>
          <input name="contacto" value={form.contacto} onChange={handleChange}
            placeholder="+56 9 1234 5678"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
      </div>

      {CampoUbicacion()}

      <div>
        <label className="text-xs font-semibold text-slate-700 mb-1 block">URL de imagen</label>
        <input name="imagen" value={form.imagen} onChange={handleChange}
          placeholder="https://..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                CatDog
              </h1>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Mascotas Perdidas
              </h1>
            </div>
            <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-8">

              {/* Desktop nav */}
              <nav className="hidden md:flex gap-6 sm:gap-8">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Inicio</a>

                {/* Dropdown Gestión */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
                  >
                    Gestión
                    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg py-2 min-w-40 z-50">
                      <a href="/mascotas" className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition">Mascotas</a>
                      <a href="/recordatorios" className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition">Recordatorios</a>
                      <a href="/alertas" className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition">Alertas</a>
                    </div>
                  )}
                </div>

                <a href="/mascotas-perdidas" className="text-blue-600 font-medium">Perdidas</a>
                <a href="/perfil" className="text-gray-600 font-medium hover:text-blue-600 transition">Perfil</a>
              </nav>

              {/* Botón reportar desktop */}
              <button
                onClick={() => { setForm(EMPTY_FORM); setSugerencias([]); setMostrarModal(true); }}
                className="hidden md:flex bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/30 text-white font-semibold rounded-2xl px-6 py-3 items-center gap-2 transition-all"
              >
                <Plus className="w-5 h-5" />
                Reportar Mascota
              </button>

              {/* Hamburger móvil */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="w-6 h-6 text-slate-700" />
              </button>
            </div>

            {/* Menú móvil */}
            {mobileMenuOpen && (
              <div className="md:hidden flex flex-col gap-1 pt-4 border-t border-slate-100 mt-4">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition py-2">Inicio</a>
                <a href="/mascotas-perdidas" className="text-blue-600 font-medium py-2">Perdidas</a>
                <a href="/perfil" className="text-gray-600 hover:text-blue-600 transition py-2">Perfil</a>
                <p className="text-xs text-slate-400 mt-2 mb-1">Gestión</p>
                <a href="/mascotas" className="text-gray-600 hover:text-blue-600 transition py-2 pl-2">Mascotas</a>
                <a href="/recordatorios" className="text-gray-600 hover:text-blue-600 transition py-2 pl-2">Recordatorios</a>
                <a href="/alertas" className="text-gray-600 hover:text-blue-600 transition py-2 pl-2">Alertas</a>
                <button
                  onClick={() => { setForm(EMPTY_FORM); setSugerencias([]); setMostrarModal(true); setMobileMenuOpen(false); }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/30 text-white font-semibold rounded-2xl px-6 py-3 flex items-center gap-2 transition-all mt-2"
                >
                  <Plus className="w-5 h-5" />
                  Reportar Mascota
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Reportes</p>
                <p className="text-4xl font-bold text-slate-900 mt-1">{mascotas.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Perdidas</p>
                <p className="text-4xl font-bold text-red-500 mt-1">{perdidas}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Encontradas</p>
                <p className="text-4xl font-bold text-emerald-600 mt-1">{encontradas}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Mis Reportes</p>
                <p className="text-4xl font-bold text-blue-600 mt-1">
                  {mascotas.filter((m) => m.usuario?._id === user.id || m.usuario?._id === user._id).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* BÚSQUEDA Y FILTROS */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o ubicación..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex gap-3">
            {(["Todas", "Perdida", "Encontrada"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${filtro === f
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : mascotasFiltradas.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Sin reportes</h3>
            <p className="text-slate-500 text-sm">No hay mascotas perdidas reportadas aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mascotasFiltradas.map((mascota) => {
              const esMia = mascota.usuario?._id === user.id || mascota.usuario?._id === user._id;
              const esPerdida = mascota.estado === "Perdida";
              return (
                <div key={mascota._id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-100 group">
                  <div className={`relative h-48 overflow-hidden ${esPerdida ? "bg-gradient-to-br from-red-100 to-red-200" : "bg-gradient-to-br from-emerald-100 to-emerald-200"}`}>
                    <img
                      src={mascota.imagen || "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop"}
                      alt={mascota.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${esPerdida ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}>
                      {mascota.estado}
                    </div>
                    {esMia && (
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
                        Mi reporte
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-2xl font-bold text-slate-900">{mascota.nombre}</h3>
                      <p className="text-sm text-slate-500 mt-1">{mascota.tipo}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3 pb-4 border-b border-slate-100">
                      <div className="bg-blue-50 rounded-2xl p-3">
                        <p className="text-xs text-slate-600 font-medium">Fecha</p>
                        <p className="text-sm font-bold text-blue-600 mt-1">{new Date(mascota.fechaPerdida).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-cyan-50 rounded-2xl p-3">
                        <p className="text-xs text-slate-600 font-medium">Zona</p>
                        <p className="text-sm font-bold text-cyan-600 mt-1 truncate">{mascota.ubicacion}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mb-1">Descripción</p>
                    <p className="text-sm text-slate-700 mb-4 line-clamp-2">{mascota.descripcion}</p>
                    <div className="flex items-center gap-2 mb-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 shrink-0 text-blue-500" />
                      <span className="font-medium">{mascota.contacto}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
                      <MapPin className="w-4 h-4 shrink-0 text-cyan-500" />
                      <span className="truncate">{mascota.ubicacion}</span>
                    </div>
                    <div className="flex gap-2">
                      {esMia && esPerdida && (
                        <button onClick={() => marcarEncontrada(mascota._id)} className="flex-1 rounded-xl border border-emerald-200 hover:bg-emerald-50 px-3 py-2 flex items-center justify-center gap-1 text-sm font-medium text-emerald-600 transition">
                          <CheckCircle className="w-4 h-4" /> Encontrada
                        </button>
                      )}
                      {esMia && (
                        <button onClick={() => abrirEditar(mascota)} className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2 flex items-center justify-center gap-1 text-sm font-medium transition">
                          <Edit2 className="w-4 h-4" /> Editar
                        </button>
                      )}
                      {!esMia && (
                        <a href={`tel:${mascota.contacto}`} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm">
                          <Phone className="w-4 h-4" /> Contactar
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL CREAR */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Reportar Mascota Perdida</h2>
              <button onClick={() => { setMostrarModal(false); setSugerencias([]); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            {FormFields()}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setMostrarModal(false); setSugerencias([]); }} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition">
                Cancelar
              </button>
              <button onClick={crearReporte} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition">
                Publicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {editarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Editar Reporte</h2>
              <button onClick={() => { setEditarModal(false); setSugerencias([]); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            {FormFields()}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => eliminar(editarId!)} className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition">
                Eliminar
              </button>
              <button onClick={() => { setEditarModal(false); setSugerencias([]); }} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition">
                Cancelar
              </button>
              <button onClick={guardarEdicion} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}