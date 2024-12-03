import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { mongo } from '../database/mongo.js';
import { ObjectId } from 'mongodb';

config(); // Carrega as variáveis de ambiente do arquivo .env

const userdataRouter = express.Router();

userdataRouter.use((req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).send({
      success: false,
      statusCode: 403,
      body: {
        text: 'No token provided.'
      }
    });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        success: false,
        statusCode: 500,
        body: {
          text: 'Failed to authenticate token.',
          err
        }
      });
    }

    req.userId = decoded.id;
    next();
  });
});

userdataRouter.get('/me', async (req, res) => {
  const user = await mongo.db.collection('users').findOne({ _id: new ObjectId(req.userId) });

  if (!user) {
    return res.status(404).send({
      success: false,
      statusCode: 404,
      body: {
        text: 'User not found.'
      }
    });
  }

  res.send({
    success: true,
    statusCode: 200,
    body: user
  });
});

export default userdataRouter;