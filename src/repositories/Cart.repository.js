

export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAllCarts = async () => {
        const carts = await this.dao.getCarts();
        return carts;
    };
    getById = async (id) => {
        const productID = await this.dao.getCartByID(id);
        return productID;
    };

    // purchaseCart = async (cartID, userMail) => {
    //     const purchase = await this.dao.purchase(cartID, userMail);
    //     return purchase;
    // };

    createCart = async () => {
        const cart = await this.dao.createNewCart();
        return cart;
    };

    addToCart = async (cartID, prodID) => {
        const cart = await this.dao.addToCart(cartID, prodID);
        return cart;
    };

    // updateProduct = async (id, products) => {
    //     const productUpdate = await this.dao.update(id, products);
    //     return productUpdate;
    // };
    updateWholeCart = async (cartID, prods) => {
        const updatedCart = await this.dao.updateWholeCart(cartID, prods)
        return updatedCart;
    }

    updateQuantity = async (cartID, prodID, quantity) => {
        const productUpdate = await this.dao.updateQuantity(
            cartID,
            prodID,
            quantity
        );
        return productUpdate;
    };

    emptyCart = async(cartID) => {
        const cart = await this.dao.emptyCart(cartID)
        return cart
    }

    deleteProduct = async (cartID, prodID) => {
        const productDelete = await this.dao.deleteProdFromCart(cartID, prodID);
        return productDelete;
    };

    purchase = async (cartID, email) => {
        const purchase = await this.dao.purchase(cartID, email)
        return purchase;
    }
}
