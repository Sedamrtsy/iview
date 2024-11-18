import { Schema, model, Document } from 'mongoose';                                                                                                                                                                                                                                                             

export interface ICandidates extends Document {
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    interview : string;
    note: string;
    status: string;
    video_url: string;
    activate: boolean;
  }

const candidatesSchema = new Schema<ICandidates>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Email'in benzersiz olması önemli
  phone_number: { type: String, required: true, unique:true },
  interview : {type: String, required: true},
  note: { type: String, default: '' },  // Not alanı boş olabilir
  status: { type: String,  default: 'pending' }, // Durum değerleri sabit olabilir
  video_url: { type: String},
  activate: { type: Boolean, default: true }, // Aktif olup olmadığını belirten alan
}, {
  timestamps: true,  // createdAt ve updatedAt alanlarını otomatik ekler
});

// Modeli dışa aktar
const Candidates = model<ICandidates>('Candidates', candidatesSchema);

export default Candidates;