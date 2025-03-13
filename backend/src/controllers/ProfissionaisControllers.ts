import  {Request, Response} from "express";
import Profissional from "../models/Profissional";
import bcrypt from 'bcrypt';

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

        // Validação do email e senha
        if (!email || !senha) {
            res.status(400).json({ message: 'Email e senha são obrigatórios' });
            return; // Impede a execução do restante do código
        }

        const profissional = await Profissional.LoginProfissional(String(email));

        console.log("Senha recebida no login:", senha);

        if (!profissional) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }

        // Verifica se a senha está correta
        const senhaCorreta =  await bcrypt.compare(senha, profissional.senha);
        console.log(senhaCorreta)

        console.log(`Senha armazenada no banco: ${profissional.senha}`);

        if (!senhaCorreta) {
            res.status(401).json({ message: 'Senha incorreta' });
            return;
        }

        res.json({ message: `Login realizado com sucesso!`, profissional });
    } catch (error) {
        res.status(500).json({ message: `Erro ao buscar usuário: ${error}` });
    }
};