import express, { Application, NextFunction, Request, Response } from "express";
import { ENV } from "./config/env";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "./utils/logger";
import { notFound } from "./utils/not-found";
import router from "./routes";

const PORT = ENV.PORT;

const app: Application = express();

// Middlewares
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            return callback(null, origin);
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

//route entry point
app.use('/api/v1', router)

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    logger.error(err);
    res.status(err.status || 500).json(err);
});

//handle not found
app.use(notFound)

//app listening
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));