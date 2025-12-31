import CreateError from "http-errors";
import AllStatusCodes from "../../utils/allStatusCodes.js";
import config from "../../../config/config.js";
import ProductServices from "../../services/product/index.services.js";
import { successResponse } from "../../utils/response.js";
import { unlinkFile } from "../../utils/unlinkFile.js";
import mongoose from "mongoose";


const deleteFile = (folders, files) => {
    folders?.map(folder => {
        if (folder === "product_images") {
            files?.[folder]?.map(file => unlinkFile(file.filename, folder));
        } else {
            unlinkFile(files?.[folder]?.[0]?.filename, folder);
        }

    })
};

export const addNewProduct = async (req, res, next) => {
    try {
        // console.log("req.files:>>>>>>>>>>>>>>>>>>>>> ", req?.files);

        let updated_pro_image = "";
        let updated_pro_images = [];
        let pro_categories = [];
        if (Array.isArray(req?.body?.categories)) {
            pro_categories = [...req?.body?.categories];
        } else {
            pro_categories = Array.isArray(JSON?.parse(req?.body?.categories)) ? JSON?.parse(req?.body?.categories) : [];
        }
        if (req.files) {
            if (req?.files?.product_image) {
                updated_pro_image = `${config.app.baseUrl}:${config.app.port}/product_image/${req.files.product_image?.[0]?.filename}`;
            }
            if (req?.files?.product_images) {
                updated_pro_images = req.files?.product_images?.map(item => `${config.app.baseUrl}:${config.app.port}/product_images/${item?.filename}`);
            }
        }
        const product = await ProductServices.saveProduct({
            ...req.body,
            product_image: updated_pro_image,
            product_images: updated_pro_images,
            categories: pro_categories,
        });
        if (!product) {
            return next(CreateError(AllStatusCodes.BadRequest, "There is an error!!! Product is not able to added successfully!!!"));
        }
        successResponse(res, {
            status: AllStatusCodes.Created,
            message: "Product has been added successfully",
            payload: {
                ...product,
            }
        });
    } catch (error) {
        const folders = Object.keys(req.files);
        deleteFile(folders, req?.files);

        // Method 1: Using error name
        if (error.name === 'ValidationError') {
            // Handle validation error
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return next(CreateError(
                AllStatusCodes.BadRequest,
                `Validation failed: ${errorMessages.join(', ')}`
            ));
        }

        // Method 2: Using instanceof (if you have access to mongoose)
        if (error instanceof mongoose.Error.ValidationError) {
            // Alternative way to handle validation error
            return next(CreateError(
                AllStatusCodes.BadRequest,
                "Please provide valid product data"
            ));
        }

        // Method 3: Check for CastError (invalid ObjectId, etc.)
        if (error.name === 'CastError') {
            return next(CreateError(
                AllStatusCodes.BadRequest,
                `Invalid ${error.path}: ${error.value}`
            ));
        }

        // Handle duplicate key error
        if (error.code && error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return next(CreateError(
                AllStatusCodes.Conflict,
                `${field} already exists. Please use a different value.`
            ));
        }

        next(CreateError(AllStatusCodes.InternalServerError, error?.message));
    }
};


export const getAllProducts = async (_, res, next) => {
    try {
        const products = await ProductServices.fetchEntireProducts();
        successResponse(res, {
            status: AllStatusCodes.OK,
            message: "Product List has been fetch successfully",
            payload: {
                products,
            }
        });
    } catch (error) {
        next(CreateError(AllStatusCodes.InternalServerError, error?.message));
    }
};


export const getSingleProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await ProductServices.fetchProductById(id);
        if (!product) {
            return next(CreateError(AllStatusCodes.NotFound, `Product of given id: ${id} does not exist!!!`));
        }
        successResponse(res, {
            status: AllStatusCodes.OK,
            message: `Product of given id: ${id} has been fetched successfully`,
            payload: {
                ...product,
            },
        });
    } catch (error) {
        next(CreateError(AllStatusCodes.InternalServerError, error?.message));
    }
};


export const updateProductById = async (req, res, next) => {
    try {
        if (req.method !== "PUT" && req.method !== "PATCH") {
            return next(CreateError(AllStatusCodes.MethodNotAllowed, `${req.method} method not allowed!!!`));
        }
        const { id } = req.params;
        let updated_pro_image = "";
        let updated_pro_images = [];
        let pro_categories = [];
        if (req.body?.categories) {
            if (Array.isArray(req?.body?.categories)) {
                pro_categories = [...req?.body?.categories];
            } else {
                pro_categories = Array.isArray(JSON?.parse(req?.body?.categories)) ? JSON?.parse(req?.body?.categories) : [];
            }
        }
        if (req.files) {
            if (req?.files?.product_image) {
                updated_pro_image = `${config.app.baseUrl}:${config.app.port}/product_image/${req.files.product_image?.[0]?.filename}`;
            }
            if (req?.files?.product_images) {
                updated_pro_images = req.files?.product_images?.map(item => `${config.app.baseUrl}:${config.app.port}/product_images/${item?.filename}`);
            }
        }
        const product = await ProductServices.editProductById(req, id, {
            ...req.body,
            product_image: updated_pro_image,
            product_images: updated_pro_images,
            categories: pro_categories,
        });
        if (!product) {
            return next(CreateError(AllStatusCodes.NotFound, `Updation failed!!!, Product of given id: ${id} does not exist!!!`));
        }
        successResponse(res, {
            status: AllStatusCodes.OK,
            message: `Product of given id: ${id} has been updated successfully`,
            payload: {
                ...product,
            },
        });
    } catch (error) {
        next(CreateError(AllStatusCodes.InternalServerError, error?.message));
    }
};


export const deleteProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await ProductServices.removeProductById(id);
        if (!product) {
            return next(CreateError(AllStatusCodes.NotFound, `Deletion failed!!!, Product of given id: ${id} does not exist!!!`));
        }
        successResponse(res, {
          status: AllStatusCodes.OK,
          message: `Product of given id: ${id} has been deleted successfully`,
          payload: {
            ...product,
          },
        });
    } catch (error) {
        next(CreateError(AllStatusCodes.InternalServerError, error?.message));
    }
};