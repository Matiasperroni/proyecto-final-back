import chai from "chai";
import supertest from "supertest";
import cartModel from '../dao/models/carts.schema.js';
import mongoose from 'mongoose';
import dotenv from "dotenv"
import CartManagerDB from '../dao/mongo/carts.manager.js';

const cartManager = new CartManagerDB()

dotenv.config()
const MONGO_URL = process.env.MONGO_URL;
const connection = mongoose.connect(MONGO_URL)

// const cartRepository = new CartRepository();
const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing CARTS routes.", () => {
    it("POST petition should create a CART.", async  () => {
        const carts = await requester.post("/api/carts");
        expect(carts.status).to.equal(200);
        expect(carts.body).to.have.property('_id');
        expect(carts.body).to.have.property('products');
        expect(carts.ok).to.equal(true);
    });
    after(async() => {
        // const deleted = await cartModel.findOneAndDelete({}, { sort: { _id: -1 } })
    })

    it("POST petition should add a product to CART only if you are logged in.", async () => {
        let product = "651057722dc0424b7cc2abaa";
        let cart = "6525889b96bd30aca3f424cd"
        const request = await requester.post(`/api/carts/${cart}/product/${product}`)
        expect(request.status).to.equal(403);
        expect(request.ok).to.equal(false);
        expect(request.error.text).to.include("You must be an user to add products to cart.")
    })

    it("CART manager should create a CART, get it by ID and add a product.", async () => {
        const prodID = "651b5edb181b5eb821863234"
        const cart = await cartManager.createNewCart();
        expect(cart.products).to.be.an("array")
        expect(cart).to.have.property("_id")

        const cartGotByID = await cartManager.getCartByID(cart._id)
        expect(cartGotByID._id).to.deep.equal(cart._id)
        const cartWithProd = await cartManager.addToCart(cartGotByID._id, prodID);
        expect(cartWithProd.products[0].quantity).to.be.gt(0)
    })
});
