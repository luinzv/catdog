import express from "express";
import {
  obtenerMascotasPerdidas,
  crearMascotaPerdida,
  actualizarMascotaPerdida,
  eliminarMascotaPerdida,
  marcarEncontrada,
} from "../controllers/mascotaPerdidaController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", obtenerMascotasPerdidas);
router.post("/", crearMascotaPerdida);
router.put("/:id", actualizarMascotaPerdida);
router.delete("/:id", eliminarMascotaPerdida);
router.put("/:id/encontrada", marcarEncontrada);

export default router;