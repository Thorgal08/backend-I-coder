const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');

const sampleProducts = [
  {
    title: "Smartphone Samsung Galaxy S24",
    description: "Teléfono inteligente de última generación con cámara de 200MP y 256GB de almacenamiento",
    code: "SAM-S24-256",
    price: 899999,
    status: true,
    stock: 25,
    category: "tecnología",
    thumbnails: ["https://images.samsung.com/is/image/samsung/p6pim/ar/2401/gallery/ar-galaxy-s24-s928-sm-s928bzkearo-thumb-539573011"]
  },
  {
    title: "Laptop HP Pavilion Gaming",
    description: "Laptop gamer con procesador Intel i7, 16GB RAM y tarjeta gráfica GTX 1660",
    code: "HP-PAV-GAM-001",
    price: 1299999,
    status: true,
    stock: 12,
    category: "tecnología",
    thumbnails: []
  },
  {
    title: "Cera Modeladora Spider Wax",
    description: "Cera de alta fijación para peinados modernos, acabado mate",
    code: "SWX-01-MAT",
    price: 9900,
    status: true,
    stock: 50,
    category: "estética",
    thumbnails: []
  },
  {
    title: "Auriculares Sony WH-1000XM5",
    description: "Auriculares inalámbricos con cancelación de ruido activa premium",
    code: "SONY-WH-1000XM5",
    price: 299999,
    status: true,
    stock: 8,
    category: "tecnología",
    thumbnails: []
  },
  {
    title: "Zapatillas Nike Air Force 1",
    description: "Zapatillas clásicas urbanas de cuero blanco, diseño icónico",
    code: "NIKE-AF1-WHT-42",
    price: 89999,
    status: true,
    stock: 30,
    category: "calzado",
    thumbnails: []
  },
  {
    title: "Reloj Apple Watch Series 9",
    description: "Smartwatch con GPS, monitor de salud y resistencia al agua",
    code: "APL-WTC-S9-45MM",
    price: 429999,
    status: true,
    stock: 15,
    category: "tecnología",
    thumbnails: []
  },
  {
    title: "Perfume Azzaro Wanted",
    description: "Fragancia masculina intensa con notas amaderadas y especiadas",
    code: "AZZ-WNT-100ML",
    price: 75999,
    status: true,
    stock: 20,
    category: "perfumería",
    thumbnails: []
  },
  {
    title: "Camiseta Adidas Originals",
    description: "Camiseta deportiva de algodón 100%, corte clásico con logo vintage",
    code: "ADI-ORG-TEE-L",
    price: 25999,
    status: true,
    stock: 45,
    category: "indumentaria",
    thumbnails: []
  },
  {
    title: "Cafetera Nespresso Vertuo",
    description: "Cafetera automática para cápsulas, sistema de centrifusión único",
    code: "NESP-VRT-BLK",
    price: 189999,
    status: false,
    stock: 0,
    category: "electrodomésticos",
    thumbnails: []
  },
  {
    title: "Mochila Nike Sportswear",
    description: "Mochila urbana resistente al agua con compartimiento para laptop",
    code: "NIKE-BP-NSW-001",
    price: 45999,
    status: true,
    stock: 35,
    category: "accesorios",
    thumbnails: []
  }
];

async function addSampleProducts() {
  try {
    // Conectar a MongoDB Atlas
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Agregar productos sin eliminar los existentes
    for (const productData of sampleProducts) {
      try {
        const product = await Product.create(productData);
        console.log(`✅ Producto agregado: ${product.title}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️ Producto ya existe (código duplicado): ${productData.code}`);
        } else {
          console.log(`❌ Error agregando ${productData.title}:`, error.message);
        }
      }
    }

    // Mostrar total de productos
    const totalProducts = await Product.countDocuments();
    console.log(`🎉 Total de productos en la base de datos: ${totalProducts}`);

    console.log('\n📊 Productos por categoría:');
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    categories.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} productos`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addSampleProducts();
