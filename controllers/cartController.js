const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ usuario: req.user.id }).populate('itens.produto');
    if (!cart) {
      const newCart = new Cart({ usuario: req.user.id, itens: [] });
      await newCart.save();
      return res.json(newCart);
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar carrinho', error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { produtoId, quantidade } = req.body;

    const product = await Product.findById(produtoId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    if (product.estoque < quantidade) {
      return res.status(400).json({ message: 'Quantidade solicitada maior que o estoque disponível' });
    }

    let cart = await Cart.findOne({ usuario: req.user.id });

    if (!cart) {
      cart = new Cart({
        usuario: req.user.id,
        itens: [{ produto: produtoId, quantidade }],
      });
    } else {
      const itemIndex = cart.itens.findIndex(
        item => item.produto.toString() === produtoId
      );

      if (itemIndex > -1) {
        cart.itens[itemIndex].quantidade += quantidade;
      } else {
        cart.itens.push({ produto: produtoId, quantidade });
      }
    }

    await cart.save();
    res.json(await cart.populate('itens.produto'));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar ao carrinho', error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { produtoId } = req.params;

    const cart = await Cart.findOne({ usuario: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Carrinho não encontrado' });
    }

    cart.itens = cart.itens.filter(
      item => item.produto.toString() !== produtoId
    );

    await cart.save();
    res.json(await cart.populate('itens.produto'));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover do carrinho', error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { produtoId } = req.params;
    const { quantidade } = req.body;

    const product = await Product.findById(produtoId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    if (product.estoque < quantidade) {
      return res.status(400).json({ message: 'Quantidade solicitada maior que o estoque disponível' });
    }

    const cart = await Cart.findOne({ usuario: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Carrinho não encontrado' });
    }

    const itemIndex = cart.itens.findIndex(
      item => item.produto.toString() === produtoId
    );

    if (itemIndex > -1) {
      cart.itens[itemIndex].quantidade = quantidade;
      await cart.save();
      res.json(await cart.populate('itens.produto'));
    } else {
      res.status(404).json({ message: 'Item não encontrado no carrinho' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar carrinho', error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { usuario: req.user.id },
      { itens: [] },
      { new: true }
    ).populate('itens.produto');

    if (!cart) {
      return res.status(404).json({ message: 'Carrinho não encontrado' });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao limpar carrinho', error: error.message });
  }
};