import Mascota from "../models/Mascota.js";

// GET mascotas del usuario
export const getMascotas = async (req, res) => {
  try {
    const userId = req.user.id;
    const mascotas = await Mascota.find({ propietario: userId });
    res.json({ ok: true, mascotas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error obteniendo mascotas" });
  }
};

// CREATE nueva mascota
export const createMascota = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ ok: false, msg: "Usuario no autenticado" });
    }

    const { nombre, tipo, edad, peso, estadoSalud, descripcion, imagen } = req.body;

    const newMascota = await Mascota.create({
      nombre,
      tipo,
      edad,
      peso,
      estadoSalud,
      descripcion,
      imagen,
      propietario: req.user.id,
    });

    res.status(201).json({ ok: true, mascota: newMascota });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error creando mascota" });
  }
};

// UPDATE mascota
export const updateMascota = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Mascota.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ ok: true, mascota: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error actualizando mascota" });
  }
};

// DELETE mascota
export const deleteMascota = async (req, res) => {
  try {
    const { id } = req.params;
    await Mascota.findByIdAndDelete(id);
    res.json({ ok: true, msg: "Mascota eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error eliminando mascota" });
  }
};

// GET mascota por id
export const getMascotaById = async (req, res) => {
  try {
    const { id } = req.params;
    const mascota = await Mascota.findById(id);

    if (!mascota) {
      return res.status(404).json({ ok: false, msg: "Mascota no encontrada" });
    }

    res.json({ ok: true, mascota });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al obtener mascota" });
  }
};