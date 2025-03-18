import Express from 'express';
import { PostUsuario, PostLoginUsuario, GetUsuarioByID, SetUsuarioByID, SetUsuarioSenha } from '../controllers/UsuariosControllers';
import  {PostLoginProfissional, PostRegisterProfissional} from "../controllers/ProfissionaisControllers";

const router = Express.Router();

//Rotas para Usuario
router.post('/usuario/register', PostUsuario);
router.post('/usuario/login', PostLoginUsuario);
router.get('/usuario/searchID/:id', GetUsuarioByID);
router.put('/usuario/:id', SetUsuarioByID);
router.put('/usuario/:email', SetUsuarioSenha);

//Rota para Profissional
router.post('/profissional/register', PostRegisterProfissional);
router.post('/profissional/login', PostLoginProfissional);

export default router;