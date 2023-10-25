import UserDTO from "../dto/user.dto.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import userModel from "../dao/models/users.schema.js";
import {
    mailingConfig,
    generateToken,
    validatePassword,
    createHash,
} from "../utils.js";

const transport = nodemailer.createTransport(mailingConfig);

export const registerSession = async (req, res) => {
    res.status(200).redirect("/login");
};

export const failedRegister = (req, res) => {
    res.status(400).send({ status: "error", error: "Registry fail" });
};

export const loginSession = async (req, res) => {
    if (!req.user)
        return res
            .status(400)
            .send({ status: "error", error: "Incorrect credentials" });
    let user = new UserDTO(req.user);
    req.session.user = user;
    res.send({
        status: "success",
        payload: req.session.user,
        message: "You logged in.",
    });
};

export const failedLogin = (req, res) => {
    res.status(400).send({ status: "error", error: "Login fail" });
};

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res
                .status(500)
                .send({ status: "error", error: "Couldn´t logout." });
        }
        res.redirect("/login");
    });
};

export const githubCallback = (req, res) => {
    req.session.user = req.user;
    res.redirect("/current");
};

export const sendEmail = (req, res) => {
    try {
        const email = req.params.email;
        const jwt = generateToken(email);
        transport.sendMail({
            from: `Coder <${mailingConfig.auth.user}>`,
            to: email,
            subject: "Recover password",
            html: `<h1>This is an email to recover your password, if you havent requested it ignore this message.</h1>
                        <hr>
                        <a href="http://localhost:8080/restorepass/${jwt}">CLICK HERE</a>
                    `,
        });

        res.send(
            "An email has been send to you, verify your inbox to recover your password."
        );
    } catch (error) {
        req.logger.error(`Internal error sending email. ${error}`);
        res.status(500).send(`Internal server error. ${error}`);
    }
};

export const changePassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const data = jwt.decode(token);
        const email = data.email;

        const user = await userModel.findOne({ email });
        if (!user) {
            req.logger.error("User not found");
            res.status(404).send("User not found");
        }

        if (validatePassword(user, newPassword)) {
            req.logger.info("The password must be different.");
            res.status(400).send(
                "Your password can´t be one that you used before."
            );
            return;
        }

        const hashedNewPassword = createHash(newPassword);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).send("Your password has been changed.");
    } catch (error) {
        req.logger.error(`Error changing password. ${error}`);
        res.status(500).send(`Server error. ${error}`);
    }
};

export const getCartFromUser = async (req, res) => {
    const cart = req.session.user.cart;
    res.send({cart});
};


export const setLastConnection = async (email) =>{
    try {
        const user = await userModel.findOne({ email });
        if( !user ) throw new Error('Server error logging in');
        const updated = await user.updateOne({ last_connection: new Date() })
    } catch (e) {
        throw new Error(e);
    }
}