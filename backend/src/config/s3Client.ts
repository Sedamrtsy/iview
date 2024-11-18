import { S3Client } from '@aws-sdk/client-s3';

import dotenv from 'dotenv';

dotenv.config(); // .env dosyasını yükle

// S3 Client'ı yapılandırın
export const s3Client = new S3Client({
  region: process.env.AWS_REGION, // AWS bölgesi ('eu-north-1')
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string, // AWS Access Key ID
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string, // AWS Secret Access Key
  },
});
