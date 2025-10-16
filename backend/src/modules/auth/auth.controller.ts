import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const AuthController = {
    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.body?.email
            const password = req.body?.password
            if (!email || !password) {
                return res.status(404).json({ success: false, message: 'Parameter missing' })
            }
            const { accessToken, refreshToken } = AuthService.generateToken({ userId: '1' })
            console.log({ accessToken, refreshToken })
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({ success: true, data: { name: 'Ada' } });
        } catch (err) {
            next(err);
        }
    },
    getMe: async (req: AuthRequest, res: Response) => {
        try {
            if (!req.userId) return res.status(401).json({ success: false, message: "Not authenticated" });
            res.json({ success: true, data: { user: 'Ada' } });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    },
    logout: async (req: Request, res: Response, next: NextFunction) => {
        res.cookie('accessToken', '', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.cookie('refreshToken', '', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ success: true, data: null });
    },
}
