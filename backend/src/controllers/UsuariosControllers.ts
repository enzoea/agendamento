import { Request, Response } from "express";
import Usuario from "../models/Usuario";

export const PostUsuario = async(req: Request, res: Response) => {
    const {nome, email, senha} = req.body;
    console.log(`Recebendo os dados do Usuario ${req.body}`);

    if (!nome || !email || !senha) {
        res.status(401).json({ error: 'Todos os campos são obrigatórios' });
        return; // Apenas sai da execução
    }

    try{

        const NovoUsuario = await Usuario.CriandoUsuario({nome, email, senha});

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