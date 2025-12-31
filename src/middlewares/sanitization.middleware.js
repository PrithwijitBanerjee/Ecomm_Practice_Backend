import { validationResult } from "express-validator";
import CreateError from "http-errors";
import AllStatusCodes from "../utils/allStatusCodes.js";


/** Define the custom middleware to apply the sanitization the req objects based on validation rules **/
const sanitizeReq = (req, res, next) => {
    const errors = validationResult(req);
    // console.log("errors:>>>>>> ", errors);
    const errMsg = errors.array()[0]?.msg;
    // console.log("errMsg:>>>>>> ", errMsg);
    if (!errors.isEmpty()) {
        return next(CreateError(AllStatusCodes.UnprocessableEntity, errMsg)); // 422 status code represents user validation related errors (UnprocessableEntity)
    }
    next();
};

export default sanitizeReq;