import express, { Request, Response, Router } from 'express';
import { promisePool } from './BancoDados'; // Certifique-se de que este arquivo está correto
import router from './routes/Routes'
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
/*import verifyToken from './middleware/middleware_tolken';*/
const app = express();
const port = 3000;
app.use(cors());
dotenv.config();

app.use(express.json());
app.use(bodyParser.urlencoded ({ extended: true}));

//acesso a rotas
app.use('/api/agendamento', router);


// Testando a conexão com o banco de dados
promisePool.getConnection()
    .then((connection) => {
        console.log('Conectado ao Banco de Dados');
        connection.release(); // Libere a conexão após testar
    })
    .catch((error) => {
        console.error(`Erro ao conectar ao banco de dados: ${error.message}`);
        process.exit(1); // Encerra o processo com código de erro
    });


// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
