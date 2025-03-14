import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Carrega variáveis do .env

const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret"; // Fallback caso .env falhe

export const generateToken = (userId: number) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET não definido no .env");
    }

    const token = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET as string, // Força como string
        { expiresIn: "1h" }
    );

};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
};
