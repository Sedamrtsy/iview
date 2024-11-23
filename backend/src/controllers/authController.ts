import { Request, Response } from "express";
import AuthService from '../services/auth';
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

      // Kullanıcı doğrulandıktan sonra JWT access ve refresh token oluştur
      const accessToken = jwt.sign(
        { email },
        process.env.JWT_SECRET || "defaultSecretKey",
        { expiresIn: "15m" } // Access token 15 dakika geçerli
      );

      const refreshToken = jwt.sign(
        { email },
        process.env.JWT_REFRESH_SECRET_KEY || "defaultRefreshSecretKey",
        { expiresIn: "1d" } // Refresh token 1 gün geçerli
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
        maxAge: 15 * 60 * 1000, // 15 dakika geçerlilik süresi
      });

      res.status(200).json({ message: "Logged in" });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async handleRefreshToken(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const cookies = req.cookies;

      if (!cookies?.jwt) {
        res.status(401).json({ message: "No refresh token provided" });
        return;
      }

      const refreshToken = cookies.jwt;

      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY || "defaultRefreshSecretKey",
        (err: jwt.VerifyErrors | null, decoded: any) => {
          if (err || !decoded.email) {
            return res.status(401).json({ message: "Unauthorized" });
          }

          // Yeni access token oluştur
          const newAccessToken = jwt.sign(
            { email: decoded.email },
            process.env.JWT_SECRET || "defaultSecretKey",
            { expiresIn: "15m" }
          );

          // Yeni access token çerezde saklanır
          res.cookie("jwtToken", newAccessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 dakika geçerlilik süresi
          });

          res.json({ message: "Token refreshed" });
        }
      );
    } catch (error) {
      console.error("Error during refresh token:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async logout(req: Request, res: Response): Promise<void> {
    try {
      const cookies = req.cookies;

      if (!cookies?.jwt) {
        res.status(401).json({ message: "No token to clear" });
        return;
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "strict",
      });

      res.clearCookie("jwtToken", {
        httpOnly: true,
        sameSite: "strict",
      });

      res.status(200).json({ message: "Logged out" });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default AuthController;
