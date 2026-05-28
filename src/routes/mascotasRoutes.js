import express from "express";
import { getMascotas, createMascota, updateMascota, deleteMascota } from "../controllers/mascotasController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); 

router.get("/", getMascotas); 
router.post("/", createMascota); 
router.put("/:id", updateMascota);
router.delete("/:id", deleteMascota); 

export default router;