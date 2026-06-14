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

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const SVG_GATO = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
<g fill="#3e4347"><path d="M2.3 36.1c-.2-1-.3-2-.2-2.9c0-1.2.3-2.2.9-3.2c.6-1.1 1.6-2 2.7-2.5c1.1-.6 2.5-.8 3.8-.6c1.2.1 2.4.6 3.4 1.3c.9.6 1.7 1.4 2.4 2.3c1.1 1.5 1.9 3.3 2.3 5.4v.3c.2 1.3-.6 2.5-1.9 2.9c-.2.1-.4.1-.6.1c-.8.1-1.5-.1-2.1-.6c-.6-.5-1-1.1-1.1-1.9c-.2-1.4-.5-2.6-1.1-3.5c-.5-.9-1.3-1.6-2.1-1.8c-.3-.1-.7-.1-1 0c-.4.1-.7.4-.9.7c-.3.4-.5.8-.5 1.4c-.1.6-.1 1.2 0 1.8c.2 1.2.6 2.6 1.3 4c.3.6.7 1.3 1.1 2c.4.7.9 1.3 1.3 1.8c1.1 1.3 2.1 2.3 3.2 3.1c1.3.9 2.6 1.5 3.9 1.7c1.3.2 2.8.2 4.3-.3c1.2-.3 1.9.1 2.1.7c.2.5-.1 1.3-1.3 1.7h-.1c-1.8.6-3.7.8-5.4.5c-1.7-.2-3.5-1-5.2-2c-1.4-.9-2.6-2.1-3.9-3.5c-.5-.6-1-1.2-1.4-1.7L6 43c-.6-.7-1.1-1.4-1.5-2.1c-1.2-1.6-1.9-3.2-2.2-4.8"/><path d="M46.7 55.9c1.8 2.3 9.7 0 11-2.6c5.2-10.6 0-15.2 0-15.2l-11 1.5c0 .1-2.2 13.5 0 16.3"/><path d="M31.8 55.9c-1.8 2.3-9.7 0-11-2.6c-5.2-10.6 0-15.2 0-15.2l11 1.5c0 .1 2.3 13.5 0 16.3"/></g>
<g fill="#ffffff"><path d="M34.5 55.2c-.1 1.1-2.6 1.7-5.6 1.4c-3-.3-5.3-1.3-5.3-2.4c.1-1.1 2.4.3 5.4.5c3.1.4 5.6-.5 5.5.5"/><path d="M44 55.2c.1 1.1 2.6 1.7 5.6 1.4c3-.3 5.3-1.3 5.3-2.4c-.1-1.1-2.4.3-5.4.5c-3.1.4-5.6-.5-5.5.5"/></g>
<g fill="#4c5359"><path d="M39.2 60.4c2 2.2 8.9 2.1 11.1 0c3-3 2.9-16.7 3-23.3l-13-1.1c.1 0-3.6 21.5-1.1 24.4"/><path d="M39.3 60.4c-2 2.2-8.9 2.1-11.1 0c-3-3-2.9-16.7-3-23.3l13-1.1s3.6 21.5 1.1 24.4"/></g>
<path fill="#ffffff" d="M34 43.7l5.3 11.2l5.3-11.2z"/>
<path d="M59.9 2.2C57.5.8 45.1 7.3 42.6 11.7l17.9 10.6c2.4-4.3 1.7-18.8-.6-20.1" fill="#4c5359"/>
<path d="M56.2 8.8c-.9-.5-8.2 2.8-9.6 5.2l10 5.9c1.3-2.3.4-10.6-.4-11.1" fill="#f7a4a4"/>
<path d="M18.7 2.2c-2.4 1.4-3.1 15.7-.6 20.1L36 11.7C33.6 7.4 21 .8 18.7 2.2z" fill="#4c5359"/>
<path d="M22.5 8.8c-.9.5-1.8 8.7-.4 11.1L32 14c-1.3-2.3-8.7-5.7-9.5-5.2" fill="#f7a4a4"/>
<path d="M39.3 9.4C18.5 9.4 16.5 24 16.5 32.1c0 3.4 10.2 13.9 22.7 13.9C51.8 46 62 35.5 62 32.1C62 24 60 9.4 39.3 9.4" fill="#4c5359"/>
<path d="M33.5 28.5s-2.4 3.6-6.8 2.5s-4.6-5.4-4.6-5.4s2.4-3.6 6.8-2.5c4.4 1.2 4.6 5.4 4.6 5.4" fill="#bfffab"/>
<path d="M33 26.7S30.9 29 28 29c-3.1 0-5-4.4-5-4.4s2.1-2.4 5.8-1.4c3.5.8 4.2 3.5 4.2 3.5" fill="#93e67f"/>
<path d="M29.8 26.6c0 4.9-2.4 4.9-2.4 0s2.4-4.9 2.4 0" fill="#4c5359"/>
<path d="M45.1 28.5s2.4 3.6 6.8 2.5s4.6-5.4 4.6-5.4s-2.4-3.6-6.8-2.5c-4.4 1.2-4.6 5.4-4.6 5.4" fill="#bfffab"/>
<path d="M45.5 26.7s2.1 2.3 5 2.3c3.1 0 5-4.4 5-4.4s-2.1-2.4-5.8-1.4c-3.5.8-4.2 3.5-4.2 3.5" fill="#93e67f"/>
<path d="M48.7 26.6c0 4.9 2.4 4.9 2.4 0c.1-4.9-2.4-4.9-2.4 0" fill="#4c5359"/>
<path d="M45.9 32.5c-2-1.5-4.2-6.5-6.6-6.5s-4.7 5-6.6 6.5c-3.1 2.4-11.5 5.1-11.5 5.1s8.9 7.6 18.1 7.6c9.2 0 18.1-7.6 18.1-7.6s-8.4-2.7-11.5-5.1" fill="#ffffff"/>
<g fill="#4c5359"><path d="M45.7 39.3c-.7.4-1.6.6-2.4.6c-.8-.1-1.6-.3-2.2-.8c-.6-.5-1.1-1.2-1.2-1.9l-.6-3.3l-.6 3.3c-.1.8-.6 1.4-1.2 1.9s-1.4.8-2.2.8c-.9 0-1.7-.1-2.4-.6c-.7-.4-1.4-1.1-1.7-2c0 1 .6 1.9 1.3 2.5c.7.6 1.8 1 2.7 1.1c1 .1 2-.2 2.9-.8c.5-.3.8-.7 1.2-1.2c.3.5.7.9 1.2 1.2c.9.6 1.9.9 2.9.8c1 0 2-.4 2.7-1.1c.8-.6 1.3-1.6 1.3-2.5c-.3.9-.9 1.6-1.7 2"/><path d="M42.4 33.1c-.6-.7-2.5-.8-3.1-.8c-.6 0-2.5.1-3.1.8c-.4.5-.1 1.8 1.1 3c.7.7 1.4.9 2 .9c.6 0 1.3-.2 2-.9c1.2-1.2 1.5-2.5 1.1-3"/></g>
<g fill="#ffffff"><path d="M39 59.6c0 1.1-2.3 1.9-5.2 1.9c-2.9 0-5.2-.9-5.2-1.9c0-1.1 2.3.1 5.2.1c2.8 0 5.2-1.1 5.2-.1"/><path d="M49.9 59.6c0 1.1-2.3 1.9-5.2 1.9c-2.9 0-5.2-.9-5.2-1.9c0-1.1 2.3.1 5.2.1c2.9 0 5.2-1.1 5.2-.1"/></g>
<g fill="#3e4347"><path d="M29.6 61.2l1.4-2.4l-.4 2.8z"/><path d="M33.1 62l.5-3.3l.5 3.3z"/><path d="M37 61.6l-.4-2.6l1.4 2.3z"/><path d="M48 61.6l-.4-2.8l1.4 2.4z"/><path d="M44.4 62l.5-3.3l.5 3.3z"/><path d="M40.5 61.3l1.4-2.3l-.4 2.6z"/></g>
</svg>`;

const SVG_PERRO = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
<path d="M14.1 46.2C8 45.7 3 38 3 38c0 9.5 8.4 13 12.2 11.7c3.4-1.1-1.1-3.5-1.1-3.5z" fill="#947151"/>
<path d="M41.3 56c1.7 2 9.5 0 10.8-2.3c5.1-9.5 0-15.6 0-15.6l-10.8 3.3c0 .1-2.2 12.1 0 14.6" fill="#eabc92"/>
<path d="M34 60.4c1.9 2.2 8.8 2.1 10.8 0c3-3 2.8-16.7 3-23.3L35.1 36S31.6 57.5 34 60.4" fill="#f5d1ac"/>
<path d="M26.7 56c-1.7 2-9.5 0-10.8-2.3c-5.1-9.5 0-15.6 0-15.6l10.8 3.3c0 .1 2.3 12.1 0 14.6" fill="#eabc92"/>
<path d="M34.1 60.4c-1.9 2.2-8.8 2.1-10.8 0c-3-3-2.8-16.7-3-23.3L33 36s3.5 21.5 1.1 24.4" fill="#f5d1ac"/>
<path d="M34 60.5c-.3-2.1-.4-4.2-.4-6.3c0-2.1.1-4.2.4-6.3c.3 2.1.4 4.2.4 6.3c0 2.1-.1 4.2-.4 6.3" fill="#423223"/>
<path d="M34 46.5c-10.2 0-15.4-4-15.4-4S22 51.6 34 51.6s15.4-9.1 15.4-9.1s-5.2 4-15.4 4" fill="#3e4347"/>
<path d="M31.1 49c0-1.4.6-2.5 1.3-2.6c-.2-.2-.5-.3-.7-.3c-.9 0-1.6 1.3-1.6 2.9c0 1.6.7 2.9 1.6 2.9c.3 0 .5-.2.7-.4c-.7 0-1.3-1.1-1.3-2.5" fill="#ffffff"/>
<path d="M19.5 43C13.4 39.2 11 24.3 13 17.6c1.5-5 7-12.4 12-14.4c4.2-1.6 13.9-1.6 18.1 0c5 1.9 10.6 9.3 12 14.4c2 6.8.5 21.6-5.6 25.4c-12.8 8-17.2 8-30 0" fill="#f5d1ac"/>
<path d="M9.9 19.1c3.2 6.9 4 7.2 7.1-1c1.6-4.4.5-7 2.4-9.8c1.1-1.6 3.5-4.1 3.5-4.1S3.7 6.1 9.9 19.1" fill="#423223"/>
<path d="M18 3.9c-4.8 3-15.1 1.8-9 14.8c3.2 6.9 4 7.2 7.1-1c1.6-4.4.5-7 2.4-9.8c1.1-1.6 4.4-3.7 4.4-3.7s-1.5-2.4-4.9-.3" fill="#947151"/>
<path d="M58.2 19.1c-3.2 6.9-4 7.2-7.1-1c-1.6-4.4-.5-7-2.4-9.8c-1.1-1.6-3.5-4.1-3.5-4.1s19.2 1.9 13 14.9" fill="#423223"/>
<path d="M50.1 3.9c4.8 3 15.2 1.8 9.1 14.8c-3.2 6.9-4 7.2-7.1-1c-1.6-4.4-.5-7-2.4-9.8c-1.1-1.6-4.4-3.7-4.4-3.7s1.4-2.4 4.8-.3" fill="#947151"/>
<path d="M21.2 19.2c3 0 5.4 2.3 5.4 5.2s-2.4 5.2-5.4 5.2c-3 0-5.4-2.3-5.4-5.2s2.5-5.2 5.4-5.2" fill="#ffffff"/>
<ellipse cx="19.9" cy="24.4" rx="4" ry="3.9" fill="#3e4347"/>
<path d="M52.2 24.4c0 2.9-2.4 5.2-5.4 5.2c-3 0-5.4-2.3-5.4-5.2s2.4-5.2 5.4-5.2c3 0 5.4 2.3 5.4 5.2" fill="#ffffff"/>
<ellipse cx="48.2" cy="24.4" rx="4" ry="3.9" fill="#3e4347"/>
<path d="M24.8 40.1l4.2 4.2c2.5 2.5 7.7 2.5 10.2 0l4.2-4.2l-4.4-4.3h-9.9l-4.3 4.3" fill="#7d644b"/>
<path d="M34 32.1s-4.4 6.1-3.8 9c.7 4.2 7 4.2 7.7 0c.5-2.9-3.9-9-3.9-9" fill="#f15a61"/>
<path d="M34 42.7l1-5.9h-1.9l.9 5.9" fill="#ba454b"/>
<path fill="#423223" d="M29.5 33.8h9v4h-9z"/>
<path d="M48.3 34.7l-6.4-6.5c-3.9-3.9-11.8-3.9-15.6 0l-6.4 6.5c-1.8 1.8-1.8 4.8 0 6.7c1.8 1.8 4.8 1.8 6.6 0l6.4-6.5c.6-.6 1.8-.6 2.4 0l6.4 6.5c1.8 1.8 4.8 1.8 6.6 0c1.8-1.8 1.8-4.8 0-6.7" fill="#947151"/>
<g fill="#3e4347"><path d="M28.7 28.7c0-2.3 2.4-2.7 5.3-2.7s5.3.4 5.3 2.7c0 1.8-4.2 3.4-5.3 3.4c-1 0-5.3-1.6-5.3-3.4"/><path d="M27.1 30.7l-.9.9l.9.9l.9-.9z"/><path d="M25 33.1l-.9.9l.9.9l.9-.9z"/><path d="M27.8 34l-.9.9l.9.9l.9-.9z"/><path d="M41 30.7l.9.9l-.9.9l-.9-.9z"/><path d="M43.1 33.1l.9.9l-.9.9l-.9-.9z"/><path d="M40.3 34l.9.9l-.9.9l-.9-.9z"/></g>
</svg>`;

const crearIcono = (tipo: string, estado: "Perdida" | "Encontrada") => {
  const svgAnimal = tipo === "Gato" ? SVG_GATO : SVG_PERRO;
  const color = estado === "Perdida" ? "#ef4444" : "#10b981";

  return L.divIcon({
    html: `
      <div style="position: relative; width: 48px; height: 56px;">
        <div style="
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 16px;
          background: ${color};
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>
        <div style="
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 12px;
          background: ${color};
        "></div>
        <div style="
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 44px;
          height: 44px;
          background: white;
          border-radius: 50%;
          border: 3px solid ${color};
          box-shadow: 0 3px 10px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        ">
          ${svgAnimal}
        </div>
      </div>
    `,
    className: "",
    iconSize: [48, 56],
    iconAnchor: [24, 56],
    popupAnchor: [0, -56],
  });
};

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

function FlyToMascota({ mascota }: { mascota: MascotaConCoords | null }) {
  const map = useMap();
  useEffect(() => {
    if (mascota) {
      map.flyTo([mascota.lat, mascota.lng], 16, { duration: 1.2 });
    }
  }, [mascota, map]);
  return null;
}

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

      setGeocodificando(true);
      const conCoords: MascotaConCoords[] = [];

      for (const mascota of lista) {
        if (mascota.lat && mascota.lng) {
          conCoords.push(mascota as MascotaConCoords);
          continue;
        }
        const coords = await geocodificar(mascota.ubicacion);
        if (coords) {
          conCoords.push({ ...mascota, ...coords });
        }
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

  const centro: [number, number] = [-33.0472, -71.6127];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
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
                        ? f === "Perdida"
                          ? "bg-red-500 text-white"
                          : f === "Encontrada"
                          ? "bg-emerald-500 text-white"
                          : "bg-blue-600 text-white"
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
                            {mascota.tipo}
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
                  <div className="w-5 h-5 rounded-full bg-white border-2 border-red-500 flex items-center justify-center text-xs">🐶</div>
                  <span className="text-xs text-slate-600">Perro perdido</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white border-2 border-red-500 flex items-center justify-center text-xs">🐱</div>
                  <span className="text-xs text-slate-600">Gato perdido</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center text-xs">🐶</div>
                  <span className="text-xs text-slate-600">Perro encontrado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center text-xs">🐱</div>
                  <span className="text-xs text-slate-600">Gato encontrado</span>
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
                      icon={crearIcono(mascota.tipo, mascota.estado)}
                      eventHandlers={{ click: () => setSeleccionada(mascota) }}
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
                            href="/mascotas-perdidas"
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