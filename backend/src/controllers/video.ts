import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { s3Client } from '../config/s3Client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Candidates from '../models/candidates';

dotenv.config(); // .env dosyasını yükle

// Presigned URL oluşturma fonksiyonu
export const generatePresignedUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { fileName, fileType, email } = req.query as {
      fileName: string;
      fileType: string;
      email: string;
    };

    // Gerekli parametrelerin olup olmadığını kontrol et
    if (!fileName || !fileType || !email) {
      res.status(400).json({ error: 'fileName, fileType ve email gereklidir.' });
      return;
    }

    // S3 için yükleme parametrelerini hazırla
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME, // Bucket adı
      Key: `videos/${Date.now()}_${fileName}`, // Dosya adı ve yolu
      ContentType: fileType, // MIME türü (örneğin: 'video/mp4')
    };

    // Presigned URL oluştur
    const command = new PutObjectCommand(params);
    const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    // Video URL'sini oluştur
    const videoURL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

    // Veritabanında adayı güncelle
    const candidate = await Candidates.findOneAndUpdate(
      { email },
      { video_url: videoURL },
      { new: true }
    );

    // Aday bulunamazsa 404 döndür
    if (!candidate) {
      res.status(404).json({ error: 'Aday bulunamadı.' });
      return;
    }

    // Presigned URL'yi ve güncellenmiş aday bilgisini döndür
    res.status(200).json({ uploadURL, videoURL, candidate });
  } catch (error) {
    console.error('Presigned URL oluşturulurken hata:', error);
    res.status(500).json({ error: 'Presigned URL oluşturulurken bir hata oluştu.' });
  }
};
