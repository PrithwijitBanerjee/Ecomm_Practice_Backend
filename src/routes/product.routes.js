import express from "express";
import upload from "../uploads/fileUploads.js";
import ProductController from "../controllers/product/index.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import ProductValidation from "../validations/product/index.validationRule.js";
import sanitizeReq from "../middlewares/sanitization.middleware.js";

const ProductRouter = express.Router({
    caseSensitive: true,
});

ProductRouter
    .get("/list", ProductController.getAllProducts)
    .get("/list/:id", ProductController.getSingleProductById)

    .use(isLoggedIn)
    .delete("/del/:id", ProductController.deleteProductById)
    /** ... file upload middleware ... **/
    .use(upload.fields([{ name: "product_image", maxCount: 1 }, { name: "product_images", maxCount: 3 }]))
    .post("/add", ProductValidation.validateNewProduct(), sanitizeReq, ProductController.addNewProduct)
    .all("/edit/:id", ProductController.updateProductById);

export default ProductRouter;