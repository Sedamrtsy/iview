import { Request, Response } from 'express';
import Package from '../models/package';
import mongoose from 'mongoose';
import * as packageServices from "../services/package";

// Soru Paketi Oluşturma (Create)
export const createPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    await packageServices.createPackage(req.body);
    res.status(201).json({message : "Paket oluşturuldu"});
  } catch (error) {
    res.status(500).json({ message: 'Soru paketi oluşturulurken hata oluştu', error });
  }
};

// Tüm Soru Paketlerini Listeleme (Read)
export const getPackages = async (req: Request, res: Response): Promise<void> => {
  try {
    const packages = await packageServices.getAllPackages();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Soru paketleri getirilirken hata oluştu', error });
  }
};

export const getPackageByID = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const pack = await packageServices.getPackageByID(id);
    res.status(200).json(pack);
  } catch (error) {
    res.status(500).json({ message: 'Soru paketi getirilirken hata oluştu', error });
  }
};

// Belirli Bir Soru Paketini Güncelleme (Update)
export const updatePackage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const updatedPackage = await packageServices.updatePackage(id, req.body);
    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ message: 'Soru paketi güncellenirken hata oluştu', error });
  }
};

// Soru Paketi Silme (Delete)
export const deletePackage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await packageServices.deletePackage(id);
    res.status(200).json({ message: 'Soru paketi başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Soru paketi silinirken hata oluştu', error });
  }
};

export const patchPackage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const patchedPackage = await packageServices.patchPackage(id, req.body);
    res.status(200).json(patchedPackage);
  } catch (error) {
    res.status(500).json({ message: 'Soru paketi güncellenirken hata oluştu', error });
  }
};