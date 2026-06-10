import MascotaPerdida from "../models/MascotaPerdida.js";

export const obtenerMascotasPerdidas = async (req, res) => {
  try {
    const mascotas = await MascotaPerdida.find()
      .populate("usuario", "nombre email")
      .sort({ createdAt: -1 });
    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener mascotas perdidas" });
  }
};

export const crearMascotaPerdida = async (req, res) => {
  try {
    const nueva = await MascotaPerdida.create({
      ...req.body,
      usuario: req.user.id,
    });
    const populada = await MascotaPerdida.findById(nueva._id).populate("usuario", "nombre email");
    res.status(201).json(populada);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear reporte" });
  }
};

export const actualizarMascotaPerdida = async (req, res) => {
  try {
    const mascota = await MascotaPerdida.findById(req.params.id);
    if (!mascota) return res.status(404).json({ msg: "Reporte no encontrado" });
    if (mascota.usuario.toString() !== req.user.id)
      return res.status(403).json({ msg: "No autorizado" });

    const actualizada = await MascotaPerdida.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    ).populate("usuario", "nombre email");

    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar reporte" });
  }
};

export const eliminarMascotaPerdida = async (req, res) => {
  try {
    const mascota = await MascotaPerdida.findById(req.params.id);
    if (!mascota) return res.status(404).json({ msg: "Reporte no encontrado" });
    if (mascota.usuario.toString() !== req.user.id)
      return res.status(403).json({ msg: "No autorizado" });

    await MascotaPerdida.findByIdAndDelete(req.params.id);
    res.json({ msg: "Reporte eliminado" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar reporte" });
  }
};

export const marcarEncontrada = async (req, res) => {
  try {
    const mascota = await MascotaPerdida.findById(req.params.id);
    if (!mascota) return res.status(404).json({ msg: "Reporte no encontrado" });
    if (mascota.usuario.toString() !== req.user.id)
      return res.status(403).json({ msg: "No autorizado" });

    mascota.estado = "Encontrada";
    await mascota.save();
    res.json(mascota);
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar estado" });
  }
};