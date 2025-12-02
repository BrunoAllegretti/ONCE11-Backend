const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product'); // <-- FALTAVA ISSO
const productsController = require('../controllers/productsController');

// @route   POST api/products
// @desc    Criar um produto (Apenas Admin/Usuário Autenticado)
// @access  Private
router.post('/', auth, productsController.createProduct);

// @route   GET api/products
// @desc    Obter todos os produtos
// @access  Public
router.get('/', productsController.getProducts);

// @route   GET api/products/:id
// @desc    Obter produto por ID
// @access  Public
router.get('/:id', productsController.getProductById);

// @route   PUT api/products/:id
// @desc    Atualizar um produto
// @access  Private
router.put('/:id', auth, productsController.updateProduct);

// @route   DELETE api/products/:id
// @desc    Deletar um produto
// @access  Private
router.delete('/:id', auth, productsController.deleteProduct);

// 🔥 ROTA DE SEED — IMPORTANTE: COLOQUE ANTES DO :id
router.post('/seed', async (req, res) => {
  try {
    await Product.insertMany(req.body); // aceita array diretamente
    res.json({ msg: 'Produtos adicionados com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao adicionar produtos' });
  }
});

module.exports = router;
