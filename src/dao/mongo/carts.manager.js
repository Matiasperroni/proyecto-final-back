import cartModel from "../models/carts.schema.js";
import productsModel from "../models/products.schema.js";
import ticketModel from "../models/tickets.schema.js";

class CartManagerDB {
    constructor() {
        this.cartsModel = cartModel;
    }

    async getCarts() {
        try {
            const carts = await this.cartsModel.find().lean();
            return carts;
        } catch (error) {
            console.error("Doesn´t exists a cart with this ID.");
        }
    }
    async createNewCart() {
        try {
            const newCart = await this.cartsModel.create({ products: [] });
            return newCart;
        } catch (error) {
            throw new Error("Could not add cart");
        }
    }

    async getCartByID(id) {
        try {
            const cartFound = await this.cartsModel
                .findById(id)
                .populate("products.product")
                .lean();
            if (cartFound) {
                return cartFound;
            } else {
                return "Not Found";
            }
        } catch (error) {
            throw new Error("Could not get cart");
        }
    }

    async addToCart(cartID, prodID) {
        try {
            const cart = await this.cartsModel.findById(cartID);
            if (!cart) {
                throw new Error("Cart not found");
            }

            const prodIndex = cart.products.findIndex(
                (prod) => prod.product.toString() === prodID
            );
            if (prodIndex !== -1) {
                cart.products[prodIndex].quantity++;
            } else {
                const newProduct = { product: prodID, quantity: 1 };
                cart.products.push(newProduct);
            }

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Could not add products to cart: " + error);
        }
    }

    async deleteProdFromCart(cartID, prodID) {
        try {
            const cart = await this.cartsModel.findById(cartID);
            const prodIndex = cart.products.findIndex(
                (prod) => prod._id.toString() === prodID
            );
            if (prodIndex !== -1) {
                cart.products.splice(prodIndex, 1);
            } else {
                throw new Error("Error deleting product");
            }
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(
                "It doesn´t exists a cart or product with such ID."
            );
        }
    }

    async updateWholeCart(cartID, prods) {
        try {
            const cartToUpdate = await this.cartsModel.findById(cartID);
            cartToUpdate.products = prods;
            await cartToUpdate.save()
        } catch (error) {
            throw new Error("Couldn´t update cart.");
        }
    }
    async emptyCart(cartID) {
        try {
            const cart = await this.cartsModel.findById(cartID);
            cart.products = [];
            await cart.save();
            return cart;
        } catch (err) {
            console.error(err);
        }
    }
    async updateQuantity(cartID, prodID, quantity) {
        try {
            const cart = await this.cartsModel.findById(cartID);
            const prodToUpdate = cart.products.find(
                (prod) => prod.product._id.toString() === prodID
            );
            prodToUpdate.quantity = quantity;
            cart.save();
            return cart;
        } catch (err) {
            console.error(err);
        }
    }
    async purchase(cartID, email) {
        try {
            const cart = await this.cartsModel.findById(cartID);
            if (!cart) {
                throw new Error("Cart not found");
            }

            let totalPrice = 0;
            let unavailableProducts = [];
            const randomCode = Math.floor(Math.random() * 1000) + 1;
            for (const cartProduct of cart.products) {
                const product = await productsModel.findById(
                    cartProduct.product
                );
                if (!product) {
                    throw new Error("Product not found");
                }

                if (product.stock < cartProduct.quantity) {
                    unavailableProducts.push(cartProduct.product);
                } else {
                    product.stock -= cartProduct.quantity;
                    await this.deleteProdFromCart(cartID, cartProduct._id.toString());
                    totalPrice =
                        product.price * cartProduct.quantity + totalPrice;
                    await product.save();
                }
            }

            if (unavailableProducts.length > 0) {
                return unavailableProducts;
            }
            const newTicket = await ticketModel.create({
                code: randomCode,
                purchase_datetime: Date.now(),
                amount: totalPrice,
                purchaser: email,
            });
            const ticket = await ticketModel.findOne({code: newTicket.code}).lean()
            await cart.save();

            return {
                ticket,
                unavailableProducts,
            };
        } catch (error) {
            throw new Error("Could not complete purchase: " + error);
        }
    }
}
export default CartManagerDB;
