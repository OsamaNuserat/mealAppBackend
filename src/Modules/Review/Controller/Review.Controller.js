import orderModel from "../../../../DB/model/Order.model.js";
import reviewModel from "../../../../DB/model/Review.model.js";
import { asyncHandler } from "../../../Services/errorHandling.js";

export const createReview = asyncHandler(async (req, res,next) => { 
    const {categoryId} = req.params;
    const {comment,rating} = req.body;
    const order = await orderModel.findOne({userId:req.user._id,Products:{$elemMatch:{categoryId}}});
    if(!order) {
        return next(new Error("product not found"),{cause:400});
    }
    const checkReview = await reviewModel.findOne({orderId:order._id,categoryId});
    if(checkReview) {
        return next(new Error("review already exist"),{cause:400});
    }
    const review = await reviewModel.create({
        comment,
        rating,
        categoryId,
        createdBy:req.user._id,
        orderId:order._id
    })
    return res.status(201).json({message:"success",review});
})

