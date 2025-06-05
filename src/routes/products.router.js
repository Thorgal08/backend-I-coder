const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

// GET /api/products/ - Obtener todos los productos
router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

// GET /api/products/:pid - Obtener producto por ID
router.get('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid);
  const product = await productManager.getProductById(pid);

  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

  res.json(product);
});

// POST /api/products/ - Crear un nuevo producto
router.post('/', async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

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
  const pid = parseInt(req.params.pid);
  const deleted = await productManager.deleteProduct(pid);

  if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });

  res.json({ message: 'Producto eliminado exitosamente' });
});

router.get('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const product = await productManager.getProductById(pid);

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json(product);
});

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

  // Validación básica
  if (!title || !description || !code || price == null || stock == null || !category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const newProduct = await productManager.addProduct({
    title,
    description,
    code,
    price,
    status: status !== undefined ? status : true,
    stock,
    category,
    thumbnails: thumbnails || []
  });

  res.status(201).json(newProduct);
});


module.exports = router;
