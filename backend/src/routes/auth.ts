import express from 'express';
import { login } from '../controllers/authController';
import { verifyToken } from '../middleware/verifyToken';

const router = express.Router();

router.post("/login",verifyToken, login);

export default router;