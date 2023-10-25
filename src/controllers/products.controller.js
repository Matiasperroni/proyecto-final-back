import productsModel from "../dao/models/products.schema.js";
import { productRepository } from "../repositories/index.js";
import { faker } from "@faker-js/faker";
import nodemailer from "nodemailer"
import { mailingConfig } from '../utils.js';
import CustomError from "../utils/errors/CustomError.js";
import {
    addProductError,
    productError,
} from "../utils/errors/errorInformation.js";
import EErrors from "../utils/errors/Enum.js";
const transport = nodemailer.createTransport(mailingConfig);

export const getProducts = async (req, res) => {
    try {
        const { page, query, limit, order } = req.query;
        let sortBy;
        if (order === "desc") {
            sortBy = -1;
        } else if (order === "asc") {
            sortBy = 1;
        }
        let products;
        if (!query) {
            products = await productsModel.paginate(
                {},
                {
                    limit: limit ?? 3,
                    lean: true,
                    page: page ?? 1,
                    sort: { price: sortBy },
                }
            );
        } else {
            products = await productsModel.paginate(
                { category: query },
                {
                    limit: limit ?? 3,
                    lean: true,
                    page: page ?? 1,
                    sort: { price: sortBy },
                }
            );
        }
        res.render("products", {
            products,
            query,
            order,
            user: req.session.user,
        });
    } catch (error) {
        req.logger.error(`Server error getting products ${error}`);
        res.status(500).send("Error");
    }
};

export const getProductById = async (req, res) => {
    try {
        const pID = req.params.pid;
        const pFound = await productRepository.getProductById(pID);
        if (!pFound) {
            CustomError.createError({
                name: "Request error",
                cause: productError(pID),
                code: EErrors.ROUTING_ERROR,
                message: "Could not get product with this id",
            });
        }
        res.send(pFound);
    } catch (error) {
        req.logger.error(
            `Server error getting products by id ${error}`
        );
        res.status(500).send("Error");
    }
};

export const mockingProducts = async (req, res) => {
    const mockProducts = [];
    const product = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.number.int({ min: 0, max: 50 }),
        category: faker.commerce.productAdjective(),
        thumbnails: [],
        code: faker.string.uuid(),
    };

    for (let i = 0; i < 100; i++) {
        mockProducts.push(product);
    }

    res.send(mockProducts);
};

export const addProduct = async (req, res) => {
    //todo agregar una vista que permita agregar productos a un admin o premium y asi se agregue su email como owner directamente
    const product = req.body;
    const addedProduct = await productRepository.addProduct(product);
    if (!addedProduct) {
        CustomError.createError({
            name: "Request error",
            cause: addProductError(),
            code: EErrors.ROUTING_ERROR,
            message: "Could not add product",
        });
    }
    res.send({ status: "success", addedProduct });
};

export const updateProduct = async (req, res) => {
    const prodID = req.params.pid;
    const prodToAdd = req.body;
    const user = req.session.user;
    let prodToUpdate;
    if (user.role === "Admin" || user.email === prodToAdd.owner) {
        prodToUpdate = await productRepository.updateProduct(prodID, prodToAdd);
    } else {
        CustomError.createError({
            name: "Request error",
            cause: addProductError(),
            code: EErrors.ROUTING_ERROR,
            message: "Could not update product, you must be Admin or it has to be your product to update.",
        });
    }
    res.send(prodToUpdate);
};

export const deleteProduct = async (req, res) => {
    try {
        const prodID = req.params.pid;
        const user = req.session.user;
        const prodToDelete = await productRepository.getProductById(prodID);
        if (user.role === "Admin" || user.email === prodToDelete.owner) {
            await productRepository.deleteProduct(prodID);
        } else {
            CustomError.createError({
                name: "Request error",
                cause: productError(),
                code: EErrors.ROUTING_ERROR,
                message: "Could not delete product",
            });
        }
        if(user.role === "Premium" && prodToDelete.owner) {
            transport.sendMail({
                from: `Admin <${mailingConfig.auth.user}>`,
                to: prodToDelete.owner,
                subject: "One of your products has been deleted.",
                html: `<h1>Your product ${prodToDelete.title} with the id: ${prodToDelete._id} has been deleted, please reach us if it was not deleted by you.</h1>
            `,
            })
        }
        res.status(200).send(prodToDelete);
    } catch (error) {
        req.logger.error(`Server error deleting products ${error}`);
        res.status(500).send("Error getting data.");
    }
};
