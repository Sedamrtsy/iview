// controllers/authController.ts
import { Request, Response } from "express";
import * as authService from "../services/auth";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const isAuthenticated = authService.authenticateUser(email, password);

    if (!isAuthenticated) {
      res.status(400).json({ msg: "Invalid credentials" });
      return;
    }

    const token = authService.generateToken(email);
    res.json({ token });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
    return;
  }
};
