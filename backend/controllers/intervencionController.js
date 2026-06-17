import Intervencion from "../models/Intervencion.js";

// Obtener todas las intervenciones de una mascota
export const obtenerIntervenciones = async (req, res) => {
  try {
    const intervenciones = await Intervencion.find({ mascota: req.params.mascotaId }).sort({ fecha: -1 });
    res.json(intervenciones);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener intervenciones" });
  }
};

// Crear una nueva intervención
export const crearIntervencion = async (req, res) => {
  try {
    const { fecha, tipo, veterinario, notas } = req.body;

    if (!fecha || !tipo || !veterinario) {
      return res.status(400).json({ msg: "Fecha, tipo y veterinario son obligatorios" });
    }

    const nuevaIntervencion = new Intervencion({
      mascota: req.params.mascotaId,
      fecha,
      tipo,
      veterinario,
      notas,
    });

    await nuevaIntervencion.save();
    res.status(201).json(nuevaIntervencion);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear intervención" });
  }
};

// Eliminar una intervención
export const eliminarIntervencion = async (req, res) => {
  try {
    const intervencion = await Intervencion.findByIdAndDelete(req.params.id);
    if (!intervencion) {
      return res.status(404).json({ msg: "Intervención no encontrada" });
    }
    res.json({ msg: "Intervención eliminada" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar intervención" });
  }
};