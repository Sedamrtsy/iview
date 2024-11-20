import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db';
import authRoute from './routes/auth';
import question from './routes/question';
import qpackage from './routes/package';
import interview from './routes/interview';
import candidates from './routes/candidates';
import videoRoutes from './routes/video';  // Video yükleme rotasını ekleyin
import logoutRoute from './routes/logout';

import { verifyToken } from './middleware/verifyToken';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000"; // .env'den frontend URL'yi al

// MongoDB bağlantısını yap
connectDB();

// Middleware'ler
// app.use(cors());
app.use(cors({
  origin: [frontendURL], // Ortam değişkeninden gelen URL'yi kullan
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Cookie veya token göndermek için gerekli
}));

app.use(cookieParser()); // Cookie işlemleri için
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Form verileri için

// API rotaları
app.use('/api', authRoute);


// Korunan bir rota örneği (token doğrulama ile erişim kontrolü)
app.get('/api/protected', verifyToken, (req: Request, res: Response) => {
  res.json({ message: 'Erişim başarılı', user: (req as any).user });
});
app.use('/api', question);
app.use('/api', qpackage);
app.use('/api', interview);
app.use('/api', candidates);
app.use('/api', videoRoutes);  // Video yükleme için eklenen yeni route
app.use("/api", logoutRoute);
app.use(express.urlencoded({ extended: true })); // Form verilerini işler
// 404 Hatası için varsayılan yanıt
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
