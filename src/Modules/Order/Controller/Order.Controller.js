import cartModel from "../../../../DB/model/Cart.model.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import orderModel from "../../../../DB/model/Order.model.js";
import { asyncHandler } from "../../../Services/errorHandling.js";

export const createOrder = asyncHandler(async (req, res,next) => { 

    const {Products,address,phonenumber,paymentMethod} = req.body;
    const finalProductList = [];
    let total = 0;
    for(const product of Products) { 
        const checkProduct = await categoryModel.findById(product.categoryId);
        if(!checkProduct) {
            return next(new Error("product not found"),{cause:400});
        }
        total += checkProduct.price * product.qty;
        finalProductList.push(product);
    }
    const order = await orderModel.create ({
        userId:req.user._id,
        Products:finalProductList,
        address,
        phonenumber,
        paymentMethod,
        total,
        status : ( paymentMethod === "cash" ) ? "pending" : "approved"
    })

    for(const product of Products) {
        await categoryModel.updateOne({_id:product.categoryId},{$inc:{qty:-product.qty}});
    }
    await cartModel.updateOne({userId:req.user._id},{
        $pull:{ 
            Products:{
                categoryId:{$in:Products.categoryId}
            }
        }
    })
    return res.status(201).json({message:"success",order});
});

// export const createOrderWithAllItemsInCart = asyncHandler(async (req, res) => { 
//     const {address,phonenumber,paymentMethod} = req.body;
//     const cart = await cartModel.findOne({userId:req.user._id});
//     if(!cart?.Products?.length) {
//         return next(new Error("cart is empty"),{cause:400});
//     }
//     req.body.Products = cart.Products;
//     const finalProductList = [];
//     let total = 0;
//     for(const product of req.body.Products) {
//         const checkProduct = await categoryModel.findOne({
//             _id:product.categoryId,
//             qty:{$gte:product.qty}
//         });
//         if(!checkProduct) {
//             return next(new Error("product not found"),{cause:400});
//         }
//         total += checkProduct.price * product.qty;
//         finalProductList.push(product);
//     }
// })

export const cancelOrder = asyncHandler(async (req, res,next) => { 
    const {orderId} = req.params;
    const {reasonReject} = req.body;
    const order = await orderModel.findOne({_id:orderId,userId:req.user._id});
    if(!order || order.status!='pending' || order.paymentMethod === "card") {
        return next(new Error("Cannot Cancel this order"),{cause:400});
    }
    await orderModel.updateOne({_id:orderId},{status:"cancelled",reasonReject});
    return res.status(201).json({message:"success"});
})