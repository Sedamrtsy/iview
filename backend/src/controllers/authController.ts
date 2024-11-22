import { Request, Response } from "express";
import AuthService from "../services/auth"; // Default olarak AuthService import ediliyor
import jwt from "jsonwebtoken";

export class AuthController {
  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const authenticated = await AuthService.authenticate(email, password);

      if (!authenticated) {
        res.status(401).json({ message: "Login failed" });
        return;
      }

      // Kullanıcı doğrulandıktan sonra JWT token oluştur
      const accessToken = AuthService.generateToken(email); // `AuthService.generateToken` kullanıyoruz.

      const refreshToken = jwt.sign(
        { email },
        process.env.JWT_REFRESH_SECRET_KEY || "defaultRefreshSecretKey",
        { expiresIn: "1d" }
      );

      // Refresh token ve access token çerezlerde saklanıyor
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 gün geçerlilik süresi
      });

      res.cookie("jwtToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 30 * 1000, // 30 saniye geçerlilik süresi
      });

      res.status(200).json({ message: "Logged in" });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // HandleRefreshToken ve logout metodları da aynen devam edebilir...
}
