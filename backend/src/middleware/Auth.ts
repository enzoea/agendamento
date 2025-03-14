import jwt from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";
import {decode} from "node:punycode";

const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret';

export  const VerificarToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer", "");

    if(!token) {
        res.status(401).json({message: 'Acesso negado. Token não fornecido'});
        return;
    }

    try{
        const decoded = jwt.verify(token, SECRET_KEY) as {id: number; email: string};
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido"})
    }
}