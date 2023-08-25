import { Router } from "express";
import * as CategoryController from "./Controller/category.controller.js";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as validators from "./category.validation.js";
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";

const router = Router();

router.post(
  "/",
  auth(),
  fileUpload(fileValidation.image).single("image"),
//   validation(validators.createCategory),
  CategoryController.createCategory
);
router.put(
  "/:categoryId",
  auth(),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.updateCategory),
  CategoryController.updateCategory
);
router.get(
  "/:categoryId",
  validation(validators.getCategory),
  CategoryController.getCategory
);
router.get("/",CategoryController.getAllCategories);

export default router;
