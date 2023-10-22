import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
const cartsFilePath = path.join(currentDirPath, "../data/carts/carts.js");
export default class CartManagerFS {
    constructor(products) {
        this.products = products;
        this.id = 1;
        this.path = cartsFilePath;
    }
    getCarts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const carts = JSON.parse(data);
            return carts;
        } else {
            return [];
        }
    };
    addNewCart = async (products) => {
        const carts = await this.getCarts();
        const cart = new CartManagerFS(products);
        const checkID = carts[carts.length - 1];
        if (!checkID) {
            cart.id = 1;
        } else {
            cart.id = checkID.id + 1;
        }
        carts.push({ id: cart.id, products: cart.products });
        await fs.promises.writeFile(
            this.path,
            JSON.stringify(carts, null, "\t")
        );
    };
    getCartById = async (id) => {
        const carts = await this.getCarts();
        const cartID = carts.find((cart) => cart.id === id);
        if (!cartID) {
            console.log("Not found");
            return "Not Found";
        } else {
            return cartID.products;
        }
    };
    addToCart = async (cartID, product) => {
        const carts = await this.getCarts();
        const cart = carts.find((cart) => cart.id === cartID);

        if (!cart) {
            console.error("Cart not found");
            return;
        }
        const existingItem = cart.products.find(
            (item) => item.product === product
        );
        if (existingItem) {
            existingItem.quantity++;
            console.log("Product has been added");
        } else {
            cart.products.push({ product, quantity: 1 });
            console.log("Product has been added");
        }

        await fs.promises.writeFile(
            this.path,
            JSON.stringify(carts, null, "\t")
        );
    };
}
