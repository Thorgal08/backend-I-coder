const express = require('express');
const ProductManager = require('../managers/ProductManagerMongo');

module.exports = function(io) {
  const router = express.Router();
  const productManager = new ProductManager();

  // GET /api/products/ - Obtener productos con paginación, filtros y ordenamiento
  router.get('/', async (req, res) => {
    try {
      const options = {
        limit: req.query.limit,
        page: req.query.page,
        sort: req.query.sort,
        query: req.query.query,
        category: req.query.category,
        status: req.query.status
      };

      const result = await productManager.getProducts(options);
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        status: 'error', 
        message: error.message 
      });
    }
  });

  // GET /api/products/categories - Obtener categorías disponibles
  router.get('/categories', async (req, res) => {
    try {
      const categories = await productManager.getCategories();
      res.json({ status: 'success', categories });
    } catch (error) {
      res.status(500).json({ 
        status: 'error', 
        message: error.message 
      });
    }
  });

  // GET /api/products/:pid - Obtener producto por ID
  router.get('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const product = await productManager.getProductById(pid);

    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    res.json(product);
  });

  // POST /api/products/ - Crear un nuevo producto
  router.post('/', async (req, res) => {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    } = req.body;

    if (!title || !description || !code || price == null || stock == null || !category) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const newProduct = await productManager.addProduct({
      title,
      description,
      code,
      price,
      status: status ?? true,
      stock,
      category,
      thumbnails: thumbnails || []
    });

    // Emitir actualización a todos los clientes conectados
    const updatedProducts = await productManager.getProductsSimple();
    io.emit('updateProducts', updatedProducts);

    res.status(201).json(newProduct);
  });

  // PUT /api/products/:pid - Actualizar un producto
  router.put('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    const updates = req.body;

    if ('id' in updates) delete updates.id;

    const updatedProduct = await productManager.updateProduct(pid, updates);

    if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });

    res.json(updatedProduct);
  });

  // DELETE /api/products/:pid - Eliminar producto
  router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const deleted = await productManager.deleteProduct(pid);

    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });

    // Emitir actualización a todos los clientes conectados
    const updatedProducts = await productManager.getProductsSimple();
    io.emit('updateProducts', updatedProducts);

    res.json({ message: 'Producto eliminado exitosamente' });
  });

  return router;
};
