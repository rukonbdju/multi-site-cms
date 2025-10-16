import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { JWTPayload } from "../modules/user/user.types";
import { verifyToken } from "../modules/user/user.utils";
export interface AuthRequest extends Request {
    userId?: number;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });

    try {
        const decoded = verifyToken(token) as JWTPayload;
        req.userId = decoded.userId;
        next();
    } catch (err) {
        logger.error("JWT token invalid or expired!", err)
        next(err)
    }
};