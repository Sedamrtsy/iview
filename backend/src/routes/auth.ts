import express from "express";
import AuthController from "../controllers/authController";  // Varsayılan olarak ihraç edildiği için bu şekilde içe aktarılıyor

const router = express.Router();

// Giriş işlemi için rota
router.post('/login', AuthController.login);

export default router;
