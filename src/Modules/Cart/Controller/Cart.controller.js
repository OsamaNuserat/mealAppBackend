import cartModel from "../../../../DB/model/Cart.model.js";
import categoryModel from "../../../../DB/model/Category.model.js";

export const createCart = async (req, res, next) => {
  const { categoryId, qty } = req.params;
  const product = await categoryModel.findById(categoryId);

  if (!product) {
    return next(new Error("product not found"), { cause: 400 });
  }

  if (product.qty < qty) {
    return next(new Error("product qty not available"), { cause: 400 });
  }

  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) {
    const newCart = await cartModel.create({
      userId: req.user._id,
      Products: [{ categoryId, qty: +qty }],
    });
    return res.status(201).json({ message: "success", newCart });
  }

  let matchedProducts = false;
  for (let i = 0; i < cart.Products.length; i++) {
    if (cart.Products[i].categoryId.toString() === categoryId) {
      cart.Products[i].qty += +qty;
      if (cart.products[i].qty === 0) {
        cart.products = cart.products.filter(
          (product) => product.categoryId.toString() !== categoryId
        );
      } 

      matchedProducts = true;
      break;
    }
  }

  if (!matchedProducts) {
    cart.Products.push({ categoryId, qty });
  }
  await cart.save();
  return res.status(201).json({ message: "success", cart });
};

export const getCart = async (req, res, next) => {
  const cart = await cartModel
    .findOne({ userId: req.user._id })
    .populate("Products.categoryId");
  return res.status(200).json({ message: "success", cart });
};
