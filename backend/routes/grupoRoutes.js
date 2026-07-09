import express from "express";
import {
  obtenerGrupos,
  obtenerGrupoPorId,
  crearGrupo,
  invitarMiembro,
  cambiarRolMiembro,
  expulsarMiembro,
  salirDeGrupo,
  cerrarGrupo,
  obtenerAvisos,
  crearAviso,
  crearAvisoUbicacion,
} from "../controllers/grupoController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", obtenerGrupos);
router.get("/:id", obtenerGrupoPorId);
router.post("/", crearGrupo);
router.post("/:id/invitar", invitarMiembro);
router.put("/:id/miembros/:usuarioId/rol", cambiarRolMiembro);
router.delete("/:id/miembros/:usuarioId", expulsarMiembro);
router.post("/:id/salir", salirDeGrupo);
router.put("/:id/cerrar", cerrarGrupo);

router.get("/:id/avisos", obtenerAvisos);
router.post("/:id/avisos", crearAviso);
router.post("/:id/avisos/ubicacion", crearAvisoUbicacion);

export default router;