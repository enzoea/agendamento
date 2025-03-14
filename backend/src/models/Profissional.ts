import {promisePool} from '../BancoDados';
import msql2 from "mysql2";


interface IProfissional {
    id?: number,
    nome: string,
    email: string,
    senha: string,
    telefone: string,
    especialidade: string;

}

export default class Profissional {
    static async CriandoProfissional(profissional: IProfissional): Promise<IProfissional> {

        const [rows] = await promisePool.execute('INSERT INTO profissional(nome, email, senha, telefone, especialidade) VALUES( ?, ?, ?, ?, ?)',
        [profissional.nome, profissional.email, profissional.senha, profissional.telefone, profissional.especialidade]);
        console.log(`Usuario inserido ${rows}`);

        return{...profissional, id:(rows as msql2.ResultSetHeader).insertId}

    };

    static async LoginProfissional(email: string): Promise<IProfissional | null> {
        if(!email) return null;
        console.log(`Buscando usuario pelo email: ${email}`);

        const [rows] = await promisePool.execute('SELECT * FROM profissional WHERE email = ?', [email]);

        const profissional = (rows as IProfissional[])[0];
        return profissional || null;
    }
}