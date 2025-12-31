import mongoose from "mongoose";
import CategoryModel from "../../models/category.models.js";
import AllStatusCodes from "../../utils/allStatusCodes.js";

export const createNewCategory = async categoryData => {
    try {
        const categoryDoc = new CategoryModel({
            ...categoryData,
        });
        return await categoryDoc?.save();
    } catch (error) {
        throw new Error(error);
    }
};

export const fetchAllCategories = async () => {
    try {
        const categories = await CategoryModel.aggregate([
            {
                $graphLookup: {
                    from: "categories",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "parentCategory",
                    as: "subcategories",
                    depthField: "depth",
                }
            },
            {
                $match: {
                    parentCategory: null // Get only root categories
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    subcategories: 1,
                    createdAt: 1,
                    updatedAt: 1,
                }
            }
        ]);
        return categories;
    } catch (error) {
        throw new Error(error);
    }
};

export const fetchSingleCategoryById = async categoryId => {
    try {
        const category = await CategoryModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(categoryId),
                }
            },
            {
                $graphLookup: {
                    from: "categories",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "parentCategory",
                    as: "subcategories",
                    depthField: "depth",
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    subcategories: 1,
                    createdAt: 1,
                    updatedAt: 1,
                }
            },
        ]);

        // console.log("category: ", category);

        return category?.[0];
    } catch (error) {
        throw new Error(error);
    }
};

export const editCategoryById = async (categoryData, id) => {
    try {
        const updatedCategoryData = await CategoryModel.findByIdAndUpdate(id, {
            ...categoryData,
        }, {
            new: true,
        });
        return updatedCategoryData?._doc;
    } catch (error) {
        throw new Error(error);
    }
};


export const removeCategoryById = async categoryId => {
      try {
          const categories = await fetchSingleCategoryById(categoryId);
          if(!categories) {
            return {
                status: AllStatusCodes.NotFound,
                remove: false,
                message: `Deletion failed!!!, Category of given id: ${categoryId} does not exist!!!`,
             };
          }
          if(categories && categories?.subcategories?.length > 0) {
             return {
                status: AllStatusCodes.Conflict,
                remove: false,
                message: `Could not delete this Category: ${categoryId} as it has sub categories. First remove all descendent categories to remove this category!!!`,
             };
          }
          const deletedCategory = await CategoryModel.findOneAndDelete({
              _id: categoryId,
          });
          return {
            status: AllStatusCodes.OK,
            remove: true,
            deletedCategory: deletedCategory?._doc,
          };
      } catch (error) {
        throw new Error(error);
      }
};