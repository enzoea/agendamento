import  {Request, Response} from "express";
import Profissional from "../models/Profissional";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret";


export const PostRegisterProfissional = async  (req: Request, res: Response) => {
    const {nome, email, senha, telefone, especialidade} = req.body;
    console.log( `recebendo o dados do usuario: ${req.body}`);

    //condição de preencher todos os dados
    if(!nome || !email ||!senha || !telefone || !especialidade){
        res.status(401).json({ error: 'Todos os campos sao obrigatorios'});
        return;

    }

    try{
        const salt = 10;
        const senhaHash = await bcrypt.hash(senha, salt);

        const NovoProfissional = await Profissional.CriandoProfissional({nome, email, senha: senhaHash, telefone, especialidade});

        if(NovoProfissional) {
            res.status(201).json({message: 'Usuario criado com sucesso!', profissional: NovoProfissional})
        } else{res.status(400).json({message: 'Usuario não inserido...'})}
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.log(`Error: ${error} ${errorMessage}`)
        res.status(500).json({messaege:`Email ja cadastrado!`});
    }
};

export const PostLoginProfissional = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            res.status(400).json({ message: "Email e senha são obrigatórios" });
            return;
        }

        const profissional = await Profissional.LoginProfissional(email);
        if (!profissional) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }

        console.log(`Senha armazenada no banco: ${profissional.senha}`);

        const senhaCorreta = await bcrypt.compare(senha, profissional.senha);
        if (!senhaCorreta) {
            res.status(403).json({ message: "Senha incorreta" });
            return;
        }

        // Removendo a senha antes de enviar o profissional na resposta
        const { senha: _, ...profissionalSemSenha } = profissional;

        const token = jwt.sign({ id: profissional.id, email: profissional.email }, SECRET_KEY, {
            expiresIn: "1h"
        });

        res.json({ message: "Login realizado com sucesso!", token, profissional: profissionalSemSenha });
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ message: "Erro ao buscar usuário no banco de dados." });
    }
};