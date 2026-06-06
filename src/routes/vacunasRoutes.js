import express from "express";
import {
  getVacunas,
  createVacuna,
  updateVacuna,
  deleteVacuna,
} from "../controllers/vacunasController.js";

const router = express.Router();

router.get("/:mascotaId", getVacunas);

router.post("/:mascotaId", createVacuna);

router.put("/:id", updateVacuna);

router.delete("/:id", deleteVacuna);

export default router;