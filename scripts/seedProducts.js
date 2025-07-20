// Script para poblar la base de datos con productos de muestra
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/Product');

// Conectar a MongoDB usando la misma configuración que la app
async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado a MongoDB');
    console.log(`🌐 Base de datos: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
}

const sampleProducts = [
  // Tecnología
  {
    title: "iPhone 15 Pro Max",
    description: "Smartphone Apple con chip A17 Pro, pantalla de 6.7 pulgadas y cámara profesional",
    code: "APPLE001",
    price: 1299000,
    status: true,
    stock: 25,
    category: "tecnología",
    thumbnails: ["https://example.com/iphone15.jpg"]
  },
  {
    title: "MacBook Air M3",
    description: "Laptop ultraliviana con chip M3, 13 pulgadas, ideal para trabajo y creatividad",
    code: "APPLE002",
    price: 1450000,
    status: true,
    stock: 15,
    category: "tecnología",
    thumbnails: []
  },
  {
    title: "AirPods Pro 2",
    description: "Audífonos inalámbricos con cancelación de ruido activa",
    code: "APPLE003",
    price: 285000,
    status: true,
    stock: 50,
    category: "tecnología",
    thumbnails: []
  },
  {
    title: "PlayStation 5",
    description: "Consola de videojuegos de nueva generación con ray tracing",
    code: "SONY001",
    price: 650000,
    status: true,
    stock: 8,
    category: "tecnología",
    thumbnails: []
  },
  {
    title: "Nintendo Switch OLED",
    description: "Consola híbrida con pantalla OLED de 7 pulgadas",
    code: "NINTENDO001",
    price: 420000,
    status: true,
    stock: 12,
    category: "tecnología",
    thumbnails: []
  },

  // Celulares
  {
    title: "Samsung Galaxy S24 Ultra",
    description: "Smartphone Android premium con S Pen y cámara de 200MP",
    code: "SAMSUNG001",
    price: 1180000,
    status: true,
    stock: 20,
    category: "celulares",
    thumbnails: []
  },
  {
    title: "Google Pixel 8 Pro",
    description: "Smartphone con inteligencia artificial avanzada y cámara computacional",
    code: "GOOGLE001",
    price: 980000,
    status: true,
    stock: 18,
    category: "celulares",
    thumbnails: []
  },
  {
    title: "OnePlus 12",
    description: "Flagship killer con carga rápida de 100W y pantalla 120Hz",
    code: "ONEPLUS001",
    price: 820000,
    status: true,
    stock: 15,
    category: "celulares",
    thumbnails: []
  },
  {
    title: "Xiaomi 14 Ultra",
    description: "Smartphone con cámara Leica y rendimiento flagship",
    code: "XIAOMI001",
    price: 750000,
    status: true,
    stock: 22,
    category: "celulares",
    thumbnails: []
  },

  // Indumentaria
  {
    title: "Camiseta Nike Dri-FIT",
    description: "Camiseta deportiva con tecnología de absorción de humedad",
    code: "NIKE001",
    price: 35000,
    status: true,
    stock: 100,
    category: "indumentaria",
    thumbnails: []
  },
  {
    title: "Jeans Levi's 501",
    description: "Jeans clásicos de corte recto, 100% algodón",
    code: "LEVIS001",
    price: 85000,
    status: true,
    stock: 45,
    category: "indumentaria",
    thumbnails: []
  },
  {
    title: "Hoodie Adidas Originals",
    description: "Sudadera con capucha, diseño clásico de tres rayas",
    code: "ADIDAS001",
    price: 65000,
    status: true,
    stock: 30,
    category: "indumentaria",
    thumbnails: []
  },
  {
    title: "Chaqueta Columbia",
    description: "Chaqueta impermeable para actividades al aire libre",
    code: "COLUMBIA001",
    price: 120000,
    status: true,
    stock: 20,
    category: "indumentaria",
    thumbnails: []
  },
  {
    title: "Vestido Zara",
    description: "Vestido elegante para ocasiones especiales",
    code: "ZARA001",
    price: 55000,
    status: true,
    stock: 25,
    category: "indumentaria",
    thumbnails: []
  },

  // Calzado
  {
    title: "Nike Air Max 270",
    description: "Zapatillas deportivas con amortiguación Air Max",
    code: "NIKE002",
    price: 150000,
    status: true,
    stock: 35,
    category: "calzado",
    thumbnails: []
  },
  {
    title: "Adidas Ultraboost 22",
    description: "Zapatillas para running con tecnología Boost",
    code: "ADIDAS002",
    price: 180000,
    status: true,
    stock: 28,
    category: "calzado",
    thumbnails: []
  },
  {
    title: "Converse Chuck Taylor",
    description: "Zapatillas clásicas de lona, estilo atemporal",
    code: "CONVERSE001",
    price: 75000,
    status: true,
    stock: 50,
    category: "calzado",
    thumbnails: []
  },
  {
    title: "Dr. Martens 1460",
    description: "Botas de cuero con suela AirWair, estilo icónico",
    code: "DRMARTENS001",
    price: 220000,
    status: true,
    stock: 15,
    category: "calzado",
    thumbnails: []
  },
  {
    title: "Vans Old Skool",
    description: "Zapatillas skate con la clásica raya lateral",
    code: "VANS001",
    price: 85000,
    status: true,
    stock: 40,
    category: "calzado",
    thumbnails: []
  },

  // Electrodomésticos
  {
    title: "Cafetera Nespresso",
    description: "Máquina de café espresso con sistema de cápsulas",
    code: "NESPRESSO001",
    price: 180000,
    status: true,
    stock: 25,
    category: "electrodomésticos",
    thumbnails: []
  },
  {
    title: "Microondas Samsung",
    description: "Horno microondas de 23 litros con grill",
    code: "SAMSUNG002",
    price: 220000,
    status: true,
    stock: 15,
    category: "electrodomésticos",
    thumbnails: []
  },
  {
    title: "Aspiradora Dyson V15",
    description: "Aspiradora inalámbrica con tecnología ciclónica",
    code: "DYSON001",
    price: 550000,
    status: true,
    stock: 8,
    category: "electrodomésticos",
    thumbnails: []
  },
  {
    title: "Licuadora Oster",
    description: "Licuadora de alta potencia con jarra de vidrio",
    code: "OSTER001",
    price: 85000,
    status: true,
    stock: 30,
    category: "electrodomésticos",
    thumbnails: []
  },
  {
    title: "Air Fryer Philips",
    description: "Freidora de aire sin aceite, 4.1 litros de capacidad",
    code: "PHILIPS001",
    price: 180000,
    status: true,
    stock: 20,
    category: "electrodomésticos",
    thumbnails: []
  },

  // Perfumería
  {
    title: "Chanel No. 5",
    description: "Perfume clásico femenino, aroma floral y elegante",
    code: "CHANEL001",
    price: 180000,
    status: true,
    stock: 12,
    category: "perfumería",
    thumbnails: []
  },
  {
    title: "Dior Sauvage",
    description: "Fragancia masculina fresca y sofisticada",
    code: "DIOR001",
    price: 155000,
    status: true,
    stock: 18,
    category: "perfumería",
    thumbnails: []
  },
  {
    title: "Tom Ford Black Orchid",
    description: "Perfume unisex con notas orientales y especiadas",
    code: "TOMFORD001",
    price: 220000,
    status: true,
    stock: 8,
    category: "perfumería",
    thumbnails: []
  },
  {
    title: "Creed Aventus",
    description: "Fragancia premium masculina con notas frutales",
    code: "CREED001",
    price: 350000,
    status: true,
    stock: 5,
    category: "perfumería",
    thumbnails: []
  },

  // Lentes
  {
    title: "Ray-Ban Aviator",
    description: "Lentes de sol clásicos con marco dorado",
    code: "RAYBAN001",
    price: 180000,
    status: true,
    stock: 25,
    category: "lentes",
    thumbnails: []
  },
  {
    title: "Oakley Holbrook",
    description: "Lentes deportivos con protección UV",
    code: "OAKLEY001",
    price: 220000,
    status: true,
    stock: 20,
    category: "lentes",
    thumbnails: []
  },
  {
    title: "Persol Steve McQueen",
    description: "Lentes vintage inspirados en el ícono del cine",
    code: "PERSOL001",
    price: 280000,
    status: true,
    stock: 12,
    category: "lentes",
    thumbnails: []
  },

  // Accesorios
  {
    title: "Reloj Casio G-Shock",
    description: "Reloj deportivo resistente a golpes y agua",
    code: "CASIO001",
    price: 120000,
    status: true,
    stock: 30,
    category: "accesorios",
    thumbnails: []
  },
  {
    title: "Apple Watch Series 9",
    description: "Smartwatch con monitoreo de salud avanzado",
    code: "APPLE004",
    price: 450000,
    status: true,
    stock: 18,
    category: "accesorios",
    thumbnails: []
  },
  {
    title: "Mochila Herschel",
    description: "Mochila urbana con compartimento para laptop",
    code: "HERSCHEL001",
    price: 85000,
    status: true,
    stock: 40,
    category: "accesorios",
    thumbnails: []
  },
  {
    title: "Cartera Fossil",
    description: "Billetera de cuero genuino con múltiples compartimentos",
    code: "FOSSIL001",
    price: 65000,
    status: true,
    stock: 35,
    category: "accesorios",
    thumbnails: []
  },
  {
    title: "Gorro Nike",
    description: "Gorra deportiva con logo bordado",
    code: "NIKE003",
    price: 35000,
    status: true,
    stock: 60,
    category: "accesorios",
    thumbnails: []
  },

  // Estética (productos adicionales)
  {
    title: "Shampoo L'Oréal Professional",
    description: "Shampoo reparador para cabello dañado",
    code: "LOREAL001",
    price: 25000,
    status: true,
    stock: 45,
    category: "estética",
    thumbnails: []
  },
  {
    title: "Crema Facial Nivea",
    description: "Crema hidratante para rostro, todo tipo de piel",
    code: "NIVEA001",
    price: 18000,
    status: true,
    stock: 50,
    category: "estética",
    thumbnails: []
  },
  {
    title: "Sérum Vitamin C",
    description: "Sérum antioxidante con vitamina C para el rostro",
    code: "SERUM001",
    price: 45000,
    status: true,
    stock: 30,
    category: "estética",
    thumbnails: []
  },
  {
    title: "Mascarilla The Ordinary",
    description: "Mascarilla purificante con ácido salicílico",
    code: "ORDINARY001",
    price: 32000,
    status: true,
    stock: 25,
    category: "estética",
    thumbnails: []
  },

  // Algunos productos sin stock para probar filtros
  {
    title: "PlayStation 5 Pro",
    description: "Versión mejorada de la PS5 con mayor rendimiento",
    code: "SONY002",
    price: 850000,
    status: false,
    stock: 0,
    category: "tecnología",
    thumbnails: []
  },
  {
    title: "iPhone 16 Pro",
    description: "Próximo iPhone con características avanzadas",
    code: "APPLE005",
    price: 1400000,
    status: false,
    stock: 0,
    category: "celulares",
    thumbnails: []
  },
  {
    title: "Jordan Retro Limited",
    description: "Edición limitada de zapatillas Jordan",
    code: "NIKE004",
    price: 350000,
    status: false,
    stock: 0,
    category: "calzado",
    thumbnails: []
  }
];

async function seedDatabase() {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    console.log('🌱 Iniciando población de la base de datos...');
    
    // Limpiar productos existentes (opcional - comentar si quieres mantener los existentes)
    // await Product.deleteMany({});
    // console.log('🗑️ Productos existentes eliminados');

    // Insertar nuevos productos
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ ${insertedProducts.length} productos insertados exitosamente`);

    // Mostrar estadísticas por categoría
    const stats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 Estadísticas por categoría:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} productos`);
    });

    const total = await Product.countDocuments();
    console.log(`\n🎉 Total de productos en la base de datos: ${total}`);

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

seedDatabase();
