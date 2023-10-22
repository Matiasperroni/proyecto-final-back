import winston from "winston";
import dotenv from "dotenv";

dotenv.config();

export const ENVIRONMENT = process.env.NODE_ENV;

const logLevels = {
    debug: 5,
    http: 4,
    info: 3,
    warning: 2,
    error: 1,
    fatal: 0,
};

const logColors = {
    debug: "blue",
    http: "green",
    info: "cyan",
    warning: "yellow",
    error: "red",
    fatal: "magenta",
};

const devLogger = winston.createLogger({
    levels: logLevels,
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
    ),
    transports: [new winston.transports.Console({ level: "debug" })],
});

const prodLogger = winston.createLogger({
    levels: logLevels,
    format: winston.format.combine(
        winston.format.colorize({ all: true }), 
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({ level: "debug" }),
        new winston.transports.File({
            filename: "./error.log",
            level: "error",
        }),
    ],
});

export const addLogger = (req, res, next) => {
    switch (ENVIRONMENT) {
        case "developer":
            req.logger = devLogger;
            break;
        case "production":
            req.logger = prodLogger;
            break;
        default:
            req.logger = devLogger;
    }
    req.logger.http(
        `${req.method} en ${
            req.url
        } - ${new Date().toLocaleDateString()} en ambiente ${ENVIRONMENT}`
    );
    next();
};

export const loggerInfo = () => {
    switch (ENVIRONMENT) {
        case "developer":
            return devLogger;
        case "production":
            return prodLogger;
        default:
            return devLogger;
    }
};

winston.addColors(logColors);
