import { Router } from "express";
import * as CartController from "./Controller/Cart.controller.js";
import * as validators from "./cart.validation.js";
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { asyncHandler } from "../../Services/errorHandling.js";

const router = Router();

router.post('/',auth(),asyncHandler(CartController.createCart));
router.get('/',auth(),asyncHandler(CartController.getCart));
export default router;
