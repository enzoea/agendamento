import {promisePool} from '../BancoDados';
import msql2 from "mysql2";
import mysql from "mysql2";

interface IProfissional {
    id?: number,
    nome: string,
    email: string,
    telefone: string,
    especialidade: string;
    cirado_em: string
}

export default class Profissional {
    static async CriandoProfissional(profissional: IProfissional): Promise<IProfissional> {

        const [rows] = await promisePool.execute('INSERT INTO profissionais(nome, email, telefone, especialidade, criado_em) VALUES(?, ?, ?, ?, ?)',
        [profissional.nome, profissional.email, profissional.telefone, profissional.especialidade, profissional.cirado_em]);
        console.log(`Usuario inserido ${rows}`);

        return{...profissional, id:(rows as msql2.ResultSetHeader).insertId}

    }
}