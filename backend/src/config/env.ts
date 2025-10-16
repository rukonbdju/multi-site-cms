import dotenv from "dotenv";
dotenv.config();

const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) throw new Error(`Missing environment variable: ${key}`);
    return value;
};

export const ENV = {
    NODE_ENV: getEnv("NODE_ENV"),
    PORT: parseInt(getEnv("PORT")),
    JWT_SECRET: getEnv("JWT_SECRET"),
    JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN"),
    DB_HOST: getEnv("DB_HOST"),
    DB_PORT: parseInt(getEnv("DB_PORT")),
    DB_USER: getEnv("DB_USER"),
    DB_PASSWORD: getEnv("DB_PASSWORD"),
    DB_NAME: getEnv("DB_NAME")
};