import { Router } from "express";
import * as CartController from "./Controller/Cart.controller.js";
import * as validators from "./cart.validation.js";
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { asyncHandler } from "../../Services/errorHandling.js";

const router = Router();

router.post('/:productId',auth(),validation(validators.createCart),asyncHandler(CartController.createCart));

export default router;
