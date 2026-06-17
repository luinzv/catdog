import {
  Syringe,
  AlertCircle,
  Stethoscope,
  Edit3,
  Plus,
  CheckCircle,
  Scissors,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../NavbarComponent/Navbar";

export default function PetMedicalRecord() {

  const { id } = useParams();
  const [mascota, setMascota] = useState<any>(null);
  const [vacunas, setVacunas] = useState<any[]>([]);
  const [alergias, setAlergias] = useState<any[]>([]);
  const [intervenciones, setIntervenciones] = useState<any[]>([]);
  const [showModalAddMedical, setShowModalAddMedical] = useState(false);
  const [vacunaNombre, setVacunaNombre] = useState("");
  const [alergiaTipo, setAlergiaTipo] = useState("");
  const [alergiaGravedad, setAlergiaGravedad] = useState("");
  const [intervencionFecha, setIntervencionFecha] = useState("");
  const [intervencionTipo, setIntervencionTipo] = useState("");
  const [intervencionVeterinario, setIntervencionVeterinario] = useState("");
  const [intervencionNotas, setIntervencionNotas] = useState("");
  const [showModalEditMedical, setShowModalEditMedical] = useState(false);
  const [showModalEditPet, setShowModalEditPet] = useState(false);
  const [editEdad, setEditEdad] = useState(0);
  const [editPeso, setEditPeso] = useState(0);
  const [editEstadoSalud, setEditEstadoSalud] = useState("");
  const [editEsterilizado, setEditEsterilizado] = useState(false);
  const [recordatorios, setRecordatorios] = useState<any[]>([]);

  // Errores
  const [erroresFicha, setErroresFicha] = useState<{ edad?: string; peso?: string }>({});
  const [errorVacuna, setErrorVacuna] = useState("");
  const [erroresAlergia, setErroresAlergia] = useState<{ tipo?: string; gravedad?: string }>({});
  const [erroresIntervencion, setErroresIntervencion] = useState<{ fecha?: string; tipo?: string; veterinario?: string }>({});

  // ── Validaciones ──────────────────────────────────────

  const validarFicha = (): boolean => {
    const errors: { edad?: string; peso?: string } = {};

    if (!editEdad || editEdad <= 0) {
      errors.edad = "La edad debe ser mayor a 0.";
    } else if (!Number.isInteger(editEdad)) {
      errors.edad = "La edad debe ser un número entero.";
    } else if (editEdad > 30) {
      errors.edad = "La edad no puede ser mayor a 30 años.";
    }

    if (!editPeso || editPeso <= 0) {
      errors.peso = "El peso debe ser mayor a 0.";
    } else if (editPeso > 150) {
      errors.peso = "El peso no puede ser mayor a 150 kg.";
    }

    setErroresFicha(errors);
    return Object.keys(errors).length === 0;
  };

  const validarVacuna = (): boolean => {
    if (!vacunaNombre.trim()) {
      setErrorVacuna("El nombre de la vacuna es obligatorio.");
      return false;
    }
    if (vacunaNombre.trim().length < 2) {
      setErrorVacuna("El nombre debe tener al menos 2 caracteres.");
      return false;
    }
    if (/^\d+$/.test(vacunaNombre.trim())) {
      setErrorVacuna("El nombre no puede ser solo números.");
      return false;
    }
    setErrorVacuna("");
    return true;
  };

  const validarAlergia = (): boolean => {
    const errors: { tipo?: string; gravedad?: string } = {};

    if (!alergiaTipo.trim()) {
      errors.tipo = "El tipo de alergia es obligatorio.";
    } else if (alergiaTipo.trim().length < 2) {
      errors.tipo = "El tipo debe tener al menos 2 caracteres.";
    } else if (/^\d+$/.test(alergiaTipo.trim())) {
      errors.tipo = "El tipo no puede ser solo números.";
    }

    if (!alergiaGravedad) {
      errors.gravedad = "Selecciona la gravedad.";
    }

    setErroresAlergia(errors);
    return Object.keys(errors).length === 0;
  };

  const validarIntervencion = (): boolean => {
    const errors: { fecha?: string; tipo?: string; veterinario?: string } = {};

    if (!intervencionFecha) {
      errors.fecha = "La fecha es obligatoria.";
    } else {
      const fechaSeleccionada = new Date(intervencionFecha);
      const hoy = new Date();
      hoy.setHours(23, 59, 59, 999);
      if (fechaSeleccionada > hoy) {
        errors.fecha = "La fecha no puede ser futura.";
      }
    }

    if (!intervencionTipo.trim()) {
      errors.tipo = "El procedimiento es obligatorio.";
    } else if (intervencionTipo.trim().length < 2) {
      errors.tipo = "Debe tener al menos 2 caracteres.";
    } else if (/^\d+$/.test(intervencionTipo.trim())) {
      errors.tipo = "No puede ser solo números.";
    }

    if (!intervencionVeterinario.trim()) {
      errors.veterinario = "El veterinario es obligatorio.";
    } else if (intervencionVeterinario.trim().length < 2) {
      errors.veterinario = "Debe tener al menos 2 caracteres.";
    } else if (/^\d+$/.test(intervencionVeterinario.trim())) {
      errors.veterinario = "No puede ser solo números.";
    }

    setErroresIntervencion(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Funciones ─────────────────────────────────────────

  const agregarVacuna = async () => {
    if (!validarVacuna()) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vacunas/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nombre: vacunaNombre.trim() }),
      });
      const data = await response.json();
      setVacunas([...vacunas, data]);
      setVacunaNombre("");
      setErrorVacuna("");
    } catch (error) {
      console.error("Error agregando vacuna:", error);
    }
  };

  const agregarAlergia = async () => {
    if (!validarAlergia()) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/alergias/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tipo: alergiaTipo.trim(), gravedad: alergiaGravedad }),
      });
      const data = await response.json();
      setAlergias([...alergias, data]);
      setAlergiaTipo("");
      setAlergiaGravedad("");
      setErroresAlergia({});
    } catch (error) {
      console.error("Error agregando alergia:", error);
    }
  };

  const agregarIntervencion = async () => {
    if (!validarIntervencion()) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/intervenciones/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fecha: intervencionFecha,
          tipo: intervencionTipo.trim(),
          veterinario: intervencionVeterinario.trim(),
          notas: intervencionNotas.trim(),
        }),
      });
      const data = await response.json();
      setIntervenciones([...intervenciones, data]);
      setIntervencionFecha("");
      setIntervencionTipo("");
      setIntervencionVeterinario("");
      setIntervencionNotas("");
      setErroresIntervencion({});
    } catch (error) {
      console.error("Error agregando intervención:", error);
    }
  };

  const actualizarMascota = async () => {
    if (!validarFicha()) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          edad: editEdad,
          peso: editPeso,
          estadoSalud: editEstadoSalud,
          esterilizado: editEsterilizado,
        }),
      });
      const data = await response.json();
      setMascota(data.mascota);
      setShowModalEditPet(false);
      setErroresFicha({});
    } catch (error) {
      console.error(error);
    }
  };

  // ── Effects ───────────────────────────────────────────

  useEffect(() => {
    const obtenerRecordatorios = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/recordatorios/mascota/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        setRecordatorios(data);
      } catch (error) {
        console.error(error);
      }
    };
    obtenerRecordatorios();
  }, [id]);

  useEffect(() => {
    const obtenerMascota = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mascotas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setMascota(data.mascota);
      } catch (error) {
        console.error(error);
      }
    };
    obtenerMascota();
  }, [id]);

  useEffect(() => {
    const obtenerDatosMedicos = async () => {
      try {
        const token = localStorage.getItem("token");
        const [vacunasRes, alergiasRes, intervencionesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/vacunas/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/alergias/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/intervenciones/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setVacunas(await vacunasRes.json());
        setAlergias(await alergiasRes.json());
        const intervencionesData = await intervencionesRes.json();
        setIntervenciones(Array.isArray(intervencionesData) ? intervencionesData : []);
      } catch (error) {
        console.error("Error al obtener datos médicos:", error);
      }
    };
    obtenerDatosMedicos();
  }, [id]);

  const handleAddMedical = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowModalAddMedical(false);
    setVacunaNombre("");
    setAlergiaTipo("");
    setAlergiaGravedad("");
    setIntervencionFecha("");
    setIntervencionTipo("");
    setIntervencionVeterinario("");
    setIntervencionNotas("");
    setErrorVacuna("");
    setErroresAlergia({});
    setErroresIntervencion({});
  };

  const proximaVacuna = recordatorios.find(
    (r) => r.tipo?.toLowerCase().includes("vacuna") && r.estado?.toLowerCase() === "pendiente"
  );
  const proximoControl = recordatorios.find(
    (r) => r.tipo?.toLowerCase().includes("control") && r.estado?.toLowerCase() === "pendiente"
  );

  if (!mascota) return <div>Cargando...</div>;

  // Componente de error reutilizable
  const ErrorMsg = ({ msg }: { msg?: string }) =>
    msg ? <p className="text-xs text-red-500 mt-1 font-medium">{msg}</p> : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100">
      <Navbar title={`Ficha Médica - ${mascota.nombre}`} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* TARJETA PRINCIPAL */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-blue-100 hover:shadow-xl transition-shadow duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 sm:p-8">
            <div className="sm:col-span-1">
              <div className="w-full aspect-square bg-linear-to-br from-blue-200 to-cyan-200 rounded-2xl overflow-hidden flex items-center justify-center">
                <img src={mascota.imagen} alt="Pet" className="object-cover w-full h-full" />
              </div>
            </div>

            <div className="sm:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{mascota.nombre}</h2>
                    <p className="text-lg text-gray-600 mt-1">{mascota.tipo}</p>
                  </div>
                  <div className="px-4 py-2 rounded-full font-semibold text-sm border bg-emerald-100 text-emerald-700 border-emerald-300">
                    {mascota.estadoSalud}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-linear-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium">Edad</p>
                    <p className="text-gray-900 text-lg font-bold">{mascota.edad} años</p>
                  </div>
                  <div className="bg-linear-to-br from-cyan-50 to-cyan-100 p-3 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium">Peso</p>
                    <p className="text-gray-900 text-lg font-bold">{mascota.peso} kg</p>
                  </div>
                  <div className="bg-linear-to-br from-green-50 to-green-100 p-3 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium">Vacunas Aplicadas</p>
                    <p className="text-gray-900 text-lg font-bold">{vacunas.length}</p>
                  </div>
                  <div className="bg-linear-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg">
                    <p className="text-gray-600 text-sm font-medium">Alergias Registradas</p>
                    <p className="text-gray-900 text-lg font-bold">{alergias.length}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditEdad(mascota.edad);
                  setEditPeso(mascota.peso);
                  setEditEstadoSalud(mascota.estadoSalud);
                  setEditEsterilizado(mascota.esterilizado || false);
                  setErroresFicha({});
                  setShowModalEditPet(true);
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Editar ficha
              </button>
            </div>
          </div>
        </div>

        {/* TARJETAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <Syringe className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{vacunas.length}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Vacunas Aplicadas</h3>
            <div className="text-gray-600 text-sm">
              {vacunas.length === 0 ? (
                <p>Sin vacunas aplicadas</p>
              ) : (
                vacunas.map((vacuna) => (
                  <div key={vacuna._id}>
                    <h4 className="font-semibold">{vacuna.nombre}</h4>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                <Scissors className="w-6 h-6 text-purple-600" />
              </div>
              {mascota.esterilizado ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Esterilización</h3>
            <p className="text-gray-600 text-sm">
              {mascota.esterilizado ? "Esterilizado/a" : "No esterilizado/a"}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-emerald-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Alergias</h3>
            <div className="text-gray-600 text-sm">
              {alergias.length === 0 ? (
                <p>Sin alergias registradas</p>
              ) : (
                alergias.map((alergia: any) => (
                  <div key={alergia._id} className="mb-1">
                    <p className="font-semibold">{alergia.tipo}</p>
                    <p className="text-xs text-gray-500">{alergia.gravedad}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* INTERVENCIONES VETERINARIAS */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Intervenciones Veterinarias</h2>
            <span className="text-sm text-gray-500">{intervenciones.length} registro(s)</span>
          </div>

          {intervenciones.length === 0 ? (
            <p className="text-gray-500 text-sm">Sin intervenciones registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="py-2 pr-4 font-semibold">Fecha</th>
                    <th className="py-2 pr-4 font-semibold">Procedimiento</th>
                    <th className="py-2 pr-4 font-semibold">Veterinario</th>
                    <th className="py-2 pr-4 font-semibold">Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {[...intervenciones]
                    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                    .map((interv) => (
                      <tr key={interv._id} className="border-b border-gray-100 hover:bg-blue-50/50 transition">
                        <td className="py-3 pr-4 whitespace-nowrap text-gray-700">
                          {new Date(interv.fecha).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-4 font-medium text-gray-900">{interv.tipo}</td>
                        <td className="py-3 pr-4 text-gray-700">{interv.veterinario}</td>
                        <td className="py-3 pr-4 text-gray-500">{interv.notas || "—"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RECORDATORIOS */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recordatorios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl p-6 text-white shadow-lg">
              <Syringe className="w-8 h-8 mb-3 opacity-90" />
              <h3 className="font-semibold text-lg mb-1">Próxima Vacuna</h3>
              <p className="text-white/90 text-sm">
                {proximaVacuna ? new Date(proximaVacuna.fecha).toLocaleDateString() : "Sin vacunas pendientes"}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl p-6 text-white shadow-lg">
              <Stethoscope className="w-8 h-8 mb-3 opacity-90" />
              <h3 className="font-semibold text-lg mb-1">Próximo Control</h3>
              <p className="text-white/90 text-sm">
                {proximoControl ? new Date(proximoControl.fecha).toLocaleDateString() : "Sin controles pendientes"}
              </p>
            </div>
          </div>
        </div>

        {/* BOTONES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => {
              setVacunaNombre("");
              setAlergiaTipo("");
              setAlergiaGravedad("");
              setIntervencionFecha("");
              setIntervencionTipo("");
              setIntervencionVeterinario("");
              setIntervencionNotas("");
              setErrorVacuna("");
              setErroresAlergia({});
              setErroresIntervencion({});
              setShowModalAddMedical(true);
            }}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Agregar
          </button>

          <button
            onClick={() => setShowModalEditMedical(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Edit3 className="w-5 h-5" />
            Editar
          </button>
        </div>

        {/* MODAL EDITAR HISTORIAL */}
        {showModalEditMedical && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Editar Historial Médico</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Vacunas</h3>
                  {vacunas.length === 0 ? (
                    <p className="text-gray-500 text-sm">Sin vacunas registradas</p>
                  ) : (
                    vacunas.map((v) => (
                      <div key={v._id} className="flex items-center justify-between mb-2">
                        <span>{v.nombre}</span>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded"
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem("token");
                              await fetch(`${import.meta.env.VITE_API_URL}/api/vacunas/${v._id}`, {
                                method: "DELETE",
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              setVacunas(vacunas.filter((vac) => vac._id !== v._id));
                            } catch (error) {
                              console.error(error);
                            }
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Alergias</h3>
                  {alergias.length === 0 ? (
                    <p className="text-gray-500 text-sm">Sin alergias registradas</p>
                  ) : (
                    alergias.map((a) => (
                      <div key={a._id} className="flex items-center justify-between mb-2">
                        <span>{a.tipo} ({a.gravedad})</span>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded"
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem("token");
                              await fetch(`${import.meta.env.VITE_API_URL}/api/alergias/${a._id}`, {
                                method: "DELETE",
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              setAlergias(alergias.filter((al) => al._id !== a._id));
                            } catch (error) {
                              console.error(error);
                            }
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Intervenciones</h3>
                  {intervenciones.length === 0 ? (
                    <p className="text-gray-500 text-sm">Sin intervenciones registradas</p>
                  ) : (
                    intervenciones.map((interv) => (
                      <div key={interv._id} className="flex items-center justify-between mb-2">
                        <span>
                          {interv.tipo} — {new Date(interv.fecha).toLocaleDateString()}
                        </span>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded"
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem("token");
                              await fetch(`${import.meta.env.VITE_API_URL}/api/intervenciones/${interv._id}`, {
                                method: "DELETE",
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              setIntervenciones(intervenciones.filter((i) => i._id !== interv._id));
                            } catch (error) {
                              console.error(error);
                            }
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold"
                    onClick={() => setShowModalEditMedical(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDITAR FICHA */}
        {showModalEditPet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-2xl font-bold mb-4">Editar Ficha Médica</h2>
              <div className="space-y-4">

                <div>
                  <label className="block mb-1 font-medium">Edad (1 - 30 años)</label>
                  <input
                    type="number"
                    value={editEdad}
                    min={1}
                    max={30}
                    onChange={(e) => {
                      setEditEdad(Number(e.target.value));
                      setErroresFicha(p => ({ ...p, edad: undefined }));
                    }}
                    className={`w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 ${erroresFicha.edad ? "border-red-400 bg-red-50" : ""}`}
                  />
                  <ErrorMsg msg={erroresFicha.edad} />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Peso en kg (0.1 - 150)</label>
                  <input
                    type="number"
                    value={editPeso}
                    min={0.1}
                    max={150}
                    step={0.1}
                    onChange={(e) => {
                      setEditPeso(Number(e.target.value));
                      setErroresFicha(p => ({ ...p, peso: undefined }));
                    }}
                    className={`w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 ${erroresFicha.peso ? "border-red-400 bg-red-50" : ""}`}
                  />
                  <ErrorMsg msg={erroresFicha.peso} />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Estado de Salud</label>
                  <select
                    value={editEstadoSalud}
                    onChange={(e) => setEditEstadoSalud(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="Excelente">Excelente</option>
                    <option value="En tratamiento">En tratamiento</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium">¿Está esterilizado/a?</label>
                  <select
                    value={editEsterilizado ? "si" : "no"}
                    onChange={(e) => setEditEsterilizado(e.target.value === "si")}
                    className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="no">No</option>
                    <option value="si">Sí</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => { setShowModalEditPet(false); setErroresFicha({}); }}
                  className="px-5 py-2 rounded-xl bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={actualizarMascota}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL AGREGAR */}
        {showModalAddMedical && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Agregar Historial Médico</h2>
              <form className="space-y-4" onSubmit={handleAddMedical}>

                {/* VACUNAS */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Vacunas</h3>
                  <div className="flex gap-2 mb-1">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Nombre vacuna"
                        value={vacunaNombre}
                        onChange={(e) => { setVacunaNombre(e.target.value); setErrorVacuna(""); }}
                        className={`w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 ${errorVacuna ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                      />
                      <ErrorMsg msg={errorVacuna} />
                    </div>
                    <button
                      type="button"
                      onClick={agregarVacuna}
                      className="px-3 py-2 bg-blue-600 text-white rounded-xl self-start"
                    >
                      Agregar
                    </button>
                  </div>
                </div>

                {/* ALERGIAS */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Alergias</h3>
                  <div className="flex flex-col sm:flex-row gap-2 mb-1">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Tipo alergia"
                        value={alergiaTipo}
                        onChange={(e) => { setAlergiaTipo(e.target.value); setErroresAlergia(p => ({ ...p, tipo: undefined })); }}
                        className={`w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 ${erroresAlergia.tipo ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                      />
                      <ErrorMsg msg={erroresAlergia.tipo} />
                    </div>
                    <div>
                      <select
                        value={alergiaGravedad}
                        onChange={(e) => { setAlergiaGravedad(e.target.value); setErroresAlergia(p => ({ ...p, gravedad: undefined })); }}
                        className={`border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 ${erroresAlergia.gravedad ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                      >
                        <option value="">Gravedad</option>
                        <option value="Leve">Leve</option>
                        <option value="Moderada">Moderada</option>
                        <option value="Alta">Alta</option>
                      </select>
                      <ErrorMsg msg={erroresAlergia.gravedad} />
                    </div>
                    <button
                      type="button"
                      onClick={agregarAlergia}
                      className="px-3 py-2 bg-blue-600 text-white rounded-xl self-start"
                    >
                      Agregar
                    </button>
                  </div>
                </div>

                {/* INTERVENCIONES */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Intervenciones Veterinarias</h3>
                  <div className="grid grid-cols-2 gap-2 mb-1">
                    <div>
                      <input
                        type="date"
                        value={intervencionFecha}
                        max={new Date().toISOString().split("T")[0]}
                        onChange={(e) => { setIntervencionFecha(e.target.value); setErroresIntervencion(p => ({ ...p, fecha: undefined })); }}
                        className={`w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 ${erroresIntervencion.fecha ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                      />
                      <ErrorMsg msg={erroresIntervencion.fecha} />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Procedimiento"
                        value={intervencionTipo}
                        onChange={(e) => { setIntervencionTipo(e.target.value); setErroresIntervencion(p => ({ ...p, tipo: undefined })); }}
                        className={`w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 ${erroresIntervencion.tipo ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                      />
                      <ErrorMsg msg={erroresIntervencion.tipo} />
                    </div>
                  </div>
                  <div className="mb-1">
                    <input
                      type="text"
                      placeholder="Veterinario responsable"
                      value={intervencionVeterinario}
                      onChange={(e) => { setIntervencionVeterinario(e.target.value); setErroresIntervencion(p => ({ ...p, veterinario: undefined })); }}
                      className={`w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 ${erroresIntervencion.veterinario ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                    />
                    <ErrorMsg msg={erroresIntervencion.veterinario} />
                  </div>
                  <div className="flex gap-2">
                    <textarea
                      placeholder="Notas (opcional)"
                      value={intervencionNotas}
                      onChange={(e) => setIntervencionNotas(e.target.value)}
                      rows={2}
                      className="flex-1 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                    />
                    <button
                      type="button"
                      onClick={agregarIntervencion}
                      className="px-3 py-2 bg-blue-600 text-white rounded-xl self-start"
                    >
                      Agregar
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModalAddMedical(false);
                      setVacunaNombre("");
                      setAlergiaTipo("");
                      setAlergiaGravedad("");
                      setIntervencionFecha("");
                      setIntervencionTipo("");
                      setIntervencionVeterinario("");
                      setIntervencionNotas("");
                      setErrorVacuna("");
                      setErroresAlergia({});
                      setErroresIntervencion({});
                    }}
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
      </main>
    </div>
  );
}