import express from 'express';
import UsersControllers from '../controllers/users.js';
import verifyAdmin from '../auth/auth_routes.js';

const UsersRouter = express.Router();

const usersControllers = new UsersControllers();

UsersRouter.get('/', async (req, res) => {
  try {
    const { success, statusCode, body } = await usersControllers.getUsers();
    res.status(statusCode).send({ success, statusCode, body });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).send({ success: false, statusCode: 500, body: "Erro ao buscar usuários" });
  }
});

UsersRouter.delete('/:id', verifyAdmin, async (req, res) => {
  const { success, statusCode, body } = await usersControllers.deleteUser(req.params.id);
  res.status(statusCode).send({ success, statusCode, body });
});

UsersRouter.put('/:id', verifyAdmin, async (req, res) => {
  const { success, statusCode, body } = await usersControllers.updateUser(req.params.id, req.body);
  res.status(statusCode).send({ success, statusCode, body });
});

// Nova rota para cadastrar administrador
UsersRouter.post('/admin', verifyAdmin, async (req, res) => {
  const { email, senha } = req.body;
  const hashedPassword = await bcrypt.hash(senha, 10);
  const newUser = {
    email,
    senha: hashedPassword,
    role: 'admin'
  };

  const { success, statusCode, body } = await usersControllers.createUser(newUser);
  res.status(statusCode).send({ success, statusCode, body });
});

export default UsersRouter;