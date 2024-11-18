
import { Schema, model, Document } from 'mongoose';

// Question arayüzü
export interface IPackage extends Document {
  name: string;
  question: string[];
 
}

// Question şeması
const packageSchema = new Schema<IPackage>({
  name: { type: String, required: true },
  question: { type: [String], required: true }, // Sorular dizisi
});

const Package = model<IPackage>('Package', packageSchema);

export default Package