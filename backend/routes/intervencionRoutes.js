import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  obtenerIntervenciones,
  crearIntervencion,
  eliminarIntervencion,
} from "../controllers/intervencionController.js";

const router = express.Router();

router.get("/:mascotaId", authMiddleware, obtenerIntervenciones);
router.post("/:mascotaId", authMiddleware, crearIntervencion);
router.delete("/:id", authMiddleware, eliminarIntervencion);

export default router;