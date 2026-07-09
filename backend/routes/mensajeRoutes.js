import express from "express";
import {
  obtenerConversaciones,
  obtenerMensajes,
  enviarMensaje,
} from "../controllers/mensajeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/conversaciones", obtenerConversaciones);
router.get("/:amigoId", obtenerMensajes);
router.post("/:amigoId", enviarMensaje);

export default router;