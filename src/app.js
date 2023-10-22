import express from "express";
//routers
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import sessionsRouter from "./routes/sessions.routes.js";
import userRouter from "./routes/users.routes.js"

import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { ENVIRONMENT, addLogger, loggerInfo } from "./logger/logger.js";

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express';

import cookieParser from 'cookie-parser';
// Mongodb URL : "mongodb+srv://Matias-Perroni:fcKP3TXvcILtCNWu@cluster0.ymwavy3.mongodb.net/ecommerce?retryWrites=true&w=majority"

dotenv.config();
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

//instance of server
const app = express();

//middlewares for body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(addLogger);

// MongoDB connection
mongoose
    .connect(MONGO_URL)
    .then(() => console.log("Connected with MongoDB in URL " + MONGO_URL))
    .catch((err) => console.error(err));

//saving session in Mongo
app.use(
    session({
        store: new MongoStore({
            mongoUrl: MONGO_URL,
            ttl: 3600,
        }),
        secret: "Coderhouse",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(cookieParser());

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//static files
app.use(express.static(__dirname + "/public"));

//setting handlerbars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//server http
const serverHttp = app.listen(PORT, () => {
    const info = loggerInfo();
    info.info(`Listening to port: ${PORT} on environment: ${ENVIRONMENT}`);
});


//routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/sessions", sessionsRouter);
app.use("/api/users", userRouter)

app.get("/api/loggerTest", (req, res) => {
    req.logger.debug("Error debug."); //
    req.logger.http("HTTP error."); 
    req.logger.info("Info.");
    req.logger.warning("Warning."); 
    req.logger.error("Error.");
    req.logger.fatal("Fatal error.")
    res.send("Testing");
});


//documentacion swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'API documentation for ecommerce project for Coderhouse.',
            description: 'How to use the API.'
        }
    },
    apis: [`./src/docs/**/*.yaml`]
}

// creamos el specs
const specs = swaggerJSDoc(swaggerOptions);
// Declaramos swagger API - endpoint
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs));

