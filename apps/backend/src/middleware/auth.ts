import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthedRequest extends Request {
  user?: { sub: string; role: string };
}

export function requireAuth(role?: string) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization?.split(" ")[1];
    if (!auth) return res.status(401).json({ error: "Missing token" });
    try {
      const payload: any = jwt.verify(auth, process.env.JWT_SECRET || "dev");
      req.user = payload;
      if (role && payload.role !== role && payload.role !== "ADMIN") {
        return res.status(403).json({ error: "Forbidden" });
      }
      return next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}
