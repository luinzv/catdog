import express from "express";
import {
  obtenerRecordatorios,
  crearRecordatorio,
  actualizarRecordatorio,
  eliminarRecordatorio,
  completarRecordatorio,
} from "../controllers/recordatorioController.js";

const router = express.Router();

router.get("/mascota/:id", obtenerRecordatorios);
router.get("/", obtenerRecordatorios);
router.post("/", crearRecordatorio);
router.put("/:id", actualizarRecordatorio);
router.put("/:id/completar", completarRecordatorio);
router.delete("/:id", eliminarRecordatorio);

export default router;