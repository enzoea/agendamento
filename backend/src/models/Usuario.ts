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
    
    //nesse metodo estatico, Cria um novo usuário no banco de dados. Ele recebe um objeto user do tipo IUser,
    //executa uma query INSERT para adicionar os dados à tabela users e retorna
    // o usuário com o id gerado automaticamente (insertId).
    static async CadastroUsuario(usuario: IUsuario):Promise<IUsuario> {
        const [rows] = await promisePool.execute('INSERT INTO usuarios (nome, email, senha) VALUES(?, ?, ?)',
            [usuario.nome, usuario.email, usuario.senha]
        ); console.log(`Usuario foi inserido ${rows}`);

        return{...usuario, id:(rows as msql2.ResultSetHeader).insertId}
    };

    static async LoginUsuario(email: string): Promise<IUsuario | null> {
        if(!email) return null;
        console.log(`Buscando usuario pelo email: ${email}`);

        const [rows] = await promisePool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        const usuario = (rows as IUsuario[])[0];
        return usuario || null;
    }
}