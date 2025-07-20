// src/app.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const handlebars = require('express-handlebars');
const connectDB = require('./config/database');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const ProductManager = require('./managers/ProductManagerMongo');

// Conectar a MongoDB Atlas
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 4000;
const productManager = new ProductManager();

// Configurar Handlebars
app.engine('handlebars', handlebars.engine({
  helpers: {
    eq: (a, b) => a === b,
    gt: (a, b) => a > b,
    range: (start, end) => {
      const result = [];
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
      return result;
    },
    calculateSubtotal: (products) => {
      if (!products || !Array.isArray(products)) return 0;
      return products.reduce((total, item) => {
        if (!item || !item.product || !item.product.price) return total;
        return total + (item.product.price * item.quantity);
      }, 0);
    },
    calculateCartTotal: (products) => {
      if (!products || !Array.isArray(products)) return 0;
      return products.reduce((total, item) => {
        if (!item || !item.product || !item.product.price) return total;
        return total + (item.product.price * item.quantity);
      }, 0);
    },
    multiply: (a, b) => a * b,
    formatDate: (date) => {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
}));
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

  productManager.getProductsSimple().then(products => {
    socket.emit('updateProducts', products);
  });

  socket.on('newProduct', async (data) => {
    await productManager.addProduct(data);
    const updatedProducts = await productManager.getProductsSimple();
    io.emit('updateProducts', updatedProducts);
  });

  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProduct(id);
    const updatedProducts = await productManager.getProductsSimple();
    io.emit('updateProducts', updatedProducts);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
