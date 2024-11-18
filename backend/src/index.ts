import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db';
import authRoute from './routes/auth';
import question from './routes/question';
import qpackage from './routes/package';
import interview from './routes/interview';
import candidates from './routes/candidates';
import videoRoutes from './routes/video';  // Video yükleme rotasını ekleyin

dotenv.config();

const app = express();
//const port = process.env.PORT || 3000;
const port = 3000;

// MongoDB bağlantısını yap
connectDB();

// Middleware'ler
app.use(cors());
app.use(express.json());

// API rotaları
app.use('/api', authRoute);
app.use('/api', question);
app.use('/api', qpackage);
app.use('/api', interview);
app.use('/api', candidates);
app.use('/api', videoRoutes);  // Video yükleme için eklenen yeni route
app.use(express.urlencoded({ extended: true })); // Form verilerini işler

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
