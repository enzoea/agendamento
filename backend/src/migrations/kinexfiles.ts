import Knex from 'knex';

const knex = Knex({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1', // Ou o host do seu banco
    user: 'root', // Seu usuário do MySQL
    password: 'aluno', // Sua senha do MySQL
    database: 'agendamento', // O nome do banco de dados
  },
});

export default knex;
