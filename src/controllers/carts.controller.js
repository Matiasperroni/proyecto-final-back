import { cartRepository, productRepository } from "../repositories/index.js";
import CustomError from "../utils/errors/CustomError.js";
import { createCartError } from "../utils/errors/errorInformation.js";
import EErrors from "../utils/errors/Enum.js";

export const getCarts = async (req, res) => {
    try {
        const carts = await cartRepository.getAllCarts();
        if (carts) {
            res.status(200).send(carts);
        } else {
            req.logger.error(`Server error getting carts`);
            res.status(404).send("Server error.");
        }
    } catch (error) {
        req.logger.error(`IServer error creating gettin carts. ${error}`);
        res.status(500).send("Server error.");
    }
};

export const createNewCart = async (req, res) => {
    try {
        const cart = await cartRepository.createCart();
        if (!cart) {
            CustomError.createError({
                name: "Request error",
                cause: createCartError(),
                code: EErrors.ROUTING_ERROR,
                message: "Error creating cart.",
            });
        }
        res.status(200).send(cart);
    } catch (error) {
        req.logger.error(`Server error creating cart ${error}`);
        res.status(500).send("Server error could´t create cart.");
    }
};

export const getCartByID = async (req, res) => {
    try {
        const cartID = req.params.cid;
        const cart = await cartRepository.getById(cartID);
        if (!cart) {
            CustomError.createError({
                name: "Request error",
                cause: createCartError(cartID),
                code: EErrors.ROUTING_ERROR,
                message: "Error creating cart.",
            });
        }
        const products = cart.products;
        res.render("cart", { products });
    } catch (error) {
        req.logger.error(`Server error getting cart by id ${error}`);
        res.status(500).send("Can´t get cart data.");
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const cartID = req.params.cid;
        const prodID = req.params.pid;
        const user = req.session.user;

        const cart = await cartRepository.getById(cartID);
        if (cart) {
            const existingProd = cart.products.find(
                (product) => product.product._id.toString() === prodID
            );
            if (existingProd) {
                const quantity = existingProd.quantity + 1;
                await cartRepository.updateQuantity(cartID, prodID, quantity);
                return;
            }
        } else {
            CustomError.createError({
                name: "Request error",
                cause: createCartError(cartID, prodID),
                code: EErrors.ROUTING_ERROR,
                message: "Error creating cart.",
            });
        }
        const productToAdd = await productRepository.getProductById(prodID);
        if (user.role === "Premium" && user.email === productToAdd.owner) {
            CustomError.createError({
                name: "Request error",
                cause: createCartError(cartID, prodID),
                code: EErrors.ROUTING_ERROR,
                message: "You can not add an item that its yours to your cart.",
            });
        }
        const productAddedToCart = await cartRepository.addToCart(
            cartID,
            prodID
        );
        res.status(200).send(productAddedToCart);
    } catch (error) {
        req.logger.error(`Server error adding product to cart${error}`);
        res.status(500).send("Error, unable to obtain data");
    }
};

export const deleteProdFromCart = async (req, res) => {
    const cartID = req.params.cid;
    const prodID = req.params.pid;
    const deleted = await cartRepository.deleteProduct(cartID, prodID);
    res.send(deleted);
};

export const updateWholeCart = async (req, res) => {
    try {
        const cartID = req.params.cid;
        const prod = req.body;
        const updatedCart = await cartRepository.updateWholeCart(cartID, prod);
        res.status(200).send(updatedCart);
    } catch (error) {
        req.logger.error(`Server error updating cart ${error}`);
        res.status(500).send("Server error updating cart.");
    }
};

export const updateQuantity = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const updatedQuantity = await cartRepository.updateQuantity(
        cid,
        pid,
        quantity
    );
    res.send(updatedQuantity);
};

export const emptyCart = async (req, res) => {
    const cid = req.params.cid;
    const deletedCart = await cartRepository.emptyCart(cid);
    if (!deletedCart) {
        CustomError.createError({
            name: "Request error",
            cause: createCartError(cid),
            code: EErrors.ROUTING_ERROR,
            message: "Error creating cart.",
        });
    }
    res.send(deletedCart);
};

export const finishPurchase = async (req, res) => {
    try {
        const user = req?.session?.user;
        const cartID = req.params.cid;
        const cart = await cartRepository.purchase(cartID, user.email);
        if (!cart.ticket) {
            res.status(500).send(
                "Error trying to purchase: we don´t have that much products in stock."
            );
        } else {
            cart.ticket.purchaser = `Name: ${user.first_name} Last Name: ${user.last_name}. Email: ${user.email}`;
            if (cart) {
                const newTicket = { newTicket: cart.ticket };
                res.render("purchase", { newTicket: newTicket });
            } else {
                res.status(500).send("error: error trying to purchase.");
            }
        }
    } catch (error) {
        req.logger.error(`Server error finishing purchase ${error}`);
        res.status(500).send("Error purchasing.");
    }
};
