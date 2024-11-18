import { Schema, model, Document } from 'mongoose'; 

// IInterview arayüzü
export interface IInterview extends Document {
  title_name: string;
  package:string;
  question: string[]; // Sorular dizisi
  candidates: string[]; // Adaylar dizisi
  can_skip: boolean;
  showing: boolean;
  activate: boolean;
}

// Interview şeması
const interviewSchema = new Schema<IInterview>({
  title_name: { type: String, required: true },
  package:{type:String, required:false},
  question: { type: [String], required: true }, // Sorular dizisi
  candidates: { type: [String], required: true }, // Adayların dizisi
  can_skip: { type: Boolean, required: true, default: false }, // Sorunun atlanabilir olup olmadığı
  showing: { type: Boolean, required: true, default: true }, // Sorunun gösterilip gösterilmediği
  activate: { type: Boolean, required: true, default: true }, // Aktif olup olmadığını belirten alan
}, {
  timestamps: true, // createdAt ve updatedAt alanları otomatik olarak eklenecek
});

const Interview = model<IInterview>('Interview', interviewSchema);

export default Interview
