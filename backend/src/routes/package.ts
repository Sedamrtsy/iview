import express from 'express';
import { createPackage, getPackages, updatePackage, deletePackage,getPackageByID,patchPackage } from '../controllers/package';
import { verifyToken } from '../middleware/verifyToken'; // JWT doğrulama middleware

const router = express.Router();

router.post('/createpackage', createPackage); // JWT doğrulaması ile soru paketi oluşturma
router.get('/getpackage', getPackages); // JWT doğrulaması ile tüm soru paketlerini listeleme
router.get('/getpackagebyid/:id', getPackageByID);
router.put('/updatepackage/:id', updatePackage); // JWT doğrulaması ile soru paketini güncelleme
router.delete('/deletepackage/:id', deletePackage); // JWT doğrulaması ile soru paketini silme
router.patch('/patchpackage/:id', patchPackage);

export default router;