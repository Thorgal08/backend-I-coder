const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Product = require('../models/Product');
const Cart = require('../models/Cart');

async function migrateData() {
  try {
    // Conectar a MongoDB Atlas
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado a MongoDB Atlas');
    console.log(`🌐 Base de datos: ${mongoose.connection.name}`);

    // Leer productos del archivo JSON
    const productsPath = path.join(__dirname, '../data/products.json');
    if (fs.existsSync(productsPath)) {
      const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
      
      // Limpiar collection
      await Product.deleteMany({});
      console.log('🗑️ Collection de productos limpiada');

      // Migrar productos (sin el campo id, MongoDB usará _id)
      for (const productData of productsData) {
        const { id, ...productWithoutId } = productData;
        await Product.create(productWithoutId);
      }
      console.log(`✅ ${productsData.length} productos migrados`);
    }

    // Leer carritos del archivo JSON
    const cartsPath = path.join(__dirname, '../data/carts.json');
    if (fs.existsSync(cartsPath)) {
      const cartsData = JSON.parse(fs.readFileSync(cartsPath, 'utf-8'));
      
      // Limpiar collection
      await Cart.deleteMany({});
      console.log('🗑️ Collection de carritos limpiada');

      // Los carritos necesitan más trabajo porque hay que hacer referencia a productos
      // Por ahora crear carritos vacíos
      for (const cartData of cartsData) {
        await Cart.create({ products: [] });
      }
      console.log(`✅ ${cartsData.length} carritos migrados (vacíos)`);
    }

    console.log('🎉 Migración completada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
}

migrateData();
