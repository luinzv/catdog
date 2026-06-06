import express from "express";
import { getMascotas, createMascota, updateMascota, deleteMascota, getMascotaById } from "../controllers/mascotasController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); 

router.get("/", getMascotas); 
router.post("/", createMascota); 
router.put("/:id", updateMascota);
router.delete("/:id", deleteMascota); 
router.get("/:id", getMascotaById);
export default router;