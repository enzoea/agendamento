import {promises} from 'dns';
import { promisePool } from '../BancoDados';
import msql2 from 'mysql2';

interface IUsuario {
    id?: number,
    nome: string,
    email: string,
    senha: string
}
// Essa classe esta utilizando o metodos estaticos para interagir com a tabela do Banco de DAdos
//Criei para facil visualização
export default class Usuario {

    
    static async criandoUsuario(usuario: IUsuario):Promise<IUsuario> {
        const [rows] = await promisePool.execute('INSERT INTO usuarios (nome, email, senha) VALUES(?, ?, ?)',
            [usuario.nome, usuario.email, usuario.senha]
        ); console.log(`Usuario foi inserido ${rows}`);

        return{...usuario, id:(rows as msql2.ResultSetHeader).insertId}
    } 
}