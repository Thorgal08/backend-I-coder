const mongoose = require('mongoose');
require('dotenv').config();

// Esquema del producto
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnails: String
});

const Product = mongoose.model('Product', productSchema);

const imageUpdates = [
  {
    title: "Smartphone Samsung Galaxy S24",
    thumbnails: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop"
  },
  {
    title: "Laptop HP Pavilion Gaming", 
    thumbnails: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop"
  },
  {
    title: "Cera Modeladora Spider Wax",
    thumbnails: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400&h=400&fit=crop"
  },
  {
    title: "iPhone 15 Pro Max",
    thumbnails: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop"
  },
  {
    title: "Auriculares Sony WH-1000XM5",
    thumbnails: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
  }
];

async function fixImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    for (const update of imageUpdates) {
      const result = await Product.updateOne(
        { title: { $regex: update.title, $options: 'i' } },
        { thumbnails: update.thumbnails }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Actualizada imagen para: ${update.title}`);
      } else {
        console.log(`⚠️  No se encontró: ${update.title}`);
      }
    }

    console.log('🎉 Actualización de imágenes completada');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixImages();
