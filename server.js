const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Conectar ao banco MongoDB
connectDB();

// Middlewares principais
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta 'uploads' (necessário para exibir fotos de perfil no frontend)
app.use('/uploads', express.static('uploads'));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

// Rota teste
app.get('/', (req, res) => {
  res.send("API Rodando!");
});

// Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));

