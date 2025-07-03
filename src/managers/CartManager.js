const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../data/carts.json');

class CartManager {
  constructor() {
    this.path = filePath;

    // Verificar y crear carpeta 'data' si no existe
    const dir = path.dirname(this.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async _readFile() {
    try {
      const data = await fsp.readFile(this.path, 'utf-8');
      const parsed = JSON.parse(data);
      console.log("🔍 _readFile() devuelve:", parsed);
      return parsed;
    } catch (error) {
      console.log("Error leyendo el archivo, devolviendo []");
      return [];
    }
  }

  async _writeFile(data) {
    await fsp.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._readFile();
    const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this._readFile();
    return carts.find(cart => cart.id === Number(id));
  }

  async addProductToCart(cid, pid) {
    const carts = await this._readFile();
    const cart = carts.find(c => c.id === Number(cid));
    if (!cart) return null;

    const productIndex = cart.products.findIndex(p => p.product === Number(pid));

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: Number(pid), quantity: 1 });
    }

    await this._writeFile(carts);
    return cart;
  }
}

module.exports = CartManager;
