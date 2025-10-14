import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { AuthService } from "../modules/auth/auth.service";
import { JWTPayload } from "../modules/auth/auth.types";
export interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });

    try {
        const decoded = AuthService.verifyAccessToken(token) as JWTPayload;
        req.userId = decoded.userId;
        next();
    } catch (err) {
        logger.error("JWT token invalid of expired!", err)
        next(err)
    }
};