import Express from 'express';
import { PostUsuario, PostLoginUsuario, GetUsuarioByID } from '../controllers/UsuariosControllers';
import  {PostLoginProfissional, PostRegisterProfissional} from "../controllers/ProfissionaisControllers";

const router = Express.Router();

//Rotas para Usuario
router.post('/usuario/register', PostUsuario);
router.post('/usuario/login', PostLoginUsuario);
router.get('/usuario/searchID/:id', GetUsuarioByID);

//Rota para Profissional
router.post('/profissional/register', PostRegisterProfissional);
router.post('/profissional/login', PostLoginProfissional);

export default router;