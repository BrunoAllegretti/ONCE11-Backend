const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // O ID será gerado automaticamente pelo MongoDB (_id)
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priceOld: {
    type: Number,
    required: false, // Pode ser opcional se não houver preço antigo
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  filters: {
    type: [String], // Array de strings, como ["calçado", "futebol"]
    required: true
  },
  // O campo 'quantity' (quantidade) é mais adequado para o carrinho, não para o modelo de produto em si.
  // Se for para controle de estoque, precisaria de um campo 'stock' ou 'inventory'.
  // Vamos manter o modelo simples, focado nas informações do produto.
}, {
  timestamps: true // Adiciona createdAt e updatedAt
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
