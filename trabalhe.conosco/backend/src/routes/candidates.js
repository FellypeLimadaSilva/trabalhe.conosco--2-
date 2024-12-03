import express from 'express';
import CandidatesController from '../controllers/candidates.js';

const candidatesRouter = express.Router();
const candidatesController = new CandidatesController();

// Rota para cadastrar um candidato
candidatesRouter.post('/', async (req, res) => {
    const { success, statusCode, body } = await candidatesController.addCandidate(req.body);
    res.status(statusCode).send({ success, body });
});

// Rota para listar todos os candidatos (painel do admin)
candidatesRouter.get('/', async (req, res) => {
    const { success, statusCode, body } = await candidatesController.getAllCandidates();
    res.status(statusCode).send({ success, body });
});

// Rota para buscar detalhes de um candidato pelo ID
candidatesRouter.get('/:id', async (req, res) => {
    const { success, statusCode, body } = await candidatesController.getCandidateById(req.params.id);
    res.status(statusCode).send({ success, body });
});

// Rota para atualizar informações (alterar status)
candidatesRouter.put('/:id', async (req, res) => {
    const { success, statusCode, body } = await candidatesController.updateCandidate(req.params.id, req.body);
    res.status(statusCode).send({ success, body });
});

// Rota para excluir um candidato
candidatesRouter.delete('/:id', async (req, res) => {
    const { success, statusCode, body } = await candidatesController.deleteCandidate(req.params.id);
    res.status(statusCode).send({ success, body });
});

export default candidatesRouter;
