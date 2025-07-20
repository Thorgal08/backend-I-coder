const Product = require('../models/Product');

class ProductManager {
  
  // Obtener productos con paginación, filtros y ordenamiento
  async getProducts(options = {}) {
    try {
      const {
        limit = 10,
        page = 1,
        sort,
        query,
        category,
        status
      } = options;

      // Construir filtros
      const filter = {};
      
      if (query) {
        filter.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ];
      }
      
      if (category) {
        const normalizedCategory = category.trim();
        filter.category = { $regex: normalizedCategory, $options: 'i' };
      }
      
      if (status !== undefined && status !== null && status !== '') {
        filter.status = status === 'true';
      }

      // Configurar ordenamiento
      let sortOption = {};
      if (sort === 'asc') {
        sortOption.price = 1;
      } else if (sort === 'desc') {
        sortOption.price = -1;
      }

      // Ejecutar consulta con paginación
      const products = await Product.find(filter)
        .sort(sortOption)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .lean();

      const totalDocs = await Product.countDocuments(filter);
      const totalPages = Math.ceil(totalDocs / parseInt(limit));
      const currentPage = parseInt(page);

      // Construir enlaces de paginación
      const hasNextPage = currentPage < totalPages;
      const hasPrevPage = currentPage > 1;
      
      const baseUrl = '/api/products';
      const buildLink = (pageNum) => {
        const params = new URLSearchParams();
        params.set('page', pageNum);
        if (limit !== 10) params.set('limit', limit);
        if (sort) params.set('sort', sort);
        if (query) params.set('query', query);
        if (category) params.set('category', category);
        if (status !== undefined) params.set('status', status);
        return `${baseUrl}?${params.toString()}`;
      };

      return {
        status: 'success',
        payload: products,
        totalPages,
        prevPage: hasPrevPage ? currentPage - 1 : null,
        nextPage: hasNextPage ? currentPage + 1 : null,
        page: currentPage,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? buildLink(currentPage - 1) : null,
        nextLink: hasNextPage ? buildLink(currentPage + 1) : null
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  // Obtener categorías disponibles
  async getCategories() {
    try {
      const categories = await Product.distinct('category');
      return categories.filter(cat => cat && cat.trim() !== '');
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      return [];
    }
  }

  // Obtener productos simples (para vistas)
  async getProductsSimple() {
    try {
      return await Product.find().lean();
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id).lean();
    } catch (error) {
      console.error('Error obteniendo producto por ID:', error);
      return null;
    }
  }

  async addProduct(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      console.error('Error agregando producto:', error);
      throw error;
    }
  }

  async updateProduct(id, updates) {
    try {
      return await Product.findByIdAndUpdate(
        id, 
        updates, 
        { new: true, runValidators: true }
      ).lean();
    } catch (error) {
      console.error('Error actualizando producto:', error);
      return null;
    }
  }

  async deleteProduct(id) {
    try {
      const result = await Product.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      return false;
    }
  }
}

module.exports = ProductManager;
