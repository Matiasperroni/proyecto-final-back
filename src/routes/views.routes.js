import { Router } from 'express';
import {isConnected, isUserPremiumOrAdmin} from "../middlewares/middlewares.js";
import { validateToken } from '../utils.js';
import { register, login, profile, landing} from "../controllers/views.controller.js"


const router = Router();


router.get('/register', isConnected, register)

router.get('/login', isConnected, login)

router.get('/current', profile)

router.get("/", landing)

router.get("/restorepass/:token", validateToken, (req, res) => {
    res.render('restorePass', { token: req.params.token });
  })


export default router;