// services/questionService.ts
import Question from '../models/question';

export const createQuestion = async (data: any) => {
  const newQuestion = new Question(data);
  return await newQuestion.save();
};

export const getAllQuestions = async () => {
  return await Question.find();
};

export const getQuestionByID = async (id: string) => {
  return await Question.findById(id);
};

export const updateQuestion = async (id: string, data: any) => {
  return await Question.findByIdAndUpdate(id, data, { new: true });
};

export const deleteQuestion = async (id: string) => {
  return await Question.findByIdAndDelete(id);
};

export const patchQuestion = async (id : string, data : any) => {
  return await Question.findByIdAndUpdate(id, data);
}
