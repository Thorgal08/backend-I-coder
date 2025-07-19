const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

// Manager que funciona con archivos JSON (fallback si MongoDB no está disponible)
class ProductManagerJSON {
  constructor() {
    this.path = path.resolve(__dirname, '../data/products.json');
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

  async getProducts(options = {}) {
    const products = await this._readFile();
    const { limit = 10, page = 1, sort, query, category, status } = options;

    let filtered = products;

    // Aplicar filtros
    if (category) {
      filtered = filtered.filter(p => 
        p.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (status !== undefined) {
      filtered = filtered.filter(p => p.status === (status === 'true'));
    }

    if (query) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Aplicar ordenamiento
    if (sort === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    // Aplicar paginación
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filtered.length / parseInt(limit));
    const currentPage = parseInt(page);

    return {
      status: 'success',
      payload: paginatedProducts,
      totalPages,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      page: currentPage,
      hasPrevPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
      prevLink: currentPage > 1 ? `/api/products?page=${currentPage - 1}` : null,
      nextLink: currentPage < totalPages ? `/api/products?page=${currentPage + 1}` : null
    };
  }

  async getProductsSimple() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    return products.find(prod => prod.id == id) || null;
  }

  async addProduct(product) {
    const products = await this._readFile();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = { id: newId, ...product };
    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this._readFile();
    const index = products.findIndex(prod => prod.id == id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updates, id: products[index].id };
    await this._writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const filtered = products.filter(prod => prod.id != id);
    if (filtered.length === products.length) return false;
    await this._writeFile(filtered);
    return true;
  }
}

module.exports = ProductManagerJSON;
