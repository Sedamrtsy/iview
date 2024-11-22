// middleware/verifyToken.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'No authorization header' });
    return;
  }

  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) {
    res.status(401).json({ message: 'Invalid authorization format' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'defaultSecretKey');
    (req as any).user = decoded; // decoded veriyi istek nesnesine ekleyin
    next(); // Bir sonraki middleware'e geç
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default verifyToken;
