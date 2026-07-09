import Amistad from "../models/Amistad.js";
import Usuario from "../models/Usuario.js";

// GET /api/amistades  → amistades aceptadas del usuario logueado
export const obtenerAmigos = async (req, res) => {
  try {
    const amistades = await Amistad.find({
      estado: "aceptada",
      $or: [{ solicitante: req.user.id }, { receptor: req.user.id }],
    })
      .populate("solicitante", "nombre email imagen")
      .populate("receptor", "nombre email imagen");

    res.json(amistades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener las amistades" });
  }
};

// GET /api/amistades/solicitudes  → solicitudes pendientes recibidas
export const obtenerSolicitudes = async (req, res) => {
  try {
    const solicitudes = await Amistad.find({
      receptor: req.user.id,
      estado: "pendiente",
    })
      .populate("solicitante", "nombre email imagen")
      .populate("receptor", "nombre email imagen");

    res.json(solicitudes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener las solicitudes" });
  }
};

// GET /api/amistades/buscar?q=texto  → buscar usuarios por nombre o email
export const buscarUsuarios = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const regex = new RegExp(q.trim(), "i");

    const usuarios = await Usuario.find({
      _id: { $ne: req.user.id },
      $or: [{ nombre: regex }, { email: regex }],
    }).select("nombre email imagen");

    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al buscar usuarios" });
  }
};

// POST /api/amistades/:receptorId  → enviar solicitud de amistad
export const enviarSolicitud = async (req, res) => {
  try {
    const { receptorId } = req.params;
    const solicitanteId = req.user.id;

    if (receptorId === solicitanteId) {
      return res.status(400).json({ msg: "No puedes agregarte a ti mismo" });
    }

    const receptorExiste = await Usuario.findById(receptorId);
    if (!receptorExiste) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const existente = await Amistad.findOne({
      $or: [
        { solicitante: solicitanteId, receptor: receptorId },
        { solicitante: receptorId, receptor: solicitanteId },
      ],
    });

    if (existente) {
      if (existente.estado === "aceptada") {
        return res.status(400).json({ msg: "Ya son amigos" });
      }
      if (existente.estado === "pendiente") {
        return res.status(400).json({ msg: "Ya existe una solicitud pendiente" });
      }
      // Si fue rechazada anteriormente, permitir reenviar
      existente.estado = "pendiente";
      existente.solicitante = solicitanteId;
      existente.receptor = receptorId;
      await existente.save();
      return res.status(201).json(existente);
    }

    const nuevaSolicitud = new Amistad({
      solicitante: solicitanteId,
      receptor: receptorId,
      estado: "pendiente",
    });

    const guardada = await nuevaSolicitud.save();
    res.status(201).json(guardada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al enviar la solicitud" });
  }
};

// PUT /api/amistades/:id/aceptar
export const aceptarSolicitud = async (req, res) => {
  try {
    const solicitud = await Amistad.findById(req.params.id);

    if (!solicitud) {
      return res.status(404).json({ msg: "Solicitud no encontrada" });
    }

    if (solicitud.receptor.toString() !== req.user.id) {
      return res.status(403).json({ msg: "No autorizado para aceptar esta solicitud" });
    }

    solicitud.estado = "aceptada";
    await solicitud.save();

    res.json(solicitud);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al aceptar la solicitud" });
  }
};

// PUT /api/amistades/:id/rechazar
export const rechazarSolicitud = async (req, res) => {
  try {
    const solicitud = await Amistad.findById(req.params.id);

    if (!solicitud) {
      return res.status(404).json({ msg: "Solicitud no encontrada" });
    }

    if (solicitud.receptor.toString() !== req.user.id) {
      return res.status(403).json({ msg: "No autorizado para rechazar esta solicitud" });
    }

    solicitud.estado = "rechazada";
    await solicitud.save();

    res.json(solicitud);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al rechazar la solicitud" });
  }
};

// DELETE /api/amistades/:id  → eliminar amistad (o cancelar solicitud propia)
export const eliminarAmistad = async (req, res) => {
  try {
    const amistad = await Amistad.findById(req.params.id);

    if (!amistad) {
      return res.status(404).json({ msg: "Amistad no encontrada" });
    }

    const esParte =
      amistad.solicitante.toString() === req.user.id ||
      amistad.receptor.toString() === req.user.id;

    if (!esParte) {
      return res.status(403).json({ msg: "No autorizado para eliminar esta amistad" });
    }

    await Amistad.findByIdAndDelete(req.params.id);
    res.json({ msg: "Amistad eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar la amistad" });
  }
};