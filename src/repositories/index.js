import CartRepository from './Cart.repository.js';
import ProductRepository from './Product.repository.js';
import CartManagerDB from '../dao/mongo/carts.manager.js';
import ProductsManagerDB from '../dao/mongo/products.manager.js';

const cartManager = new CartManagerDB()
const productManager = new ProductsManagerDB()

export const cartRepository = new CartRepository(cartManager)
export const productRepository = new ProductRepository(productManager)