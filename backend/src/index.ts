import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db';
import auth from './routes/auth';
import question from './routes/question';
import qpackage from './routes/package';
import interview from './routes/interview';
import candidates from './routes/candidates';
import videoRoutes from './routes/video';
import logoutRoute from './routes/logout';

import { verifyToken } from './middleware/verifyToken';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const frontendURL = process.env.FRONTEND_URL || "https://iview-teal.vercel.app"; // .env'den frontend URL'yi al

// MongoDB bağlantısını yap
connectDB();

// CORS Middleware'i
app.use(cors({
  origin: frontendURL, // İzin verilen frontend URL'si
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // İzin verilen HTTP metotları, 
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true, // Cookie veya token göndermek için gerekli
}));

// Preflight request'ler (OPTIONS) için CORS yanıtı
app.options('*', cors());

// Middleware'ler
app.use(cookieParser()); // Cookie işlemleri için
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Form verileri için

// API rotaları
//app.use('/api/auth', authRoute); // Kimlik doğrulama rotası
//app.use('/api/logout', logoutRoute); // Çıkış yapma rotası

// Aşağıdaki rotalar için JWT doğrulama kullanın
//app.use(verifyToken);
app.use('/api', auth);
app.use('/api', question);
app.use('/api', qpackage);
app.use('/api', interview);
app.use('/api', candidates);
app.use('/api', videoRoutes);  // Video yükleme için eklenen yeni rota
app.use("/api", logoutRoute);


// 404 Hatası için varsayılan yanıt
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
