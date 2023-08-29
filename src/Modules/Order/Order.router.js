import { Router } from "express";
import * as OrderController from "./Controller/Order.Controller.js";
import { auth } from "../../Middleware/auth.middleware.js";

const router = Router();

router.post('/',auth(),OrderController.createOrder);
router.patch('/cancel/:orderId',auth(),OrderController.cancelOrder);

export default router;
