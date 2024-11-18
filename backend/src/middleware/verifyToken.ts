import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>" formatında geliyor olabilir.

  if (!token) {
    res.status(401).json({ message: 'Erişim izni yok, token eksik' });
    return; // Burada işlem biter, next() çağrılmıyor
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'defaultSecretKey'; // .env dosyasındaki secret key
    const decoded = jwt.verify(token, secretKey);
    
    // Kullanıcı verilerini isteğe ekliyoruz
    (req as any).user = decoded;

    next(); // Kimlik doğrulaması başarılı, bir sonraki middleware'e geç
  } catch (error) {
    res.status(401).json({ message: 'Token geçersiz', error });
    return; // Token geçersiz olduğunda işlem bitmeli, next() çağrılmıyor
  }
};
