const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// conectar ao banco
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// rota teste
app.get('/', (req, res) => {
  res.send("API Rodando!");
});

// Servir arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static('uploads'));

// rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));
