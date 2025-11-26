const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const productsController = require('../controllers/productsController');

// @route   POST api/products
// @desc    Criar um produto (Apenas Admin/Usuário Autenticado)
// @access  Private
router.post('/', auth, productsController.createProduct);

// @route   GET api/products
// @desc    Obter todos os produtos (AGORA PROTEGIDO)
// @access  Private
router.get('/', auth, productsController.getProducts); // <-- Alteração aplicada aqui

// @route   GET api/products/:id
// @desc    Obter produto por ID (AGORA PROTEGIDO)
// @access  Private
router.get('/:id', auth, productsController.getProductById); // <-- Alteração aplicada aqui

// @route   PUT api/products/:id
// @desc    Atualizar um produto (Apenas Admin/Usuário Autenticado)
// @access  Private
router.put('/:id', auth, productsController.updateProduct);

// @route   DELETE api/products/:id
// @desc    Deletar um produto (Apenas Admin/Usuário Autenticado)
// @access  Private
router.delete('/:id', auth, productsController.deleteProduct);

module.exports = router;
