// services/candidateService.ts
import Candidates from '../models/candidates';
import mongoose from 'mongoose';

export const createCandidate = async (data: any) => {
  const newCandidate = new Candidates(data);
  return await newCandidate.save();
};

export const getAllCandidates = async () => {
  return await Candidates.find();
};

export const getCandidateByID = async (id: string) => {
  const questid = new mongoose.Types.ObjectId(id);
  return await Candidates.findById(questid);
};

export const updateCandidate = async (id: string, data: any) => {
  return await Candidates.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCandidate = async (id: string) => {
  return await Candidates.findByIdAndDelete(id);
};

export const patchCandidate = async (id : string, data: any) => {
  return await Candidates.findByIdAndUpdate(id, data, { new: true });
}
