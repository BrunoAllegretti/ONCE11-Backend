const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Product = require('./models/Product');

// Carregar variáveis de ambiente do .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB Atlas com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB Atlas:', err));

// --- Rotas de Produtos ---

// Rota 1: GET /api/products - Listar todos os produtos
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
  }
});

// Rota 2: POST /api/products - Adicionar um novo produto
// Esta é a rota que você usará para adicionar novos itens ao backend
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    // Erro de validação do Mongoose (ex: campo obrigatório faltando)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dados de produto inválidos', error: error.message });
    }
    res.status(500).json({ message: 'Erro ao adicionar produto', error: error.message });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor de produtos rodando na porta ${PORT}`);
});
