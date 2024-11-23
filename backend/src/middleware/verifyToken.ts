// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
//   const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>" formatında geliyor olabilir.

//   if (!token) {
//     res.status(401).json({ message: 'Erişim izni yok, token eksik' });
//     return; // Burada işlem biter, next() çağrılmıyor
//   }

//   try {
//     const secretKey = process.env.JWT_SECRET || 'defaultSecretKey'; // .env dosyasındaki secret key
//     const decoded = jwt.verify(token, secretKey);
    
//     // Kullanıcı verilerini isteğe ekliyoruz
//     (req as any).user = decoded;

//     next(); // Kimlik doğrulaması başarılı, bir sonraki middleware'e geç
//   } catch (error) {
//     res.status(401).json({ message: 'Token geçersiz', error });
//     return; // Token geçersiz olduğunda işlem bitmeli, next() çağrılmıyor
//   }
// };
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Cookie'deki token'ı alıyoruz
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: 'Erişim izni yok, token eksik' });
      return;
    }

    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      res.status(500).json({ message: 'Sunucu yapılandırma hatası, secret key eksik' });
      return;
    }

    // Token doğrulama
    const decoded = jwt.verify(token, secretKey);

    // Kullanıcı verilerini req'e ekleme
    (req as any).user = decoded;

    next(); // Kimlik doğrulaması başarılı, bir sonraki middleware'e geç
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Token geçersiz', error: error.message });
    } else if (error instanceof Error) {
      res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    } else {
      res.status(500).json({ message: 'Bilinmeyen bir hata oluştu' });
    }
  }
};