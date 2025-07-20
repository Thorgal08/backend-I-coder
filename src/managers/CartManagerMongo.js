const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartManager {

  async createCart() {
    try {
      const cart = new Cart({ products: [] });
      return await cart.save();
    } catch (error) {
      console.error('Error creando carrito:', error);
      throw error;
    }
  }

  async getAllCarts() {
    try {
      const carts = await Cart.find()
        .populate('products.product')
        .lean();
      
      // Filtrar productos que no existen (null) en todos los carritos
      carts.forEach(cart => {
        cart.products = cart.products.filter(item => item.product !== null);
      });
      
      return carts;
    } catch (error) {
      console.error('Error obteniendo carritos:', error);
      return [];
    }
  }

  async getCartById(id) {
    try {
      const cart = await Cart.findById(id)
        .populate('products.product')
        .lean();
      
      if (cart) {
        // Filtrar productos que no existen (null)
        cart.products = cart.products.filter(item => item.product !== null);
      }
      
      return cart;
    } catch (error) {
      console.error('Error obteniendo carrito:', error);
      return null;
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      // Verificar que el producto existe
      const product = await Product.findById(productId);
      if (!product) throw new Error('Producto no encontrado');

      // Buscar si el producto ya está en el carrito
      const existingProductIndex = cart.products.findIndex(
        item => item.product.toString() === productId
      );

      if (existingProductIndex !== -1) {
        // Si existe, actualizar cantidad
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        // Si no existe, agregar nuevo
        cart.products.push({ product: productId, quantity });
      }

      return await cart.save();
    } catch (error) {
      console.error('Error agregando producto al carrito:', error);
      throw error;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      cart.products = cart.products.filter(
        item => item.product.toString() !== productId
      );

      return await cart.save();
    } catch (error) {
      console.error('Error eliminando producto del carrito:', error);
      throw error;
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      // Validar que todos los productos existen
      for (const item of products) {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Producto ${item.product} no encontrado`);
        }
      }

      cart.products = products;
      return await cart.save();
    } catch (error) {
      console.error('Error actualizando carrito:', error);
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      const productIndex = cart.products.findIndex(
        item => item.product.toString() === productId
      );

      if (productIndex === -1) {
        throw new Error('Producto no encontrado en el carrito');
      }

      if (quantity <= 0) {
        // Si la cantidad es 0 o menor, eliminar el producto
        cart.products.splice(productIndex, 1);
      } else {
        cart.products[productIndex].quantity = quantity;
      }

      return await cart.save();
    } catch (error) {
      console.error('Error actualizando cantidad:', error);
      throw error;
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      cart.products = [];
      return await cart.save();
    } catch (error) {
      console.error('Error vaciando carrito:', error);
      throw error;
    }
  }
}

module.exports = CartManager;
