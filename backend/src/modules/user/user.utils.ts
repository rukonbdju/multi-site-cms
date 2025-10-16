import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWTPayload } from "./user.types";
import { parseDuration } from "../../utils/parse-duration";
import { ENV } from "../../config/env";

export const generateToken = (payload: JWTPayload) => {
    console.log(payload)
    const accessToken = jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn: parseDuration(ENV.JWT_EXPIRES_IN),
    });
    return accessToken;
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, ENV.JWT_SECRET);
}

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};