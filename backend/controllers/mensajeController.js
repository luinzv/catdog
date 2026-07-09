import Mensaje from "../models/Mensaje.js";
import Amistad from "../models/Amistad.js";

// Verifica que exista una amistad ACEPTADA entre ambos usuarios
const sonAmigos = async (userId, otroId) => {
  const amistad = await Amistad.findOne({
    estado: "aceptada",
    $or: [
      { solicitante: userId, receptor: otroId },
      { solicitante: otroId, receptor: userId },
    ],
  });
  return !!amistad;
};

// GET /api/mensajes/conversaciones
// Lista de amistades aceptadas + último mensaje intercambiado (si existe)
export const obtenerConversaciones = async (req, res) => {
  try {
    const userId = req.user.id;

    const amistades = await Amistad.find({
      estado: "aceptada",
      $or: [{ solicitante: userId }, { receptor: userId }],
    })
      .populate("solicitante", "nombre email imagen")
      .populate("receptor", "nombre email imagen");

    const conversaciones = await Promise.all(
      amistades.map(async (amistad) => {
        const otro =
          amistad.solicitante._id.toString() === userId
            ? amistad.receptor
            : amistad.solicitante;

        const ultimoMensaje = await Mensaje.findOne({
          $or: [
            { emisor: userId, receptor: otro._id },
            { emisor: otro._id, receptor: userId },
          ],
        }).sort({ createdAt: -1 });

        const noLeidos = await Mensaje.countDocuments({
          emisor: otro._id,
          receptor: userId,
          leido: false,
        });

        return {
          amigo: otro,
          ultimoMensaje: ultimoMensaje
            ? {
                contenido: ultimoMensaje.contenido,
                createdAt: ultimoMensaje.createdAt,
                esMio: ultimoMensaje.emisor.toString() === userId,
              }
            : null,
          noLeidos,
        };
      })
    );

    // Ordenar: conversaciones con mensajes más recientes primero
    conversaciones.sort((a, b) => {
      const fechaA = a.ultimoMensaje ? new Date(a.ultimoMensaje.createdAt).getTime() : 0;
      const fechaB = b.ultimoMensaje ? new Date(b.ultimoMensaje.createdAt).getTime() : 0;
      return fechaB - fechaA;
    });

    res.json(conversaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener las conversaciones" });
  }
};

// GET /api/mensajes/:amigoId  → historial de mensajes con un amigo
export const obtenerMensajes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amigoId } = req.params;

    const esAmigo = await sonAmigos(userId, amigoId);
    if (!esAmigo) {
      return res.status(403).json({ msg: "Solo puedes ver mensajes de tus amistades" });
    }

    const mensajes = await Mensaje.find({
      $or: [
        { emisor: userId, receptor: amigoId },
        { emisor: amigoId, receptor: userId },
      ],
    }).sort({ createdAt: 1 });

    // Marcar como leídos los mensajes recibidos de ese amigo
    await Mensaje.updateMany(
      { emisor: amigoId, receptor: userId, leido: false },
      { leido: true }
    );

    res.json(mensajes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los mensajes" });
  }
};

// POST /api/mensajes/:amigoId  → enviar mensaje
export const enviarMensaje = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amigoId } = req.params;
    const { contenido } = req.body;

    if (!contenido || !contenido.trim()) {
      return res.status(400).json({ msg: "El mensaje no puede estar vacío" });
    }

    const esAmigo = await sonAmigos(userId, amigoId);
    if (!esAmigo) {
      return res.status(403).json({ msg: "Solo puedes enviar mensajes a tus amistades" });
    }

    const nuevoMensaje = new Mensaje({
      emisor: userId,
      receptor: amigoId,
      contenido: contenido.trim(),
    });

    const guardado = await nuevoMensaje.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al enviar el mensaje" });
  }
};