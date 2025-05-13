const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  preco: { type: Number, required: true },
  imagem: { type: String, required: true },
  categoria: { type: String, enum: ['vegetais', 'frutas', 'outros'], default: 'vegetais' },
  estoque: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);