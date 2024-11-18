import { Schema, model, Document } from 'mongoose';

// Question arayüzü
export interface IQuestion extends Document {
  question: string;
  timer: string;
}

// Question şeması
const questionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  timer: { type: String, required: true },
});

const Question = model<IQuestion>('Question', questionSchema);

export default Question
