import jwt from 'jsonwebtoken';

class AuthService {
  public static generateToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });
  }

  public static authenticate(email: string, password: string): boolean {
    // Kullanıcı doğrulama işlemleri yapılmalı, burada bir örnek olarak sabit bir kontrol ekledik.
    return email === process.env.USER_EMAIL && password === process.env.USER_PASSWORD;
  }
}

export default AuthService;
