import { Request, Response } from "express";
import Usuario from "../models/Usuario";
import bcrypt from 'bcrypt';


export const PostUsuario = async(req: Request, res: Response) => {
    const {nome, email, telefone, senha} = req.body;
    console.log(`Recebendo os dados do Usuario ${req.body}`);

    if (!nome || !email || !telefone || !senha) {
        res.status(401).json({ error: 'Todos os campos são obrigatórios' });
        return; // Apenas sai da execução
    }

    try{

        // metodo de segurança para senhas. ao aplicar senhaHash, a senha que o usuario digitou aparecerar em formato de codigo.
        const salt = 10;
        const senhaHash = await bcrypt.hash(senha, salt);


        const NovoUsuario = await Usuario.CadastroUsuario({nome, email, telefone,  senha: senhaHash});

        if(NovoUsuario){
        res.status(201).json({message: 'Usuario criado com sucesso!', usuario: NovoUsuario});
    } else{ 

        res.status(400).json({message: 'Usuario não inserido...'})
    }

    } catch(error){
        console.error("Erro ao cadastrar usuário:", error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.log(`Error: ${error} ${errorMessage}`)
        res.status(500).json({messaege:`Email ja cadastrado!`});
    }
}

export const PostLoginUsuario = async (req: Request, res: Response): Promise<void> => { 
    try {
        const { email, senha } = req.body;

        // Validação do email e senha
        if (!email || !senha) {
            res.status(400).json({ message: 'Email e senha são obrigatórios' });
            return; // Impede a execução do restante do código
        }

        const usuario = await Usuario.LoginUsuario(String(email));

        console.log("Senha recebida no login:", senha);

        if (!usuario) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }

        // Verifica se a senha está correta
        const senhaCorreta =  await bcrypt.compare(senha, usuario.senha);
        console.log(senhaCorreta)

        console.log(`Senha armazenada no banco: ${usuario.senha}`);

        if (!senhaCorreta) {
            res.status(401).json({ message: 'Senha incorreta' });
            return;
        }

        res.json({ message: `Login realizado com sucesso!`, usuario });
    } catch (error) {
        res.status(500).json({ message: `Erro ao buscar usuário: ${error}` });
    }
};
export  const GetUsuarioByID = async (req: Request, res: Response) => {
    const id = parseInt((req).params.id, 10)

    try{
        const usuarioID = await Usuario.BuscarUsuarioID(Number(id));
        if (usuarioID){
            res.status(201).json({usuarioID});
        } else {
            res.status(404).json({ message: 'usuario não encontrado'})
        }
    }catch (error){
        res.status(500).json({ message: `Erro ao buscar o usuario ${error}`})
    }
}


