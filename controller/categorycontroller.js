import categoryModels from "../models/categoryModels.js";
import slugify from "slugify";
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body || req.fields;
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
    const category = await new categoryModels({
      name,
      slug: slugify(name),
    }).save();

    return res.status(200).send({
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

//update
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body || req.fields;
    const { id } = req.params;
    const category = await categoryModels.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "category updated successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "something went wrong",
    });
  }
};

//getall

export const getAllCategoryController = async (req, res) => {
  try {
    const category = await categoryModels.find({});
    res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

//single get
export const singlecategoryController = async (req, res) => {
  try {
    const category = await categoryModels.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "get single category successfully",
      category,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(404).send({
      success: false,
      message: "single category not found",
    });
  }
};

//delete category
export const deletecategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModels.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "category deleted successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(404).send({
      success: false,
      message: "something went wrong in deleting",
    });
  }
};
