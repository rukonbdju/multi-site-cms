import { Request, Response, NextFunction } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        error: "Not Found",
        message: `Route ${req.originalUrl} not found`
    });
};