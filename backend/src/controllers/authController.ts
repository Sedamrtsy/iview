import { Request, Response } from "express";
import * as authService from "../services/auth";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Kullanıcıyı doğrula
    const isAuthenticated = authService.authenticateUser(email, password);
    if (!isAuthenticated) {
      res.status(401).json({ msg: "Invalid credentials" });
      return;
    }

    // Token oluştur
    const token = authService.generateToken(email);

    // Token'ı cookie olarak set et
    res.cookie("token", token, {
      httpOnly: true, // JavaScript ile erişim engellenir
      secure: process.env.NODE_ENV === "production", // HTTPS gerektirir (production için)
      sameSite: "strict", // CSRF koruması için sıkı mod
      maxAge: 60 * 60 * 1000, // 1 saat geçerlilik süresi
    });

    res.status(200).json({
      msg: "Login successful",
      user: { email },
      token, // Yanıta token'i de ekle
    });
  } catch (error) {
    console.error("Login işlemi sırasında bir hata oluştu:", error);
    if (error instanceof Error) {
      res.status(500).json({ msg: "Server error", error: error.message });
    } else {
      res.status(500).json({ msg: "Bilinmeyen bir hata oluştu" });
    }
  }
};