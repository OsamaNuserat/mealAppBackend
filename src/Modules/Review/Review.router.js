import { Router } from "express";
import * as ReviewController from "./Controller/Review.Controller.js";
import { auth } from "../../Middleware/auth.middleware.js";

const router = Router();

router.post('/:categoryId',auth(),ReviewController.createReview);

export default router;
