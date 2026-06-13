import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import {
  MapPin,
  Search,
  AlertTriangle,
  Phone,
  CheckCircle,
  Filter,
} from "lucide-react";
import Navbar from "../NavbarComponent/Navbar";

// Fix iconos default de Leaflet en Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Iconos personalizados por estado
const iconoPerdida = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const iconoEncontrada = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

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
  usuario: { _id: string; nombre: string };
  lat?: number;
  lng?: number;
};

type MascotaConCoords = MascotaPerdida & {
  lat: number;
  lng: number;
};

// Componente para centrar el mapa en una mascota seleccionada
function FlyToMascota({ mascota }: { mascota: MascotaConCoords | null }) {
  const map = useMap();
  useEffect(() => {
    if (mascota) {
      map.flyTo([mascota.lat, mascota.lng], 16, { duration: 1.2 });
    }
  }, [mascota, map]);
  return null;
}

// Geocodificar dirección con Nominatim (gratis, sin API key)
const geocodificar = async (direccion: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const query = encodeURIComponent(`${direccion}, Chile`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      { headers: { "Accept-Language": "es" } }
    );
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch {
    return null;
  }
};

export default function MapPage() {
  const [mascotas, setMascotas] = useState<MascotaConCoords[]>([]);
  const [loading, setLoading] = useState(true);
  const [geocodificando, setGeocodificando] = useState(false);
  const [filtro, setFiltro] = useState<"Todas" | "Perdida" | "Encontrada">("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [seleccionada, setSeleccionada] = useState<MascotaConCoords | null>(null);

  useEffect(() => {
    cargarMascotas();
  }, []);

  const cargarMascotas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas-perdidas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const lista: MascotaPerdida[] = Array.isArray(data) ? data : [];

      // Geocodificar las que no tienen coordenadas
      setGeocodificando(true);
      const conCoords: MascotaConCoords[] = [];

      for (const mascota of lista) {
        // Si ya tiene coordenadas guardadas las usa directamente
        if (mascota.lat && mascota.lng) {
          conCoords.push(mascota as MascotaConCoords);
          continue;
        }

        // Si no, geocodifica la ubicación
        const coords = await geocodificar(mascota.ubicacion);
        if (coords) {
          conCoords.push({ ...mascota, ...coords });
        }

        // Pausa de 1s entre requests para respetar el límite de Nominatim
        await new Promise((r) => setTimeout(r, 1000));
      }

      setMascotas(conCoords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setGeocodificando(false);
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

  // Centro por defecto: Valparaíso
  const centro: [number, number] = [-33.0472, -71.6127];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      {/* HEADER */}
      <Navbar title="Mapa" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">En el mapa</p>
                <p className="text-4xl font-bold text-slate-900 mt-1">{mascotas.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
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
        </div>

        {/* LAYOUT MAPA + SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* SIDEBAR */}
          <div className="lg:col-span-1 flex flex-col gap-4">

            {/* Búsqueda y filtro */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar mascota..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div className="flex gap-2">
                {(["Todas", "Perdida", "Encontrada"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFiltro(f)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition ${
                      filtro === f
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de mascotas */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  Mascotas ({mascotasFiltradas.length})
                </h2>
              </div>

              <div className="overflow-y-auto max-h-[420px]">
                {loading || geocodificando ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-500">
                      {geocodificando ? "Geocodificando ubicaciones..." : "Cargando..."}
                    </p>
                  </div>
                ) : mascotasFiltradas.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-slate-500 text-sm">No hay mascotas en el mapa.</p>
                  </div>
                ) : (
                  mascotasFiltradas.map((mascota) => (
                    <div
                      key={mascota._id}
                      onClick={() => setSeleccionada(mascota)}
                      className={`flex items-center gap-3 p-4 cursor-pointer border-b border-slate-50 hover:bg-slate-50 transition ${
                        seleccionada?._id === mascota._id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                      }`}
                    >
                      <img
                        src={mascota.imagen || "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=100&h=100&fit=crop"}
                        alt={mascota.nombre}
                        className="w-12 h-12 rounded-2xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-sm truncate">{mascota.nombre}</p>
                          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold ${
                            mascota.estado === "Perdida"
                              ? "bg-red-100 text-red-600"
                              : "bg-emerald-100 text-emerald-600"
                          }`}>
                            {mascota.estado}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {mascota.ubicacion}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Leyenda */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
              <p className="text-xs font-bold text-slate-700 mb-3">Leyenda</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs text-slate-600">Mascota perdida</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-slate-600">Mascota encontrada</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAPA */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100" style={{ height: "600px" }}>
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <MapContainer
                  center={centro}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <FlyToMascota mascota={seleccionada} />

                  {mascotasFiltradas.map((mascota) => (
                    <Marker
                      key={mascota._id}
                      position={[mascota.lat, mascota.lng]}
                      icon={mascota.estado === "Perdida" ? iconoPerdida : iconoEncontrada}
                      eventHandlers={{
                        click: () => setSeleccionada(mascota),
                      }}
                    >
                      <Popup>
                        <div className="min-w-[200px]">
                          <img
                            src={mascota.imagen || "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=200&fit=crop"}
                            alt={mascota.nombre}
                            className="w-full h-28 object-cover rounded-lg mb-2"
                          />
                          <p className="font-bold text-slate-900 text-base">{mascota.nombre}</p>
                          <p className="text-xs text-slate-500 mb-1">{mascota.tipo}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            mascota.estado === "Perdida"
                              ? "bg-red-100 text-red-600"
                              : "bg-emerald-100 text-emerald-600"
                          }`}>
                            {mascota.estado}
                          </span>
                          <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {mascota.ubicacion}
                          </p>
                          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {mascota.contacto}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(mascota.fechaPerdida).toLocaleDateString()}
                          </p>
                          <a
                            href={`/mascotas-perdidas`}
                            className="mt-2 block text-center text-xs bg-blue-600 text-white py-1.5 rounded-lg font-semibold"
                          >
                            Ver reporte
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm pb-8">
          <p>© 2026 CatDog - Cuidado integral para tus mascotas</p>
        </div>
      </main>
    </div>
  );
}