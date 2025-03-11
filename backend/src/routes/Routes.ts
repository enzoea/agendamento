import Express from 'express';
import { PostUsuario, PostLoginUsuario } from '../controllers/UsuariosControllers';
const router = Express.Router();

//Rotas para Usuario
router.post('/register', PostUsuario);
router.post('/login', PostLoginUsuario)

export default router;