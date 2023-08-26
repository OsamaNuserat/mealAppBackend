import { Router } from "express";
import * as AuthController from "./controller/Auth.controller.js";
import validation from "../../Middleware/validation.js";
import * as validators from "./Auth.validation.js";
const router = Router();

router.post(
  "/signup",
  validation(validators.signupSchema),
  AuthController.signup
);

router.post("/login", validation(validators.loginSchema), AuthController.login);

router.get(
  "/confirmEmail/:token",
  validation(validators.confirmEmail),
  AuthController.confirmEmail
);

router.get("/NewconfirmEmail/:token", AuthController.NewconfirmEmail);

router.patch(
  "/sendcode",
  validation(validators.sendcode),
  AuthController.sendcode
);

router.patch(
  "/forgetpassword/:email",
  validation(validators.forgetpassword),
  AuthController.forgetpassword
);

export default router;
