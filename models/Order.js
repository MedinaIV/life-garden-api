const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  produto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantidade: { type: Number, required: true },
  precoUnitario: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itens: [orderItemSchema],
  total: { type: Number, required: true },
  enderecoEntrega: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pendente', 'pago', 'enviado', 'entregue'], 
    default: 'pendente' 
  },
  metodoPagamento: { type: String, required: true },
  dataPedido: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);