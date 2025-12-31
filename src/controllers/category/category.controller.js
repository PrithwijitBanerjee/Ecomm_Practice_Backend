import CreateError from "http-errors";
import AllStatusCodes from "../../utils/allStatusCodes.js";
import CategoryService from "../../services/category/index.services.js";
import { successResponse } from "../../utils/response.js";

export const addCategory = async (req, res, next) => {
    try {
        const category = await CategoryService.createNewCategory(req.body);
        if (!category) {
            return next(CreateError(AllStatusCodes.BadRequest, "Something went wrong!!! Category Not Added!!!"));
        }
        successResponse(res, {
            status: AllStatusCodes.Created,
            message: "Category was added successfully",
            payload: {
                ...category?._doc,
            },
        });
    } catch (error) {
        next(CreateError(AllStatusCodes.InternalServerError, "Internal Server Error!!!"));
    }
};

export const getAllCategory = async (_, res, next) => {
    try {
        const categories = await CategoryService.fetchAllCategories();
        successResponse(res, {
            status: AllStatusCodes.OK,
            message: "Category list has been fetched successfully",
            payload: {
                categories,
            },
        });
    } catch (error) {
        next(CreateError(AllStatusCodes.InternalServerError, "Internal Server Error!!!"));
    }
};


export const getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await CategoryService.fetchSingleCategoryById(id);
        if (!category) {
            return next(CreateError(AllStatusCodes.NotFound, `Category of given id: ${id} does not exist!!!`));
        }
        successResponse(res, {
            status: AllStatusCodes.OK,
            message: `category of given id: ${id} has been fetched successfully`,
            payload: {
                ...category,
            },
        });
    } catch (error) {
        next(CreateError(AllStatusCodes.InternalServerError, "Internal Server Error!!!"));
    }
};

export const updateCategoryById = async (req, res, next) => {
    try {
        if(req.method !== "PUT" && req.method !== "PATCH") {
            return next(CreateError(AllStatusCodes.MethodNotAllowed, `${ree.method} method not allowed!!!`));
        }
        const {id} = req.params;
        const categoryData = await CategoryService.editCategoryById(req.body, id);
        if(!categoryData) {
            return next(CreateError(AllStatusCodes.NotFound, `Updation failed!!! Category of given id: ${id} does not exist!!!`));
        }
        successResponse(res, {
            status: AllStatusCodes.OK,
            message: `Category of given id: ${id} has been updated successfully`,
            payload: {
                ...categoryData,
            }
        });
    } catch (error) {
      next(CreateError(AllStatusCodes.InternalServerError, "Internal Server Error!!!"));
    }
};


export const deleteCategoryById = async (req, res, next) => {
     try {
         const {id} = req.params;
         const {remove, message, deletedCategory, status} = await CategoryService.removeCategoryById(id);
         
         if(!remove) {
            return  next(CreateError(status, message));
         }
         successResponse(res, {
            status,
            message: `Category of id: ${id} has been deleted successfully`,
            payload: {
                ...deletedCategory,
            },
         });
     } catch(error) {
       next(CreateError(AllStatusCodes.InternalServerError, "Internal Server Error!!!"));
     }
};