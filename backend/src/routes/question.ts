import express from "express";
import {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  getQuestionsByID,
  patchQuestion,
} from "../controllers/question";
import { verifyToken } from "../middleware/verifyToken"; // JWT doğrulama middleware

const router = express.Router();

router.post("/createquestion", createQuestion); // JWT doğrulaması ile soru oluşturma
router.get("/getquestion", getQuestions); // JWT doğrulaması ile tüm soruları listeleme
router.get("/getquestionbyid/:id", getQuestionsByID);
router.put("/updatequestion/:id", updateQuestion); // JWT doğrulaması ile soru güncelleme
router.delete("/deletequestion/:id", deleteQuestion); // JWT doğrulaması ile soru silme
router.patch("/patchquestion/:id", patchQuestion);

export default router;