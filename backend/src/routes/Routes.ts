import Express from 'express';
import { PostUsuario, PostLoginUsuario } from '../controllers/UsuariosControllers';
import  {PostLoginProfissional, PostRegisterProfissional} from "../controllers/ProfissionaisControllers";

const router = Express.Router();

//Rotas para Usuario
router.post('/register', PostUsuario);
router.post('/login', PostLoginUsuario);

//Rota para Profissional
router.post('/registe_work', PostRegisterProfissional);
router.post('/login_work', PostLoginProfissional);

export default router;