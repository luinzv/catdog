import Grupo from "../models/Grupo.js";
import AvisoGrupo from "../models/AvisoGrupo.js";
import Amistad from "../models/Amistad.js";
import MascotaPerdida from "../models/MascotaPerdida.js";

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

const esMiembro = (grupo, userId) =>
  grupo.miembros.some((m) => m.usuario._id
    ? m.usuario._id.toString() === userId
    : m.usuario.toString() === userId);

const obtenerRol = (grupo, userId) => {
  const miembro = grupo.miembros.find((m) =>
    m.usuario._id ? m.usuario._id.toString() === userId : m.usuario.toString() === userId
  );
  return miembro?.rol || null;
};

// GET /api/grupos  → grupos donde el usuario es miembro
export const obtenerGrupos = async (req, res) => {
  try {
    const grupos = await Grupo.find({ "miembros.usuario": req.user.id })
      .populate("miembros.usuario", "nombre email imagen")
      .populate("creador", "nombre email imagen")
      .populate("mascotaPerdida", "nombre tipo imagen estado")
      .sort({ createdAt: -1 });

    res.json(grupos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los grupos" });
  }
};

// GET /api/grupos/:id  → detalle de un grupo (solo si es miembro)
export const obtenerGrupoPorId = async (req, res) => {
  try {
    const grupo = await Grupo.findById(req.params.id)
      .populate("miembros.usuario", "nombre email imagen")
      .populate("creador", "nombre email imagen")
      .populate("mascotaPerdida", "nombre tipo imagen estado ubicacion");

    if (!grupo) return res.status(404).json({ msg: "Grupo no encontrado" });

    if (!esMiembro(grupo, req.user.id)) {
      return res.status(403).json({ msg: "No perteneces a este grupo" });
    }

    res.json(grupo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener el grupo" });
  }
};

// POST /api/grupos  → crear grupo (el creador queda como admin)
export const crearGrupo = async (req, res) => {
  try {
    const { nombre, descripcion, mascotaPerdida, invitados } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ msg: "El nombre del grupo es obligatorio" });
    }

    if (mascotaPerdida) {
      const mascota = await MascotaPerdida.findById(mascotaPerdida);
      if (!mascota) {
        return res.status(404).json({ msg: "La mascota perdida asociada no existe" });
      }
    }

    // Validar que los invitados iniciales sean amistades del creador
    const listaInvitados = Array.isArray(invitados) ? invitados : [];
    const miembros = [{ usuario: req.user.id, rol: "admin" }];

    for (const invitadoId of listaInvitados) {
      if (invitadoId === req.user.id) continue;
      const esAmigo = await sonAmigos(req.user.id, invitadoId);
      if (esAmigo) {
        miembros.push({ usuario: invitadoId, rol: "miembro" });
      }
    }

    const nuevoGrupo = new Grupo({
      nombre: nombre.trim(),
      descripcion: descripcion?.trim() || "",
      creador: req.user.id,
      miembros,
      mascotaPerdida: mascotaPerdida || null,
    });

    const guardado = await nuevoGrupo.save();
    const populado = await Grupo.findById(guardado._id)
      .populate("miembros.usuario", "nombre email imagen")
      .populate("creador", "nombre email imagen")
      .populate("mascotaPerdida", "nombre tipo imagen estado");

    res.status(201).json(populado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear el grupo" });
  }
};

// POST /api/grupos/:id/invitar  → invitar amistad al grupo (solo admin)
export const invitarMiembro = async (req, res) => {
  try {
    const { usuarioId } = req.body;
    const grupo = await Grupo.findById(req.params.id);

    if (!grupo) return res.status(404).json({ msg: "Grupo no encontrado" });

    if (obtenerRol(grupo, req.user.id) !== "admin") {
      return res.status(403).json({ msg: "Solo un administrador puede invitar miembros" });
    }

    if (esMiembro(grupo, usuarioId)) {
      return res.status(400).json({ msg: "El usuario ya pertenece al grupo" });
    }

    const esAmigo = await sonAmigos(req.user.id, usuarioId);
    if (!esAmigo) {
      return res.status(403).json({ msg: "Solo puedes invitar a tus amistades" });
    }

    grupo.miembros.push({ usuario: usuarioId, rol: "miembro" });
    await grupo.save();

    const populado = await Grupo.findById(grupo._id)
      .populate("miembros.usuario", "nombre email imagen")
      .populate("creador", "nombre email imagen")
      .populate("mascotaPerdida", "nombre tipo imagen estado");

    res.json(populado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al invitar al miembro" });
  }
};

// PUT /api/grupos/:id/miembros/:usuarioId/rol  → cambiar rol (solo admin)
export const cambiarRolMiembro = async (req, res) => {
  try {
    const { rol } = req.body;
    const { usuarioId } = req.params;

    if (!["admin", "miembro"].includes(rol)) {
      return res.status(400).json({ msg: "Rol inválido" });
    }

    const grupo = await Grupo.findById(req.params.id);
    if (!grupo) return res.status(404).json({ msg: "Grupo no encontrado" });

    if (obtenerRol(grupo, req.user.id) !== "admin") {
      return res.status(403).json({ msg: "Solo un administrador puede cambiar roles" });
    }

    const miembro = grupo.miembros.find((m) => m.usuario.toString() === usuarioId);
    if (!miembro) return res.status(404).json({ msg: "Miembro no encontrado en el grupo" });

    miembro.rol = rol;
    await grupo.save();

    res.json({ msg: "Rol actualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al cambiar el rol" });
  }
};

// DELETE /api/grupos/:id/miembros/:usuarioId  → expulsar miembro (solo admin)
export const expulsarMiembro = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const grupo = await Grupo.findById(req.params.id);
    if (!grupo) return res.status(404).json({ msg: "Grupo no encontrado" });

    if (obtenerRol(grupo, req.user.id) !== "admin") {
      return res.status(403).json({ msg: "Solo un administrador puede expulsar miembros" });
    }

    if (usuarioId === grupo.creador.toString()) {
      return res.status(400).json({ msg: "No puedes expulsar al creador del grupo" });
    }

    grupo.miembros = grupo.miembros.filter((m) => m.usuario.toString() !== usuarioId);
    await grupo.save();

    res.json({ msg: "Miembro expulsado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al expulsar al miembro" });
  }
};

// POST /api/grupos/:id/salir  → el usuario abandona el grupo
export const salirDeGrupo = async (req, res) => {
  try {
    const grupo = await Grupo.findById(req.params.id);
    if (!grupo) return res.status(404).json({ msg: "Grupo no encontrado" });

    if (!esMiembro(grupo, req.user.id)) {
      return res.status(403).json({ msg: "No perteneces a este grupo" });
    }

    if (grupo.creador.toString() === req.user.id) {
      return res.status(400).json({
        msg: "El creador no puede salir del grupo. Puedes cerrarlo o transferir el rol de admin.",
      });
    }

    grupo.miembros = grupo.miembros.filter((m) => m.usuario.toString() !== req.user.id);
    await grupo.save();

    res.json({ msg: "Saliste del grupo" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al salir del grupo" });
  }
};

// PUT /api/grupos/:id/cerrar  → cerrar grupo (solo admin)
export const cerrarGrupo = async (req, res) => {
  try {
    const grupo = await Grupo.findById(req.params.id);
    if (!grupo) return res.status(404).json({ msg: "Grupo no encontrado" });

    if (obtenerRol(grupo, req.user.id) !== "admin") {
      return res.status(403).json({ msg: "Solo un administrador puede cerrar el grupo" });
    }

    grupo.estado = "Cerrado";
    await grupo.save();

    res.json({ msg: "Grupo cerrado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al cerrar el grupo" });
  }
};

// ── AVISOS DEL GRUPO ─────────────────────────────────

// GET /api/grupos/:id/avisos  → avisos del grupo (solo miembros)
export const obtenerAvisos = async (req, res) => {
  try {
    const grupo = await Grupo.findById(req.params.id);
    if (!grupo) return res.status(404).json({ msg: "Grupo no encontrado" });

    if (!esMiembro(grupo, req.user.id)) {
      return res.status(403).json({ msg: "No perteneces a este grupo" });
    }

    const avisos = await AvisoGrupo.find({ grupo: req.params.id })
      .populate("autor", "nombre email imagen")
      .sort({ createdAt: 1 });

    res.json(avisos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los avisos" });
  }
};

// POST /api/grupos/:id/avisos  → crear aviso (solo miembros, grupo activo)
export const crearAviso = async (req, res) => {
  try {
    const { contenido } = req.body;

    if (!contenido || !contenido.trim()) {
      return res.status(400).json({ msg: "El aviso no puede estar vacío" });
    }

    const grupo = await Grupo.findById(req.params.id);
    if (!grupo) return res.status(404).json({ msg: "Grupo no encontrado" });

    if (!esMiembro(grupo, req.user.id)) {
      return res.status(403).json({ msg: "No perteneces a este grupo" });
    }

    if (grupo.estado === "Cerrado") {
      return res.status(400).json({ msg: "Este grupo está cerrado" });
    }

    const nuevoAviso = new AvisoGrupo({
      grupo: req.params.id,
      autor: req.user.id,
      contenido: contenido.trim(),
      tipo: "texto",
    });

    const guardado = await nuevoAviso.save();
    const populado = await AvisoGrupo.findById(guardado._id).populate("autor", "nombre email imagen");

    res.status(201).json(populado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear el aviso" });
  }
};

// POST /api/grupos/:id/avisos/ubicacion  → compartir ubicación en el grupo (solo miembros, grupo activo)
export const crearAvisoUbicacion = async (req, res) => {
  try {
    const { lat, lng, direccion } = req.body;

    if (typeof lat !== "number" || typeof lng !== "number") {
      return res.status(400).json({ msg: "Coordenadas de ubicación inválidas" });
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ msg: "Coordenadas de ubicación fuera de rango" });
    }

    const grupo = await Grupo.findById(req.params.id);
    if (!grupo) return res.status(404).json({ msg: "Grupo no encontrado" });

    // Impide compartir ubicación con usuarios no autorizados: solo miembros del grupo
    if (!esMiembro(grupo, req.user.id)) {
      return res.status(403).json({ msg: "No perteneces a este grupo" });
    }

    if (grupo.estado === "Cerrado") {
      return res.status(400).json({ msg: "Este grupo está cerrado" });
    }

    const nuevoAviso = new AvisoGrupo({
      grupo: req.params.id,
      autor: req.user.id,
      contenido: direccion?.trim() || "Ubicación compartida",
      tipo: "ubicacion",
      ubicacion: { lat, lng, direccion: direccion?.trim() || "" },
    });

    const guardado = await nuevoAviso.save();
    const populado = await AvisoGrupo.findById(guardado._id).populate("autor", "nombre email imagen");

    res.status(201).json(populado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al compartir la ubicación en el grupo" });
  }
};