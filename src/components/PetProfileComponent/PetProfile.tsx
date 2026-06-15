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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavbarComponent/Navbar";

type Mascota = {
  _id: string;
  nombre: string;
  tipo: string;
  edad: number;
  peso: number;
  estadoSalud?: string;
  descripcion?: string;
  imagen?: string;
};

type FormErrors = {
  nombre?: string;
  tipo?: string;
  edad?: string;
  peso?: string;
};

const validarFormulario = (nombre: string, tipo: string, edad: string, peso: string): FormErrors => {
  const errors: FormErrors = {};
  const edadNum = Number(edad);
  const pesoNum = Number(peso);

  if (!nombre.trim()) {
    errors.nombre = "El nombre es obligatorio.";
  } else if (nombre.trim().length < 2) {
    errors.nombre = "El nombre debe tener al menos 2 caracteres.";
  }

  if (!tipo) {
    errors.tipo = "Selecciona el tipo de mascota.";
  }

  if (!edad) {
    errors.edad = "La edad es obligatoria.";
  } else if (isNaN(edadNum) || edadNum <= 0) {
    errors.edad = "La edad debe ser mayor a 0.";
  } else if (!Number.isInteger(edadNum)) {
    errors.edad = "La edad debe ser un número entero.";
  } else if (edadNum > 30) {
    errors.edad = "La edad no puede ser mayor a 30 años.";
  }

  if (!peso) {
    errors.peso = "El peso es obligatorio.";
  } else if (isNaN(pesoNum) || pesoNum <= 0) {
    errors.peso = "El peso debe ser mayor a 0.";
  } else if (pesoNum > 150) {
    errors.peso = "El peso no puede ser mayor a 150 kg.";
  }

  return errors;
};

export default function PetsPage() {
  const navigate = useNavigate();
  const [showModalPetCreate, setShowModalPetCreate] = useState(false);
  const [showModalEditPet, setShowModalEditPet] = useState(false);

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [estadoSalud, setEstadoSalud] = useState("Excelente");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");

  const [erroresCrear, setErroresCrear] = useState<FormErrors>({});
  const [erroresEditar, setErroresEditar] = useState<FormErrors>({});

  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null);

  const limpiarFormulario = () => {
    setNombre("");
    setTipo("");
    setEdad("");
    setPeso("");
    setEstadoSalud("Excelente");
    setDescripcion("");
    setImagen("");
    setSelectedMascota(null);
    setErroresCrear({});
    setErroresEditar({});
  };

  const openEditModal = (mascota: Mascota) => {
    setSelectedMascota(mascota);
    setNombre(mascota.nombre || "");
    setTipo(mascota.tipo || "");
    setEdad(String(mascota.edad ?? ""));
    setPeso(String(mascota.peso ?? ""));
    setErroresEditar({});
    setShowModalEditPet(true);
  };

  const obtenerMascotas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Error al obtener mascotas");
      setMascotas(data.mascotas || []);
    } catch (error) {
      console.error("Error obteniendo mascotas:", error);
    }
  };

  useEffect(() => {
    obtenerMascotas();
  }, []);

  const handleCreateMascota = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validarFormulario(nombre, tipo, edad, peso);
    if (Object.keys(errors).length > 0) {
      setErroresCrear(errors);
      return;
    }
    setErroresCrear({});

    const token = localStorage.getItem("token");
    const nuevaMascota = {
      nombre: nombre.trim(),
      tipo,
      edad: Number(edad),
      peso: Number(peso),
      estadoSalud,
      descripcion,
      imagen,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(nuevaMascota),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Error al crear mascota");
      setMascotas(prev => [...prev, data.mascota]);
      limpiarFormulario();
      setShowModalPetCreate(false);
    } catch (error) {
      console.error("Error creando mascota:", error);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMascota) return;

    const errors = validarFormulario(nombre, tipo, edad, peso);
    if (Object.keys(errors).length > 0) {
      setErroresEditar(errors);
      return;
    }
    setErroresEditar({});

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mascotas/${selectedMascota._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            nombre: nombre.trim(),
            tipo,
            edad: Number(edad),
            peso: Number(peso),
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Error al actualizar mascota");
      setMascotas(prev => prev.map(m => m._id === selectedMascota._id ? data.mascota : m));
      limpiarFormulario();
      setShowModalEditPet(false);
    } catch (error) {
      console.error("Error al guardar mascota:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedMascota) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mascotas/${selectedMascota._id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Error al eliminar mascota");
      setMascotas(prev => prev.filter(m => m._id !== selectedMascota._id));
      limpiarFormulario();
      setShowModalEditPet(false);
    } catch (error) {
      console.error("Error al eliminar mascota:", error);
    }
  };

  const mascotasSaludables = mascotas.filter(m => m.estadoSalud === "Excelente").length;
  const mascotasTratamiento = mascotas.filter(m => m.estadoSalud === "En tratamiento").length;
  const mascotasPendientes = mascotas.filter(m => m.estadoSalud === "Pendiente").length;

  // Campo reutilizable con error
  const CampoConError = ({ error }: { error?: string }) =>
    error ? <p className="text-xs text-red-500 mt-1 font-medium">{error}</p> : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar
        title="Mis Mascotas"
        action={{
          label: "Agregar Mascota",
          icon: Plus,
          onClick: () => { limpiarFormulario(); setShowModalPetCreate(true); }
        }}
      />

      {/* MODAL CREAR MASCOTA */}
      {showModalPetCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Crear Mascota</h2>

            <form className="space-y-4" onSubmit={handleCreateMascota}>
              <div>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => { setNombre(e.target.value); setErroresCrear(p => ({ ...p, nombre: undefined })); }}
                  className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300 ${erroresCrear.nombre ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                <CampoConError error={erroresCrear.nombre} />
              </div>

              <div>
                <select
                  value={tipo}
                  onChange={(e) => { setTipo(e.target.value); setErroresCrear(p => ({ ...p, tipo: undefined })); }}
                  className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300 ${erroresCrear.tipo ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                >
                  <option value="">Selecciona tipo</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                </select>
                <CampoConError error={erroresCrear.tipo} />
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Edad (1 - 30 años)"
                  value={edad}
                  onChange={(e) => { setEdad(e.target.value); setErroresCrear(p => ({ ...p, edad: undefined })); }}
                  min={1}
                  max={30}
                  className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300 ${erroresCrear.edad ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                <CampoConError error={erroresCrear.edad} />
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Peso en kg (0.1 - 150)"
                  value={peso}
                  onChange={(e) => { setPeso(e.target.value); setErroresCrear(p => ({ ...p, peso: undefined })); }}
                  min={0.1}
                  max={150}
                  step={0.1}
                  className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300 ${erroresCrear.peso ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                <CampoConError error={erroresCrear.peso} />
              </div>

              <select
                value={estadoSalud}
                onChange={(e) => setEstadoSalud(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="Excelente">Excelente</option>
                <option value="En tratamiento">En tratamiento</option>
                <option value="Pendiente">Pendiente</option>
              </select>

              <input
                type="text"
                placeholder="URL de imagen"
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
              />

              <textarea
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { limpiarFormulario(); setShowModalPetCreate(false); }}
                  className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Mascotas</p>
                <p className="text-4xl font-bold text-slate-900 mt-1">{mascotas.length}</p>
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
                <p className="text-4xl font-bold text-emerald-600 mt-1">{mascotasSaludables}</p>
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
                <p className="text-4xl font-bold text-blue-600 mt-1">{mascotasPendientes}</p>
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
                <p className="text-4xl font-bold text-amber-600 mt-1">{mascotasTratamiento}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* GRID MASCOTAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mascotas.map((mascota) => (
            <div
              key={mascota._id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-100 group"
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                <img
                  src={mascota.imagen || "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop"}
                  alt={mascota.nombre}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{mascota.nombre}</h3>
                    <p className="text-sm text-slate-500 mt-1">{mascota.tipo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 pb-6 border-b border-slate-100">
                  <div className="bg-blue-50 rounded-2xl p-3">
                    <p className="text-xs text-slate-600 font-medium">Edad</p>
                    <p className="text-lg font-bold text-blue-600 mt-1">{mascota.edad} años</p>
                  </div>
                  <div className="bg-cyan-50 rounded-2xl p-3">
                    <p className="text-xs text-slate-600 font-medium">Peso</p>
                    <p className="text-lg font-bold text-cyan-600 mt-1">{mascota.peso} kg</p>
                  </div>
                </div>

                {mascota.descripcion && (
                  <div className="mb-4">
                    <p className="text-xs text-slate-600 font-medium mb-1">Descripción:</p>
                    <p className="text-sm text-slate-700">{mascota.descripcion}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2 flex items-center justify-center gap-1 text-sm font-medium transition">
                    <Eye className="w-4 h-4" /> Perfil
                  </button>
                  <button
                    onClick={() => navigate(`/ficha-medica/${mascota._id}`)}
                    className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2 flex items-center justify-center gap-1 text-sm font-medium transition"
                  >
                    <FileText className="w-4 h-4" /> Ficha
                  </button>
                  <button
                    onClick={() => openEditModal(mascota)}
                    className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2 flex items-center justify-center gap-1 text-sm font-medium transition"
                  >
                    <Edit2 className="w-4 h-4" /> Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL EDITAR MASCOTA */}
        {showModalEditPet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Editar Mascota</h2>
                <button
                  onClick={() => { limpiarFormulario(); setShowModalEditPet(false); }}
                  className="text-slate-500 hover:text-slate-700 text-xl"
                >
                  ✕
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSave}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 ${erroresEditar.nombre ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-blue-500"}`}
                    onChange={(e) => { setNombre(e.target.value); setErroresEditar(p => ({ ...p, nombre: undefined })); }}
                    value={nombre}
                  />
                  <CampoConError error={erroresEditar.nombre} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo</label>
                  <select
                    className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 ${erroresEditar.tipo ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-blue-500"}`}
                    onChange={(e) => { setTipo(e.target.value); setErroresEditar(p => ({ ...p, tipo: undefined })); }}
                    value={tipo}
                  >
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                  </select>
                  <CampoConError error={erroresEditar.tipo} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Edad (1 - 30 años)</label>
                  <input
                    type="number"
                    placeholder="Edad"
                    min={1}
                    max={30}
                    className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 ${erroresEditar.edad ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-blue-500"}`}
                    onChange={(e) => { setEdad(e.target.value); setErroresEditar(p => ({ ...p, edad: undefined })); }}
                    value={edad}
                  />
                  <CampoConError error={erroresEditar.edad} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Peso en kg (0.1 - 150)</label>
                  <input
                    type="number"
                    placeholder="Peso"
                    min={0.1}
                    max={150}
                    step={0.1}
                    className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 ${erroresEditar.peso ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-blue-500"}`}
                    onChange={(e) => { setPeso(e.target.value); setErroresEditar(p => ({ ...p, peso: undefined })); }}
                    value={peso}
                  />
                  <CampoConError error={erroresEditar.peso} />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleDelete}
                    type="button"
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition"
                  >
                    Eliminar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}