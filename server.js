const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const app = express();

// Criar pasta uploads se não existir
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
    console.log("📁 Pasta 'uploads' criada automaticamente.");
}

// Conecta ao MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos corretamente (ABSOLUTO - necessário no Render)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

// Rota teste
app.get('/', (req, res) => {
  res.send("API Rodando!");
});

// Inicia servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));
