import express from "express";
import { getMascotas, createMascota, updateMascota, deleteMascota } from "../controllers/mascotasController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // todas rutas requieren token

router.get("/", getMascotas); // listar mascotas del usuario
router.post("/", createMascota); // crear nueva mascota
router.put("/:id", updateMascota); // editar
router.delete("/:id", deleteMascota); // eliminar

export default router;