import express, {Request, Response, Router} from 'express';
import {promisePool} from './BancoDados';
const app = express();
const port = 3000;

promisePool.getConnection()
.then(() => console.log('Conectado ao Banco de Dados'))
.catch((error) => {console.error(`Erro ao conectar ao banco de dados ${error}` )
    process.exit(1);
});


app.listen(port, () =>{
    console.log(`Servidor rodando em http://localhost:${port}`)
})