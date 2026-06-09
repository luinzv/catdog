import express from "express";

import { registrarUsuario, login, actualizarPerfil} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const verificarToken = authMiddleware;
const router = express.Router();

router.post("/register", registrarUsuario);
router.post("/login", login);
router.put("/perfil", verificarToken, actualizarPerfil);
export default router