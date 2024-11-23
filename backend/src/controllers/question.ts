// controllers/questionController.ts
import { Request, Response } from "express";
import * as questionService from "../services/question";

export const createQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newQuestion = await questionService.createQuestion(req.body);
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: "Soru oluşturulurken hata oluştu", error });
  }
};

export const getQuestionsByID = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const question = await questionService.getQuestionByID(id);
    if (!question) {
      res.status(404).json({ message: "Soru bulunamadı" });
      return;
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: "Soru getirilirken hata oluştu", error });
  }
};

export const getQuestions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const questions = await questionService.getAllQuestions();
    if (!questions || questions.length === 0) {
      res.status(404).json({ message: "Soru bulunamadı" });
      return;
    }
    res.status(200).json(questions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Sorular getirilirken hata oluştu", error });
  }
};

export const updateQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedQuestion = await questionService.updateQuestion(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: "Soru güncellenirken hata oluştu", error });
  }
};

export const deleteQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await questionService.deleteQuestion(req.params.id);
    res.status(200).json({ message: "Soru başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Soru silinirken hata oluştu", error });
  }
};

export const patchQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedData = await questionService.patchQuestion(
      req.params.id,
      req.body
    );
    res.status(200).json(updateQuestion);
  } catch (error) {
    res.status(500).json({ message: "Soru güncellerken hata oluştu", error });
  }
};