import cloudinary from "../../../Services/cloudinary.js";
import categoryModel from "../../../../DB/model/Category.model.js";

export const createCategory = async (req, res, next) => {
 const{type,description,price,quantity} = req.body;
 
  const name = req.body.name.toLowerCase();

  if (await categoryModel.findOne({ name })) {
    return next(new Error("Duplicate  Category name", { cause: 409 }));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: "mealapp/category" }
  );
  const category = await categoryModel.create({
    name,
    price,
    quantity,
    description,
    type,
    image: { secure_url, public_id },
  });
  return res.json({ message: "success", category });
};

export const updateCategory = async (req, res, next) => {
  const category = await categoryModel.findById(req.params.categoryId);
  if (!category) {
    return next(
      new Error(`invalid category id ${req.params.categoryId} `, { cause: 400 })
    );
  }
  if (req.body.name) {
    if (category.name == req.body.name) {
      return next(
        new Error(`old name matches the new name ${req.params.categoryId} `, {
          cause: 400,
        })
      );
    }
    if (await categoryModel.findOne({ name: req.body.name })) {
      return next(
        new Error(`category name already exists ${req.body.name} `, {
          cause: 400,
        })
      );
    }
    category.name = req.body.name;
    category.slug = slugify(req.body.name);
  }

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "ecommerce/category" }
    );
    await cloudinary.uploader.destroy(category.image.public_id);
    category.image = { secure_url, public_id };
  }
  category.updatedBy = req.user._id;
  await category.save();
  return res.json({ message: "success", category });
};

export const getCategory = async (req, res, next) => {
  const category = await categoryModel.findById(req.params.categoryId).populate('reviews');
  if (!category) {
    return next(
      new Error(`invalid category id ${req.params.categoryId} `, { cause: 400 })
    );

  }
  return res.json({ message: "success", category });
};
export const getAllCategories = async (req, res, next) => {
  const categories = await categoryModel.find({});
  return res.json({ message: "success", categories });
};
