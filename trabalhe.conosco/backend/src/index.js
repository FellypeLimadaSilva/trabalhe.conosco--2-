import express from 'express';
import cors from 'cors';
import { mongo } from './database/mongo.js';
import { config } from 'dotenv';
import authRouter from './auth/auth.js';
import UsersRouter from './routes/users.js';
import candidatesRouter from './routes/candidates.js';
import userdataRouter from './routes/userdata.js';
import worksRouter from './routes/works.js';

config(); // Carrega as variáveis de ambiente do arquivo .env

// Função principal para inicializar o servidor
async function main() {
    const hostname = 'localhost';
    const port = process.env.PORT || 5500; // Permite usar uma variável de ambiente para a porta

    const app = express({ path: './backend/src/.env' });

    try {
        // Conectando ao MongoDB
        const mongoConnection = await mongo.connect({ 
            mongoConnectionString: process.env.MONGO_CS, 
            mongoDbName: process.env.MONGO_DB_NAME
        });

        if (mongoConnection.text) {
            // Se houve erro, exibe a mensagem
            console.error('Erro na conexão com o MongoDB:', mongoConnection.error);
            process.exit(1); // Encerra o processo com código de erro
        }

        console.log('MongoDB conectado com sucesso:', mongoConnection);

        // Middleware
        app.use(express.json());
        app.use(cors());

        // Rota raiz
        app.get('/', (req, res) => {
            res.send({
                success: true,
                statusCode: 200,
                message: 'Bem-vindo à API Boa-Ação!'
            });
        });

        // Rotas da aplicação
        app.use('/auth', authRouter);
        app.use('/users', UsersRouter);
        app.use('/candidates', candidatesRouter);
        app.use('/userdata', userdataRouter);
        app.use('/works', worksRouter);

        // Iniciando o servidor
        app.listen(port, () => {
            console.log(`Servidor rodando em: http://${hostname}:${port}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
}

main();
