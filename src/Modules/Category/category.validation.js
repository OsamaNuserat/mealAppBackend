import Joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";

export const createCategory = Joi.object({
    name :Joi.string().min(2).max(20).required(),
    file:generalFeilds.file.required()
}).required();

export const updateCategory = Joi.object({
    categoryId:generalFeilds.id,
    name :Joi.string().min(2).max(20),
    file:generalFeilds.file
}).required();

export const getCategory = Joi.object({
    categoryId:generalFeilds.id
}).required();