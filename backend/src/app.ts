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


   // Rota de Cadastro
   /*app.post('/register', async (req: Request, res: Response): Promise<void> => {
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
});*/


// Rota de login
app.post('/login', async (req: Request, res: Response) => {
    const { email, senha } = req.body;
    try {
      const [rows]: any = await promisePool.execute(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
      );
  
      if (rows.length > 0) {
        const validPassword = await bcrypt.compare(senha, rows[0].senha);  // Verificar senha
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
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      res.status(500).json({ error: 'Erro no login', details: errorMessage });
    }
  });

  /*app.get('/menu', verifyToken, (req: Request, res: Response) => {
    // Aqui, você já pode acessar req.userId, por exemplo
    res.json({ message: 'Conteúdo do menu protegido' });
  });*/


  

// Rota para criar evento
app.post('/event', async (req: Request, res: Response) => {
    const { usuarios_id, titulo, data_evento } = req.body;
    try {
        await promisePool.execute(
            'INSERT INTO events (usuarios_id, titulo, data_evento) VALUES (?, ?, ?)',
            [usuarios_id, titulo, data_evento]
        );
        res.status(201).json({ message: 'Evento cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar evento' });
    }
});

// Rota para obter eventos de um usuário específico
app.get('/events/:userId', async (req: Request, res: Response) => {
    const { usuarios_id } = req.params;
    try {
        const [rows]: any = await promisePool.execute(
            'SELECT * FROM eventos WHERE usuarios_id = ?',
            [usuarios_id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar eventos' });
    }
});

/*app.post("/profissionais", async (req: Request, res: Response) => {
  const { nome, email, telefone, especialidade } = req.body;

  if (!nome || !email || !especialidade) {
      return res.status(400).json({ message: "Nome, e-mail e especialidade são obrigatórios." });
  }

  try {
      const [result] = await promisePool.execute(
          "INSERT INTO profissionais (nome, email, telefone, especialidade) VALUES (?, ?, ?, ?)",
          [nome, email, telefone, especialidade]

          
      );
// acrescentando uma condição caso o profissional não for cadastradado, voltar o erro 400
      if(result){
        res.status(201).json({ message: "Profissional cadastrado com sucesso!"  });

      } else {
        res.status(400).json ({ message: "Profissional nao foi cadastrado."})
      }


      
  } catch (error) {
      console.error("Erro ao cadastrar profissional:", error);
      res.status(500).json({ message: "Erro no servidor" });
  }
});*/

app.post('/disponibilidade', async (req: Request, res: Response) => {
  const { profissional_id, data, hora, disponivel } = req.body;

  try {
      await promisePool.query(
          'INSERT INTO disponibilidade (profissional_id, data, hora, disponivel) VALUES (?, ?, ?, ?)',
          [profissional_id, data, hora, disponivel]
      );
      res.status(201).json({ message: 'Disponibilidade cadastrada com sucesso!' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao cadastrar disponibilidade' });
  }
});


// Rota para agendamento
app.post('/calendario', async (req: Request, res: Response) => {
    const { usuarios_id, data_agendamento, hora } = req.body;
  
    try {
      // Salvando no banco de dados
      const result = await promisePool.query(
        'INSERT INTO calendario (usuarios_id, data_agendamento, hora ) VALUES (?, ?, ?)',
        [usuarios_id, data_agendamento, hora]
      );
  
      res.status(200).json({ message: 'Agendamento realizado com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao realizar agendamento' });
    }
  });

  app.delete('/calendario/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await promisePool.query('DELETE FROM calendario WHERE id = ?', [id]);
        res.status(200).json({ message: 'Agendamento deletado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar agendamento' });
    }
});


  // Rota para horarios ocupados
  app.get('/horarios-ocupados', async (req: Request, res: Response) => {
    const { data_agendamento } = req.query;
  
    try {
      // Pegando os agendamentos do banco para uma data específica
      const result = await promisePool.query(
        'SELECT hora FROM calendario WHERE data_agendamento = ?',
        [data_agendamento]
      );
  
      const horariosOcupados = result.map((row: any) => row.hora);
      res.status(200).json(horariosOcupados);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao verificar horários ocupados' });
    }
  });
  




// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
