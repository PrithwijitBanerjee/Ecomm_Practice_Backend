import { validationResult } from "express-validator";
import CreateError from "http-errors";
import AllStatusCodes from "../utils/allStatusCodes.js";
import { unlinkFile } from "../utils/unlinkFile.js";


/** Define the custom middleware to apply the sanitization the req objects based on validation rules **/
const sanitizeReq = (req, res, next) => {
    // console.log("req.files>>>>> ", req.files);

    const errors = validationResult(req);
    // console.log("errors:>>>>>> ", errors);
    const errMsg = errors.array()[0]?.msg;
    // console.log("errMsg:>>>>>> ", errMsg);
    if (!errors.isEmpty()) {
        if (req.files) {
            if (req.files?.product_image && req.files?.product_image?.length > 0) {
                unlinkFile(req.files?.product_image?.[0]?.filename, "product_image");
            }
            if (req.files?.product_images && req.files?.product_images?.length > 0) {
                req.files?.product_images?.map(file => unlinkFile(file?.filename, "product_images"));
            }
        }
        return next(CreateError(AllStatusCodes.UnprocessableEntity, errMsg)); // 422 status code represents user validation related errors (UnprocessableEntity)
    }
    next();
};

export default sanitizeReq;