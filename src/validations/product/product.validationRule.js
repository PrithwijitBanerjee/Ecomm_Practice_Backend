import { body } from "express-validator";
// import mongoose from "mongoose";

export const validateNewProduct = () => [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("**Product name should not be empty")
        .isLength({ min: 3, max: 30 })
        .withMessage("**Product name should be atleast 3 to 31 characters long"),
    body("product_image")
        .trim()
        .optional()
        .isURL()
        .withMessage('**Product image URL is not valid'),
    body("product_images")
        .optional()
        .isArray()
        .withMessage("**Thumbnail image should be an array")
        .custom(product_images => {
            product_images?.forEach(image => {
                if (!image.match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)) {
                    throw new Error('**Each thumbnail image URL is not valid');
                }
            })
            return true;
        }),
    body("price")
        .optional()
        .isNumeric()
        .withMessage("**Price should be numeric"),
    body("categories")
        .optional()
        .isString()
        .withMessage("**Please enter valid product categories")
    // .isArray()
    // .withMessage("**Product categories should be an array")
    // .custom((categories) => {
    //     // Check if all items in array are valid MongoDB ObjectIds
    //     if (categories && categories.length > 0) {
    //         const allValid = categories.every(categoryId => {
    //             return mongoose.Types.ObjectId.isValid(categoryId);
    //         });

    //         if (!allValid) {
    //             throw new Error('**All category IDs must be valid MongoDB ObjectIds');
    //         }
    //     }
    //     return true;
    // })
    // .customSanitizer((categories) => {
    //     // Convert string IDs to ObjectIds
    //     if (categories && Array.isArray(categories)) {
    //         return categories.map(id => new mongoose.Types.ObjectId(id));
    //     }
    //     return categories;
    // })
];