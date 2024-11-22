import express from "express";
import {
  createInterview,
  getInterviews,
  updateInterviews,
  deleteInterviews,
  getinterviewByID,
  patchInterview,
} from "../controllers/interview";
import { jwtAuthMiddleware } from "../middleware/verifyToken"; // JWT doğrulama middleware

const router = express.Router();

router.post("/createinterview", jwtAuthMiddleware, createInterview); // JWT doğrulaması ile mülakat oluşturma
router.get("/getinterview", jwtAuthMiddleware, getInterviews); // JWT doğrulaması ile mülakatları listeleme
router.get("/getinterviewbyid/:id", jwtAuthMiddleware, getinterviewByID);
router.put("/updateinterview/:id", jwtAuthMiddleware, updateInterviews); // Mülakat güncelleme
router.delete("/deleteinterview/:id", jwtAuthMiddleware, deleteInterviews); // Mülakat silme
router.patch("/patchinterview/:id", jwtAuthMiddleware, patchInterview);

export default router;
