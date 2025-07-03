const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

class ProductManager {
  constructor() {
    this.path = path.resolve(__dirname, '../data/products.json'); // ← ASEGURA RUTA ABSOLUTA

    // Verificar y crear carpeta si no existe
    const dir = path.dirname(this.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async _readFile() {
    try {
      const data = await fsp.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  async _writeFile(data) {
    await fsp.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    return products.find(prod => prod.id === id) || null;
  }

  async addProduct(product) {
    const products = await this._readFile();
    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const newProduct = { id: newId, ...product };
    products.push(newProduct);
    await this._writeFile(products); // 👈 AQUÍ FALLABA PORQUE this.path ERA UNDEFINED
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this._readFile();
    const index = products.findIndex(prod => prod.id === id);
    if (index === -1) return null;

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
}

module.exports = ProductManager;
