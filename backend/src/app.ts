import express, { Request, Response, Router } from 'express';
import { promisePool } from './BancoDados'; // Certifique-se de que este arquivo está correto
import bcrypt from 'bcrypt';
import router from './routes/Routes'
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser';
/*import verifyToken from './middleware/middleware_tolken';*/
const app = express();
const port = 3000;
const path = require('path');
app.use(cors());
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || 'defaultSecretKey';  // Garantir que o segredo esteja seguro
// Middleware para permitir JSON no body das requisições
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
