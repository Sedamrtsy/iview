// services/packageService.ts
import Package from '../models/package';

export const createPackage = async (data: any) => {
  const newPackage = new Package(data);
  return await newPackage.save();
};

export const getAllPackages = async () => {
  return await Package.find();
};

export const getPackageByID = async (id: string) => {
  return await Package.findById(id);
};

export const updatePackage = async (id: string, data: any) => {
  return await Package.findByIdAndUpdate(id, data, { new: true });
};

export const deletePackage = async (id: string) => {
  return await Package.findByIdAndDelete(id);
};

export const patchPackage = async (id:string, data :any) => {
  return await Package.findByIdAndUpdate(id, data);
}
