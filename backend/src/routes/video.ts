import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import Candidates from '../models/candidates'; // Candidates modelini dahil edin

dotenv.config();

const router = express.Router();
const upload = multer();

// AWS S3 yapılandırması
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

router.post('/upload', upload.single('video'), async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file as Express.Multer.File;
    const { email } = req.body;

    console.log('Gelen req.body:', req.body);
    console.log('Gelen req.file:', req.file);

    // Email ve dosya kontrolü yap
    if (!file) {
      res.status(400).json({ error: 'Video dosyası gereklidir.' });
    } else if (!email) {
      res.status(400).json({ error: 'Email gereklidir.' });
    } else {
      const videoBuffer = file.buffer;
      const fileName = `videos/${Date.now()}_${file.originalname}`;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName,
        Body: videoBuffer,
        ContentType: file.mimetype,
      };

      // S3'e yükleme yap
      const uploadResult = await s3.upload(params).promise();

      // Video URL'sini MongoDB'ye kaydet
      const candidate = await Candidates.findOneAndUpdate(
        { email }, // Email'e göre adayı bul
        { video_url: fileName }, // `video_url` alanını güncelle
        { new: true, useFindAndModify: false } // Güncellenmiş veriyi döndür
      );

      if (!candidate) {
        res.status(404).json({ error: 'Aday bulunamadı.' });
      } else {
        // Başarılı yanıt döndür
        res.status(200).json({
          message: 'Video başarıyla yüklendi ve aday kaydı güncellendi.',
          url: uploadResult.Location,
          candidate,
        });
      }
    }
  } catch (error) {
    console.error('Video yükleme hatası:', error);
    res.status(500).json({ error: 'Video yükleme başarısız oldu.' });
  }
});


export default router;
