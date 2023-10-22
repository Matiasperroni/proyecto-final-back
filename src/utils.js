import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
dotenv.config();

export const PRIVATE_KEY = process.env.PRIVATE_KEY;

export const mailingConfig = {
    service: process.env.MAIL_SERVICE,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS,
    },
    baseUrl: "localhost"
}
export const createHash = (password) =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (user, password) =>
    bcrypt.compareSync(password, user.password);



export const validateToken = (req, res, next) => {
    const token = req.user;
    jwt.verify(token, PRIVATE_KEY)
    const data = jwt.decode(token)
    // console.log(data)
    req.user = data.email
    next()
}

export const generateToken = (email) => {
    const token = jwt.sign({ email }, PRIVATE_KEY, {
        expiresIn: "1h",
    });
    return token;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
