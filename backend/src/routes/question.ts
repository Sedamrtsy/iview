import express from "express";
import {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  getQuestionsByID,
  patchQuestion,
} from "../controllers/question";
import verifyToken from "../middleware/verifyToken"; // JWT doğrulama middleware

const router = express.Router();

router.post("/createquestion", verifyToken, createQuestion); // JWT doğrulaması ile soru oluşturma
router.get("/getquestion", verifyToken, getQuestions); // JWT doğrulaması ile tüm soruları listeleme
router.get("/getquestionbyid/:id", getQuestionsByID);
router.put("/updatequestion/:id", verifyToken, updateQuestion); // JWT doğrulaması ile soru güncelleme
router.delete("/deletequestion/:id", verifyToken, deleteQuestion); // JWT doğrulaması ile soru silme
router.patch("/patchquestion/:id", verifyToken, patchQuestion);

export default router;
