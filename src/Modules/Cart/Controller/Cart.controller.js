import cartModel from "../../../../DB/model/Cart.model.js";

export const createCart = async (req, res, next) => { 
const {productId} = req.params;
const product = await cartModel.findById(productId);
return res.json(product)

if(!product) {
return next(new Error("product not found"),{cause:400});
}



const cart = await cartModel.findOne({userId:req.user._id});
if(!cart) {
const newCart = await cartModel.create({
userId:req.user._id,
Products:[{productId,qty}]
});

return res.status(201).json({message:"success",cart});
}
}
