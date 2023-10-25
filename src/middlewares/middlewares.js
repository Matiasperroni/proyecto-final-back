import { setLastConnection } from "../controllers/sessions.controller.js";

export const isConnected = (req, res, next) => {
    if (req.session.user) return res.redirect("/api/products");
    next();
};

export const isDisconnected = (req, res, next) => {
    if (!req.session.user) return res.redirect("/login");
    next();
};

export const isAdminOrPremium = (req, res, next) => {
    const user = req.session.user;
    if (user?.role === "Admin" || user?.role === "Premium") {
        next();
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
};

export const isUserPremiumOrAdmin = (req, res, next) => {
    const user = req.session.user;
    if (!user) res.status(401).redirect("/login");
    if (
        user?.role === "Admin" ||
        user?.role === "Premium" ||
        user?.role === "User"
    ) {
        next();
    }
};

export const isUserAvailableToAddToCart = (req, res, next) => {
    if (
        req?.session.user?.role === "User" ||
        req?.session.user?.role === "Premium"
    ) {
        next();
    } else {
        return res
            .status(403)
            .send({ error: "You must be an user to add products to cart." });
    }
};

export const setLastConnectionMiddleware = async (req, res, next) => {
    const email = req?.session?.user?.email || req.user.email;
    await setLastConnection(email);
    next();
};

export const isAdmin = (req, res, next) => {
    if(req.session.user.role === "Admin") {
        next()
    } else {
        res.status(403).send("You must be Admin.")
    }
}