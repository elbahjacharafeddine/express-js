import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import User from './models/userModel.js';

import cors from 'cors'

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cookieParser());

app.use('/api/users', userRoutes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.get('/users', (req,res) =>{
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    // Ajoutez d'autres utilisateurs ici
  ];
  res.json(users);
})
app.get('/insert-users', async (req, res) =>{
  await User.deleteMany();

  try {
    await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password1',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password2',
      },
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password3',
      },
    ]);
    console.log('Les utilisateurs ont été insérés avec succès.');
    res.send(" insertion ca marche ")
  } catch (error) {
    console.error('Erreur lors de l\'insertion des utilisateurs :', error);
    res.send("erreur lors de l insertion de documents");
  }
})
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
