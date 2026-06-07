// routes/historialRoutes.js
import express from "express";
import { getVacunas, createVacuna, updateVacuna, deleteVacuna } from "../controllers/vacunasController.js";
import { getAlergias, createAlergia, updateAlergia, deleteAlergia } from "../controllers/alergiasController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); 

router.get("/vacunas/:mascotaId", getVacunas);
router.post("/vacunas/:mascotaId", createVacuna);
router.put("/vacunas/:id", updateVacuna);
router.delete("/vacunas/:id", deleteVacuna);

router.get("/alergias/:mascotaId", getAlergias);
router.post("/alergias/:mascotaId", createAlergia);
router.put("/alergias/:id", updateAlergia);
router.delete("/alergias/:id", deleteAlergia);

export default router;