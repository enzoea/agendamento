import { Request, Response } from "express";
import Usuario from "../models/Usuario";
import bcrypt from 'bcrypt';


export const PostUsuario = async(req: Request, res: Response) => {
    const {nome, email, senha} = req.body;
    console.log(`Recebendo os dados do Usuario ${req.body}`);

    if (!nome || !email || !senha) {
        res.status(401).json({ error: 'Todos os campos são obrigatórios' });
        return; // Apenas sai da execução
    }

    try{

        const NovoUsuario = await Usuario.CadastroUsuario({nome, email, senha});

        if(NovoUsuario){
        res.status(201).json({message: 'Usuario criado com sucesso!', usuario: NovoUsuario});
    } else{ 

        res.status(400).json({message: 'Usuario não inserido...'})
    }

    } catch(error){
        console.error("Erro ao cadastrar usuário:", error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        res.status(500).json({messaege:`Erro de cadastro do Usuario ${error} ${errorMessage}`});
    }
}

export const PostLoginUsuario = async (req: Request, res: Response): Promise<void> => { 
    
    try {
        const {email, senha} = req.body;
        // validação do email e senha
        if(!email || !senha){
            res.status(400).json({ message: 'Email e senha são obrigatórios'})
        }

    
            const usuario = await Usuario.LoginUsuario(String(email));

            if(!usuario){
                 res.status(404).json({ message: 'Usuario não encontrado'})
            } 
            //validação de senha: se a senha esta a mesma do banco
            const senhaCorreta = usuario?.senha ? await bcrypt.compare(senha, usuario.senha) : false;

            if(!senhaCorreta) {
                 res.status(401).json({message: 'senha incorreta'})
            }

            res.json({message: `Login realizado com sucesso! ${usuario}`})

    } catch(error){
        res.status(500).json({ message:`Erro ao buscar Usuario ${error}`});
    }
};

