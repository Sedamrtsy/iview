import { Request, Response } from "express";

export const logout = (req: Request, res: Response): void => {
  try {
    // Token'ı temizlemek için maxAge'yi geçmiş bir tarih yaparak siliyoruz
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ msg: "Logout successful" });
  } catch (error) {
    console.error("Logout işlemi sırasında bir hata oluştu:", error);
    if (error instanceof Error) {
      res.status(500).json({ msg: "Server error", error: error.message });
    } else {
      res.status(500).json({ msg: "Bilinmeyen bir hata oluştu" });
    }
  }
};