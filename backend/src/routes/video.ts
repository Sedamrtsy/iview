import express from 'express';
import multer from 'multer';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import Candidates from '../models/candidates'; // Candidates modelini dahil edin

dotenv.config();
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage});

// AWS S3 yapılandırması
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
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
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      const response = await s3Client.send(command);
      console.log('AWS S3 Upload Response:', response);

      // Video URL'sini oluştur
      const videoURL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

      // Video URL'sini MongoDB'ye kaydet
      const candidate = await Candidates.findOneAndUpdate(
        { email }, // Email'e göre adayı bul
        { video_url: fileName }, // `video_url` alanını güncelle
        { new: true, useFindAndModify: false } // Güncellenmiş veriyi döndür
      );
      console.log('MongoDB Candidate Update Response:', candidate);

      if (!candidate) {
        res.status(404).json({ error: 'Aday bulunamadı.' });
      } else {
        // Başarılı yanıt döndür
        res.status(200).json({
          message: `Video Yüklendi! URL: ${videoURL}`,
          url: videoURL, // Yüklenen dosyanın URL'si
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