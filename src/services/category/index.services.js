import { createNewCategory, editCategoryById, fetchAllCategories, fetchSingleCategoryById, removeCategoryById } from "./category.services.js";

const CategoryService = {
     createNewCategory,
     fetchAllCategories,
     fetchSingleCategoryById,
     editCategoryById,
     removeCategoryById,
};

export default CategoryService;