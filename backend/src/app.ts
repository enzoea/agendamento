import express, { Request, Response } from 'express';
import { promisePool } from './BancoDados'; // Certifique-se de que este arquivo está correto

const app = express();
const port = 3000;

// Middleware para permitir JSON no body das requisições
app.use(express.json());

// Testando a conexão com o banco de dados
promisePool.getConnection()
    .then(() => console.log('Conectado ao Banco de Dados'))
    .catch((error) => {
        console.error(`Erro ao conectar ao banco de dados: ${error}`);
        process.exit(1);
    });

// Rota de registro de usuário
app.post('/register', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        await promisePool.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
});

// Rota de login
app.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const [rows]: any = await promisePool.execute(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]
        );
        if (rows.length > 0) {
            res.json({ message: 'Login bem-sucedido', user: rows[0] });
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

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
