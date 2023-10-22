import { Router } from "express";

import {getProducts, getProductById, addProduct, updateProduct, deleteProduct, mockingProducts} from "../controllers/products.controller.js"
import { isAdminOrPremium, isUserPremiumOrAdmin } from '../middlewares/middlewares.js';
const router = Router();


router.get("/mockingproducts", isUserPremiumOrAdmin, mockingProducts)

router.get("/", isUserPremiumOrAdmin, getProducts);

router.get("/:pid", isUserPremiumOrAdmin, getProductById);

router.post("/", isAdminOrPremium,  addProduct);

router.put("/:pid", isAdminOrPremium, updateProduct);

router.delete("/:pid", isAdminOrPremium, deleteProduct);

export default router;
