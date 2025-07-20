const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManagerMongo');
const CartManager = require('../managers/CartManagerMongo');
const productManager = new ProductManager();
const cartManager = new CartManager();

// Ruta raíz - muestra la lista estática de productos
router.get('/', async (req, res) => {
  const products = await productManager.getProductsSimple();
  res.render('home', { products });
});

// Ruta para mostrar la vista realtimeproducts
router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProductsSimple();
  res.render('realTimeProducts', { products });
});

// Nueva ruta para productos con paginación
router.get('/products', async (req, res) => {
  try {
    const options = {
      limit: req.query.limit || 10,
      page: req.query.page || 1,
      sort: req.query.sort,
      category: req.query.category,
      status: req.query.status
    };

    const result = await productManager.getProducts(options);
    const categories = await productManager.getCategories();
    
    if (result.status === 'error') {
      return res.status(500).render('error', { message: result.message });
    }

    res.render('products', { 
      products: result.payload,
      categories: categories,
      pagination: {
        totalPages: result.totalPages,
        currentPage: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink
      },
      query: req.query
    });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
});

// Nueva ruta para ver detalle de producto
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    
    if (!product) {
      return res.status(404).render('error', { message: 'Producto no encontrado' });
    }

    res.render('productDetail', { product });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
});

// Ruta para finalizar compra
router.post('/cart/checkout', async (req, res) => {
  try {
    // Buscar el carrito actual del usuario
    const carts = await cartManager.getAllCarts();
    let cart = carts.find(c => c.products.length > 0) || carts[0];
    
    if (!cart || cart.products.length === 0) {
      return res.status(400).render('error', { 
        message: 'No hay productos en el carrito para procesar' 
      });
    }

    // Generar número de pedido único
    const orderNumber = `#${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    // Calcular total
    const total = cart.products.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );

    // Simular procesamiento de pago
    const orderData = {
      orderNumber,
      total,
      items: cart.products.length,
      products: cart.products,
      date: new Date()
    };

    // Vaciar el carrito después de la compra
    await cartManager.clearCart(cart._id);

    res.render('checkout-success', orderData);
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
});

// Ruta para el carrito único del usuario 
router.get('/cart', async (req, res) => {
  try {
    // Buscar si ya existe un carrito, si no, crear uno
    let carts = await cartManager.getAllCarts();
    let cart;
    
    if (carts.length === 0) {
      // No hay carritos, crear uno nuevo
      cart = await cartManager.createCart();
    } else {
      // Buscar un carrito con productos válidos (sin referencias rotas)
      cart = carts.find(c => 
        c.products.length > 0 && 
        c.products.every(item => item.product && item.product._id)
      );
      
      // Si no hay carritos válidos con productos, usar el primero disponible
      if (!cart) {
        cart = carts[0];
      }
    }
    
    res.render('cart', { cart, cartId: cart._id });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
});

// Nueva ruta para ver carrito específico
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    
    if (!cart) {
      return res.status(404).render('error', { message: 'Carrito no encontrado' });
    }

    res.render('cart', { cart, cartId: req.params.cid });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
});

// Ruta administrativa para gestión de carritos
router.get('/admin/carts', async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.render('cartList', { carts });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
});

module.exports = router;
