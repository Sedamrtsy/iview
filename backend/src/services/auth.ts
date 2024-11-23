// // services/authService.ts
// import jwt from "jsonwebtoken";

// export const authenticateUser = (email: string, password: string): boolean => {
//   const envEmail = process.env.USER_EMAIL;
//   const envPassword = process.env.USER_PASSWORD;

//   if (email !== envEmail || password !== envPassword) {
//     return false;
//   }

//   return true;
// };

// export const generateToken = (email: string): string => {
//   const jwtSecret = process.env.JWT_SECRET as string;
//   return jwt.sign({ email }, jwtSecret, { expiresIn: "1h" });
// };
// services/authService.ts
import jwt from "jsonwebtoken";

export const authenticateUser = (email: string, password: string): boolean => {
  const envEmail = process.env.USER_EMAIL;
  const envPassword = process.env.USER_PASSWORD;

  if (email !== envEmail || password !== envPassword) {
    return false;
  }

  return true;
};

export const generateToken = (email: string): string => {
  const jwtSecret = process.env.JWT_SECRET as string;
  return jwt.sign({ email }, jwtSecret, { expiresIn: "1h" });
};