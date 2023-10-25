import userModel from "../dao/models/users.schema.js";
import UserDTO from "../dto/user.dto.js";
import nodemailer from "nodemailer";
import { mailingConfig } from "../utils.js";
const transport = nodemailer.createTransport(mailingConfig);

export const changeRole = async (req, res) => {
    try {
        const userID = req.params.uid;
        const user = req.session.user;
        if (user.role === "User") {
            const userDocuments = user.documents || [];
            const requiredDocuments = ["id", "address", "account"];

            const hasAllDocuments = requiredDocuments.every(
                (requiredDocument) => {
                    return userDocuments.some((userDocument) =>
                        userDocument.name.includes(requiredDocument)
                    );
                }
            );
            if (!hasAllDocuments)
                throw new Error("User must have all documents");
        }

        let newRole;
        if (user?.role === "User") {
            newRole = "Premium";
        } else if (user?.role === "Premium") {
            newRole = "User";
        } else {
            res.status(404).send("User not found");
        }
        if (newRole === "User" || newRole === "Premium") {
            const updatedUser = await userModel.findByIdAndUpdate(
                userID,
                { role: newRole },
                { new: true }
            );
            if (updatedUser) {
                res.status(200).send(updatedUser);
            } else {
                res.status(404).send("User not found.");
            }
        } else {
            res.status(400).send("Invalid role.");
        }
    } catch (error) {
        req.logger.error(`Internal error changing role. ${error}`);
        res.status(500).send(`Internal error changing role. ${error}`);
    }
};

export const addDocuments = async (req, res) => {
    //nota aca setear req.session.user.email con algun email o la cookie en postman
    try {
        // const user = await userModel.findOne({ email: "INSERTAR EMAIL PARA TESTEAR O SETEAR COOKIE EN POSTMAN" });

        const user = await userModel.findOne({ email: req.session.user.email });
        const documents = user.documents || [];
        let userUpdated;
        if (req.files) {
            const newDocuments = [
                ...documents,
                ...req.files.map((file) => ({
                    name: file.originalname,
                    reference: file.path,
                })),
            ];
            userUpdated = await user.updateOne({ documents: newDocuments });
        }

        res.status(200).send({ message: "Files updated.", userUpdated });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        //aca filto los que no esten inactivos.
        const users = await userModel.find({ inactive: false });
        const usersDTO = [];
        Object.entries(users).forEach((user) => {
            let userNew = new UserDTO(user[1]);
            usersDTO.push(userNew);
        });
        res.status(200).send(usersDTO);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const sendEmail = (usersArray) => {
    usersArray.forEach((user) => {
        transport.sendMail({
            from: `Admin <${mailingConfig.auth.user}>`,
            to: user.email,
            subject: "Your account has been deleted for inactivity.",
            html: `<h1>You have not logged in more than two weeks, your account has been deleted.</h1>
        `,
        });
    });
};

// en lugar de eliminar los usuarios de la bd los marco con un campo "inactive"
export const deleteInactiveUsers = async (req, res) => {
    try {
        const currentDate = new Date();
        const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;
        // const checkUsers = await userModel.find({last_connection: {$lt: currentDate - 30}})
        const updateUsers = await userModel.updateMany(
            { last_connection: { $lt: currentDate - twoDaysInMilliseconds } },
            { $set: { inactive: true } }
        );
        const inactiveUsers = await userModel.find({ inactive: true });
        sendEmail(inactiveUsers);
        res.status(200).send(inactiveUsers);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};

export const admin = (req, res) => {
    res.render("admin");
};

export const getUserByEmail = async (req, res) => {
    try {
        const userEmail = req.params.email;
        const user = await userModel.find({ email: userEmail });
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};

export const deleteUserByEmail = async (req, res) => {
    try {
        const userEmail = req.params.email;
        const deleted = await userModel.findOneAndDelete({ email: userEmail });
        if (!deleted) {
            res.status(404).send("Cannot find user.");
        } else {
            res.status(200).send(deleted);
        }
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};

export const changeRoleByEmail = async (req, res) => {
    try {
        const userEmail = req.params.email;
        const user = await userModel.findOne({ email: userEmail });
        if (user.role === "Premium") {
            user.role = "User";
            user.save();
            res.status(200).send("role changed to User!");
        } else if (user.role === "User") {
            user.role = "Premium";
            user.save();
            res.status(200).send("role changed to Premium!");
        } else {
            res.send("Cannot change Admin role.");
        }
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};
