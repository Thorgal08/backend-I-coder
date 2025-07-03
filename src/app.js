// src/app.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const handlebars = require('express-handlebars');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const ProductManager = require('./managers/ProductManager');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;
const productManager = new ProductManager();

// Configurar Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// Rutas API
app.use('/api/products', productsRouter(io));
app.use('/api/carts', cartsRouter);

// Rutas vistas
app.use('/', viewsRouter);

// WebSockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  productManager.getProducts().then(products => {
    socket.emit('updateProducts', products);
  });

  socket.on('newProduct', async (data) => {
    await productManager.addProduct(data);
    const updatedProducts = await productManager.getProducts();
    io.emit('updateProducts', updatedProducts);
  });

  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProduct(id);
    const updatedProducts = await productManager.getProducts();
    io.emit('updateProducts', updatedProducts);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
