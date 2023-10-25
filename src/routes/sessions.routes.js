import { Router } from "express";
import passport from "passport";

import {
    registerSession,
    failedRegister,
    loginSession,
    failedLogin,
    logout,
    githubCallback,
    sendEmail,
    changePassword,
    getCartFromUser,
} from "../controllers/sessions.controller.js";
import { validateTokenRecEmail, validateToken } from "../utils.js";
import { setLastConnectionMiddleware } from "../middlewares/middlewares.js";

const router = Router();

router.post(
    "/register",
    passport.authenticate("register", {
        failureRedirect: "/sessions/failregister",
    }),
    registerSession
);

router.get("/failregister", failedRegister);

router.post(
    "/login",
    passport.authenticate("login", {
        session: false,
        failureRedirect: "/sessions/faillogin",
    }),
    validateToken,
    setLastConnectionMiddleware,
    loginSession
);

router.get("/faillogin", failedLogin);

router.get("/logout", setLastConnectionMiddleware, logout);

router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => {}
);

router.get("/getusercart", getCartFromUser);

router.get(
    "/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    githubCallback
);

router.get("/recoveremail/:email", sendEmail);

router.post("/changepassword/:token", validateTokenRecEmail, changePassword);

export default router;
