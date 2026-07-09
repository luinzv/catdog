import express from "express";
import {
  obtenerAmigos,
  obtenerSolicitudes,
  buscarUsuarios,
  enviarSolicitud,
  aceptarSolicitud,
  rechazarSolicitud,
  eliminarAmistad,
} from "../controllers/amistadController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", obtenerAmigos);
router.get("/solicitudes", obtenerSolicitudes);
router.get("/buscar", buscarUsuarios);
router.post("/:receptorId", enviarSolicitud);
router.put("/:id/aceptar", aceptarSolicitud);
router.put("/:id/rechazar", rechazarSolicitud);
router.delete("/:id", eliminarAmistad);

export default router;