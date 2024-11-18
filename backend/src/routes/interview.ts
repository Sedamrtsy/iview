import express from 'express';
import { createInterview, getInterviews, updateInterviews, deleteInterviews, getinterviewByID, patchInterview } from '../controllers/interview';
import { verifyToken } from '../middleware/verifyToken'; // JWT doğrulama middleware

const router = express.Router();

router.post('/creatinterview', verifyToken, createInterview); // JWT doğrulaması ile mülakat oluşturma
router.get('/getinterview',verifyToken, getInterviews); // Mülakatları listeleme
router.get('/getinterviewbyid/:id', getinterviewByID );
router.put('/updateinterview/:id', verifyToken, updateInterviews); // Mülakat güncelleme
router.delete('/deleteinterview/:id', verifyToken, deleteInterviews); // Mülakat silme
router.patch('/patchinterview/:id', patchInterview);

export default router;
