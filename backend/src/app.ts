import express, { Request, Response } from 'express';
import { promisePool } from './BancoDados'; // Certifique-se de que este arquivo está correto
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = 3000;
app.use(cors());
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || 'chave_secreta';

// Middleware para permitir JSON no body das requisições
app.use(express.json());

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


   // Rota de Cadastro
   app.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {

        console.log("Corpo da requisição recebido:", req.body); 
        const { nome, email, senha } = req.body;
        
        if (!nome || !email || !senha) {
            res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            return; // Apenas sai da execução
        }

        console.log("Recebendo dados para cadastro:", { nome, email, senha });

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        await promisePool.execute(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, hashedPassword]
        );

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        res.status(500).json({ error: 'Erro ao cadastrar usuário', details: errorMessage });
    }
});


// Rota de login
app.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const [rows]: any = await promisePool.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (rows.length > 0) {
            const validPassword = await bcrypt.compare(password, rows[0].password);
            if (validPassword) {
                const token = jwt.sign({ userId: rows[0].id }, SECRET_KEY, { expiresIn: '1h' });
                res.json({ message: 'Login bem-sucedido', token });
            } else {
                res.status(401).json({ error: 'Credenciais inválidas' });
            }
        } else {
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro no login' });
    }
});

// Rota para criar evento
app.post('/event', async (req: Request, res: Response) => {
    const { user_id, title, date } = req.body;
    try {
        await promisePool.execute(
            'INSERT INTO events (user_id, title, date) VALUES (?, ?, ?)',
            [user_id, title, date]
        );
        res.status(201).json({ message: 'Evento cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar evento' });
    }
});

// Rota para obter eventos de um usuário específico
app.get('/events/:userId', async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const [rows]: any = await promisePool.execute(
            'SELECT * FROM events WHERE user_id = ?',
            [userId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar eventos' });
    }
});

// Definição da interface para o corpo da requisição
interface AgendamentoRequest {
    usuarios_id: number;
    data_: string;
    hora: string;
    descricao: string;
}

// Rota para salvar um novo agendamento
app.post("/agendamento", async (req: Request, res: Response): Promise<void> => {
    try {
        const { usuarios_id, data_, hora, descricao }: AgendamentoRequest = req.body;

        // Validação dos campos obrigatórios
        if (!usuarios_id || !data_ || !hora || !descricao) {
            res.status(400).json({ error: "Todos os campos são obrigatórios." });
            return; // Não retorna um valor, apenas sai da função
        }

        // Query para inserir no banco
        const query = `INSERT INTO calendario (usuarios_id, data_, hora, descricao) VALUES (?, ?, ?, ?)`;
        const values = [usuarios_id, data_, hora, descricao];

        await promisePool.execute(query, values);

        // Resposta de sucesso
        res.status(201).json({ message: "Agendamento realizado com sucesso!" });
    } catch (error) {
        console.error("Erro ao agendar:", error);
        res.status(500).json({ error: "Erro no servidor." });
    }
});




// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
