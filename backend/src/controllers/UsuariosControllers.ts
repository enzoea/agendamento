import { Request, Response } from "express";
import Usuario from "../models/Usuario";

export const PostUsuario = async(req: Request, res: Response) => {
    const {nome, email, senha} = req.body;
    console.log(`Recebendo os dados do Usuario ${req.body}`);

    try{

        const NovoUsuario = await Usuario.CriandoUsuario({nome, email, senha});

        if(NovoUsuario){
        res.status(201).json({message: 'Usuario criado com sucesso!', usuario: NovoUsuario});
    } else{ 

        res.status(400).json({message: 'Usuario não inserido...'})
    }

    } catch(error){
        
        res.status(500).json({messaege:`Erro de cadastro do Usuario ${error}`});
    }
}