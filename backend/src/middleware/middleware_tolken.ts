/*import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extrai o token

  if (!token) {
    res.status(403).json({ error: 'Token não fornecido' });  // Envia erro diretamente
    return; // Finaliza o middleware
  }

  try {
    // Verifica o token usando a chave secreta
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'defaultSecretKey');
    
    // Decodificando o token e atribuindo o userId no req
    req.userId = (decoded as { userId: number }).userId;
    
    // Passa para o próximo middleware ou rota
    next();
  } catch (err) {
    // Se ocorrer erro com o token, envia erro e finaliza a execução
    res.status(401).json({ error: 'Token inválido ou expirado' }); // Envia erro diretamente
    return; // Finaliza o middleware
  }
};

export default verifyToken;
*/