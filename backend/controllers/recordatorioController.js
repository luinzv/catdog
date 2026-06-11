import Recordatorio from "../models/Recordatorio.js";

export const obtenerRecordatorios = async (req, res) => {
  try {
    console.log("Usuario buscando recordatorios:", req.user.id);
    const recordatorios = await Recordatorio.find({ usuario: req.user.id })
      .populate("mascota", "nombre");
    console.log("Recordatorios encontrados:", recordatorios.length);
    res.json(recordatorios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los recordatorios" });
  }
};

export const crearRecordatorio = async (req, res) => {
  try {
    console.log("req.user completo:", JSON.stringify(req.user));
    console.log("req.body completo:", JSON.stringify(req.body));

    const nuevoRecordatorio = new Recordatorio({
      usuario: req.user.id, // primero usuario
      ...req.body,          // luego body para que no sobreescriba
    });

    console.log("OBJETO ANTES DE GUARDAR:", JSON.stringify(nuevoRecordatorio.toObject()));

    const guardado = await nuevoRecordatorio.save();
    console.log("GUARDADO:", JSON.stringify(guardado));

    const recordatorio = await Recordatorio.findById(
      nuevoRecordatorio._id
    ).populate("mascota", "nombre");

    res.status(201).json(recordatorio);
  } catch (error) {
    console.error("ERROR COMPLETO:", error.message);
    res.status(500).json({ msg: error.message });
  }
};

export const actualizarRecordatorio = async (req, res) => {
  try {
    const recordatorio = await Recordatorio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("mascota", "nombre");

    if (!recordatorio) {
      return res.status(404).json({ msg: "Recordatorio no encontrado" });
    }

    res.json(recordatorio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar el recordatorio" });
  }
};

export const completarRecordatorio = async (req, res) => {
  try {
    const recordatorio = await Recordatorio.findByIdAndUpdate(
      req.params.id,
      { estado: "Completado" },
      { new: true }
    );

    if (!recordatorio) {
      return res.status(404).json({ msg: "Recordatorio no encontrado" });
    }

    res.json(recordatorio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al completar el recordatorio" });
  }
};

export const eliminarRecordatorio = async (req, res) => {
  try {
    const recordatorio = await Recordatorio.findByIdAndDelete(req.params.id);

    if (!recordatorio) {
      return res.status(404).json({ msg: "Recordatorio no encontrado" });
    }

    res.json({ msg: "Recordatorio eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar el recordatorio" });
  }
};