import Express from 'express';
import { PostUsuario, PostLoginUsuario, GetUsuarioByID } from '../controllers/UsuariosControllers';
import  {PostLoginProfissional, PostRegisterProfissional} from "../controllers/ProfissionaisControllers";

const router = Express.Router();

//Rotas para Usuario
router.post('/register/usuario', PostUsuario);
router.post('/login/usuario', PostLoginUsuario);
router.get('/searchID/:id/usuario', GetUsuarioByID);

//Rota para Profissional
router.post('/registe/profissional', PostRegisterProfissional);
router.post('/login/profissional', PostLoginProfissional);

export default router;