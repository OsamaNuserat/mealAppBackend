import Joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";

export const createCart = Joi.object({
    categoryId:generalFeilds.id
}).required();

export const updateCart = Joi.object({
    categoryId:generalFeilds.id,
    name :Joi.string().min(2).max(20),
    file:generalFeilds.file
}).required();

export const getCart = Joi.object({
    categoryId:generalFeilds.id
}).required();