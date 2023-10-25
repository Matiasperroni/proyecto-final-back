import { Router } from 'express';
import {isConnected} from "../middlewares/middlewares.js";
import { validateTokenRecEmail } from '../utils.js';
import { register, login, profile, landing} from "../controllers/views.controller.js"


const router = Router();


router.get('/register', isConnected, register)

router.get('/login', isConnected, login)

router.get('/current', profile)

router.get("/", landing)

router.get("/restorepass/:token", validateTokenRecEmail, (req, res) => {
    res.render('restorePass', { token: req.params.token });
  })


export default router;