import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";


const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
const productsFilePath = path.join(
    currentDirPath,
    "../data/products/products.js"
);

export default class ProductManagerFS {
    constructor(
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status
    ) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.category = category;
        this.status = status;

        this.id = 1;
        this.path = productsFilePath;
    }
    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(data);
            return products;
        } else {
            return [];
        }
    };

    addProduct = async (
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status
    ) => {
        const products = await this.getProducts();
        const product = new ProductManagerFS(
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category,
            status
        );

        const existingProduct = products.find(
            (prod) => prod.code === product.code
        );
        if (existingProduct) {
            console.error("Este código ya existe");
            return "Este codigo ya existe";
        } else {
            if (
                product.title === undefined ||
                product.description === undefined ||
                product.price === undefined ||
                product.thumbnail === undefined ||
                product.code === undefined ||
                product.stock === undefined ||
                product.category === undefined
            ) {
                console.error("Se deben completar todos los campos");
                return "Se deben completar todos los campos";
            } else {
                const checkID = products[products.length - 1];
                if (!checkID) {
                    product.id = 1;
                } else {
                    product.id = checkID.id + 1;
                }
                if (product.status === undefined) {
                    product.status = true;
                }
                products.push({
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    thumbnail: product.thumbnail,
                    code: product.code,
                    stock: product.stock,
                    category: product.category,
                    status: product.status,
                    id: product.id,
                });
            }
        }

        await fs.promises.writeFile(
            this.path,
            JSON.stringify(products, null, "\t")
        );
    };

    getProductById = async (id) => {
        const products = await this.getProducts();
        const prodFound = products.find((p) => p.id === id);
        if (prodFound === undefined) {
            console.log("no existe un producto con ese id");
        } else {
            return prodFound;
        }
    };
    deleteProduct = async (id) => {
        const products = await this.getProducts();
        const prodIndex = products.findIndex((p) => p.id === id);
        if (prodIndex === -1) {
            console.error(
                "No se pudo borrar el producto, no existe un producto con ese id"
            );
        } else {
            products.splice(prodIndex, 1);
        }

        await fs.promises.writeFile(
            this.path,
            JSON.stringify(products, null, "\t")
        );
    };

    updateProduct = async (id, campo, valor) => {
        const products = await this.getProducts();
        const prodIndex = products.findIndex((p) => p.id === id);
        if (prodIndex === -1) {
            console.log("No existe un producto con ese id");
            return "No existe un producto con ese id";
        }

        products[prodIndex][campo] = valor;

        await fs.promises.writeFile(
            this.path,
            JSON.stringify(products, null, "\t")
        );
    };
}

const producto = new ProductManagerFS();
// const obj = {
//     title: "bici",
//     description: "soy una bici",
//     price: 20,
//     imagen: "soy una img",
//     code: "abc",
//     stock: 10,
// };

// const env = async () => {
//     let products = await producto.getProducts();
//     console.log(products);

//     await producto.addProduct(
//         "bici",
//         "soy una bici",
//         20,
//         "soy una img",
//         "abc",
//         10
//     );
//     await producto.addProduct(
//         "moto",
//         "soy una moto",
//         20,
//         "soy una img",
//         "sdf",
//         10
//     );
//     await producto.addProduct(
//         "auto",
//         "soy un auto",
//         20,
//         "soy una img",
//         "jpk",
//         10
//     );
//     await producto.addProduct(
//         "bici",
//         "soy una bici",
//         20,
//         "soy una img",
//         "abc",
//         10
//     );
//     await producto.addProduct("bici", "soy una bici", 20, "soy una img", "iii");
//     await producto.addProduct("soy una bici", 20, "soy una img", "sss", 10);
//     await producto.addProduct(
//         "avion",
//         " soy un avion",
//         20,
//         "soy una img",
//         "ttt",
//         10
//     );
//     products = await producto.getProducts();
//     console.log(products);
// };
// env();

// const getP = async () => {
//     let data = await producto.getProducts()
//     console.log("me trajo get product", data)
// }
// getP()

// const getByid = async () => {
//     producto.getProductById(5)
// }
// getByid()

// const deleteP = async () => {
//     producto.deleteProduct(1);
// };
// deleteP();

// const updateP = async () => {
//     producto.updateProduct(1, "id", 15)
// }
// updateP()
