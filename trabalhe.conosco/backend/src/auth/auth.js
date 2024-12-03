import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import crypto from 'crypto';
import { mongo } from '../database/mongo.js';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const collectionName = 'users';

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, callback) => {
  const user = await mongo.db
    .collection(collectionName)
    .findOne({ email: email });

  if (!user) {
    return callback(null, false);
  }

  const saltBuffer = user.salt?.buffer;

  if (!saltBuffer) {
    return callback(null, false);
  }

  crypto.pbkdf2(password, saltBuffer, 310000, 16, 'sha256', (err, hashedPassword) => {
    if (err) {
      return callback(null, false);
    }

    const userPasswordBuffer = Buffer.from(user.password.buffer);

    if (!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword)) {
      return callback(null, false);
    }

    const { password, salt, ...rest } = user;

    return callback(null, rest);
  });
}));

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  const { email, password, nome, telefone, cnh, experiencia, endereco, disponibilidade, formacao } = req.body;

  const checkUser = await mongo.db.collection(collectionName).findOne({ email });
  if (checkUser) {
    return res.status(500).send({
      success: false,
      statusCode: 500,
      body: {
        text: 'User already exists!'
      }
    });
  }

  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(password, salt, 310000, 16, 'sha256', async (err, hashedPassword) => {
    if (err) {
      return res.status(500).send({
        success: false,
        statusCode: 500,
        body: {
          text: 'Error on crypto password!',
          err
        }
      });
    }

    const result = await mongo.db.collection(collectionName).insertOne({
      email,
      password: hashedPassword,
      salt,
      nome,
      telefone,
      cnh,
      experiencia,
      endereco,
      disponibilidade,
      formacao
    });

    if (result.insertedId) {
      const user = await mongo.db.collection(collectionName).findOne({ _id: new ObjectId(result.insertedId) });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      return res.send({
        success: true,
        statusCode: 200,
        body: {
          text: 'User registered correctly!',
          token,
          user,
          logged: true
        }
      });
    }
  });
});

authRouter.post('/login', (req, res) => {
  passport.authenticate('local', (error, user) => {
    if (error) {
      return res.status(500).send({
        success: false,
        statusCode: 500,
        body: {
          text: 'Error during authentication',
          error
        }
      });
    }

    if (!user) {
      return res.status(400).send({
        success: false,
        statusCode: 400,
        body: {
          text: 'Credentials are not correct',
        }
      });
    }

    let token;
    if (user.role === 'admin') {
      token = jwt.sign({ id: user._id, role: 'admin' }, process.env.JWT_SECRET);
    } else {
      token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET);
    }

    return res.status(200).send({
      success: true,
      statusCode: 200,
      body: {
        text: 'User logged in correctly',
        user,
        token
      }
    });
  })(req, res);
});

export default authRouter;