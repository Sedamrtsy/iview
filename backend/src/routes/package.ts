import express from 'express';
import { createPackage, getPackages, updatePackage, deletePackage,getPackageByID,patchPackage } from '../controllers/package';
import { verifyToken } from '../middleware/verifyToken'; // JWT doğrulama middleware

const router = express.Router();

router.post('/createpackage', verifyToken, createPackage); // JWT doğrulaması ile soru paketi oluşturma
router.get('/getpackage', verifyToken, getPackages); // JWT doğrulaması ile tüm soru paketlerini listeleme
router.get('/getpackagebyid/:id', getPackageByID);
router.put('/updatepackage/:id', verifyToken, updatePackage); // JWT doğrulaması ile soru paketini güncelleme
router.delete('/deletepackage/:id', verifyToken, deletePackage); // JWT doğrulaması ile soru paketini silme
router.patch('/patchpackage/:id', verifyToken, patchPackage);

export default router;
