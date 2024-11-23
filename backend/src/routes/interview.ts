import express from 'express';
import { createInterview, getInterviews, updateInterviews, deleteInterviews, getinterviewByID, patchInterview } from '../controllers/interview';
import { verifyToken } from '../middleware/verifyToken'; // JWT doğrulama middleware

const router = express.Router();

router.post('/creatinterview', createInterview); // JWT doğrulaması ile mülakat oluşturma
router.get('/getinterview', getInterviews); // Mülakatları listeleme
router.get('/getinterviewbyid/:id', getinterviewByID );
router.put('/updateinterview/:id', updateInterviews); // Mülakat güncelleme
router.delete('/deleteinterview/:id', deleteInterviews); // Mülakat silme
router.patch('/patchinterview/:id', patchInterview);

export default router;