import passport from "passport";
import local from "passport-local";

import userModel from "../dao/models/users.schema.js";
import CartManagerDB from "../dao/mongo/carts.manager.js";

import jwt from "passport-jwt";
import {
    createHash,
    validatePassword,
    generateToken,
    PRIVATE_KEY,
} from "../utils.js";
import GitHubStrategy from "passport-github2";

const cartManager = new CartManagerDB();
// let url = "http://http://localhost:8080/sessions/githubcallback"

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const LocalStrategy = local.Strategy;

const cookieExtractor = (req) => {
    let token;
    if (req && req.cookies) {
        return (token = req?.cookies["login-cookie"]);
    }
    return token;
};

const initializePassport = () => {
    passport.use(
        "current",
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
                secretOrKey: PRIVATE_KEY,
            },
            async (jwt_payload, done) => {
                try {
                    return done(null, jwt_payload);
                } catch (error) {
                    done(error);
                }
            }
        )
    );

    passport.use(
        "register",
        new LocalStrategy(
            {
                usernameField: "email",
                passReqToCallback: true,
            },
            async (req, username, password, done) => {
                const cart = await cartManager.createNewCart();
                const { first_name, last_name, email, age } = req.body;
                try {
                    let user = await userModel.findOne({ email: username });
                    if (user) return done(null, false);
                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        cart,
                        last_connection: new Date(),
                    };
                    user = await userModel.create(newUser);
                    return done(null, user);
                } catch (error) {
                    return done({ message: "Error creating user" });
                }
            }
        )
    );

    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "email" },
            async (username, password, done) => {
                try {
                    const user = await userModel.findOne({ email: username });
                    if (!user) {
                        return done(null, false, { message: "User not found" });
                    } else if(user.inactive === true) {
                        return done(null, false, {message: "User deleted because of inactivity"})
                    }
                    if (!validatePassword(user, password)) {
                        {
                            return done(null, false);
                        }
                    }
                    const jwt = generateToken(user);
                    return done(null, jwt);
                } catch (error) {
                    return done({ message: "Error logging in" });
                }
            }
        )
    );

    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: "Iv1.827f68d0ed74f990",
                clientSecret: "5df96c88fe5ab66b92926813503665418c942c0e",
                callbackURL: "http://localhost:8080/sessions/githubcallback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await userModel.findOne({
                        email: profile._json.email,
                    });
                    if (user) return done(null, user);
                    const newUser = {
                        first_name: profile._json.name,
                        githubProfile: profile._json.html_url,
                        last_name: "",
                        email: profile._json.email,
                        age: 18,
                        password: "",
                    };
                    user = userModel.create(newUser);
                    return done(null, false);
                } catch (error) {
                    return done({ message: "Error creating user." });
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (_id, done) => {
        try {
            const user = await userModel.findOne({ _id });
            return done(null, user);
        } catch {
            return done({ message: "Error deserializing user" });
        }
    });
};

export default initializePassport;
