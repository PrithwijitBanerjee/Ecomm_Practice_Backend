import express from "express";
import CategoryController from "../controllers/category/index.controller.js";

const CategoryRouter = express.Router({
    caseSensitive: true,
});

CategoryRouter
    .post("/add", CategoryController.addCategory)
    .get("/get", CategoryController.getAllCategory)
    .get("/get/:id", CategoryController.getCategoryById)
    .delete("/del/:id", CategoryController.deleteCategoryById)
    .all("/update/:id", CategoryController.updateCategoryById);

export default CategoryRouter;