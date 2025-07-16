import categoryModels from "../models/categoryModels.js";
import slugify from "slugify";
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "name is required",
      });
    }
    const existingCategory = await categoryModels.findOne({ name });
    if (existingCategory) {
      return res.status(400).send({
        success: false,
        message: "category already exist",
      });
    }
    const category = await categoryModels({ name, slug: slugify(name) }).save();
    res.status(200).send({
      success: true,
      message: "new category created",
      category,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send({
      success: false,
      message: "error in category",
    });
  }
};
