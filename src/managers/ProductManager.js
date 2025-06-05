const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../data/products.json');

class ProductManager {
  constructor() {
    this.path = filePath;
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    return products.find(prod => prod.id === id);
  }

  async addProduct(product) {
    const products = await this._readFile();
    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const newProduct = { id: newId, ...product };
    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this._readFile();
    const index = products.findIndex(prod => prod.id === id);
    if (index === -1) return null;

    // Asegurar que no se sobreescriba el ID
    products[index] = { ...products[index], ...updates, id: products[index].id };
    await this._writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const filtered = products.filter(prod => prod.id !== id);
    if (filtered.length === products.length) return false;
    await this._writeFile(filtered);
    return true;
  }

async getProductById(id) {
  try {
    const data = await this.getProducts();
    const product = data.find(p => p.id == id);
    return product || null;
  } catch (error) {
    console.error('Error obteniendo producto por ID:', error);
    return null;
  }
}

async addProduct(productData) {
  try {
    const products = await this.getProducts();

    // Generar nuevo ID autoincrementable
    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const newProduct = {
      id: newId,
      ...productData
    };

    products.push(newProduct);

    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));

    return newProduct;
  } catch (error) {
    console.error('Error agregando producto:', error);
    return null;
  }
}

  
}

module.exports = ProductManager;
