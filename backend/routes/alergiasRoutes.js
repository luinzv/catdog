import express from "express";
import {
  getAlergias,
  createAlergia,
  updateAlergia,
  deleteAlergia,
} from "../controllers/alergiasController.js";

const router = express.Router();

router.get("/:mascotaId", getAlergias);

router.post("/:mascotaId", createAlergia);

router.put("/:id", updateAlergia);

router.delete("/:id", deleteAlergia);

export default router;