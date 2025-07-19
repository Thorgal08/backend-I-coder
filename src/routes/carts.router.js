const express = require('express');
const CartManager = require('../managers/CartManagerMongo');

const router = express.Router();
const cartManager = new CartManager();

// POST /api/carts/ - Crear nuevo carrito
router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// GET /api/carts/:cid - Obtener productos del carrito
router.get('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);

    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/carts/:cid/product/:pid - Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);

    if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });

    res.json({ message: 'Producto agregado al carrito', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/carts/:cid/products/:pid - Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const updatedCart = await cartManager.removeProductFromCart(cid, pid);

    if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });

    res.json({ message: 'Producto eliminado del carrito', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/carts/:cid - Actualizar todos los productos del carrito
router.put('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Products debe ser un array' });
    }

    const updatedCart = await cartManager.updateCart(cid, products);

    if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });

    res.json({ message: 'Carrito actualizado', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/carts/:cid/products/:pid - Actualizar cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({ error: 'Quantity debe ser un número positivo' });
    }

    const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);

    if (!updatedCart) return res.status(404).json({ error: 'Carrito o producto no encontrado' });

    res.json({ message: 'Cantidad actualizada', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/carts/:cid - Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;

    const updatedCart = await cartManager.clearCart(cid);

    if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });

    res.json({ message: 'Carrito vaciado', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
