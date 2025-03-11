import Express from 'express';
import { PostUsuario } from '../controllers/UsuariosControllers';
const router = Express.Router();

//Rotas para Usuario
router.post('/login', PostUsuario);

export default router;