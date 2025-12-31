import AllStatusCodes from "./allStatusCodes.js";

export const successResponse = (res, { status = AllStatusCodes.OK, message = "Data has been sent successfully", payload = {} }) => {
    res.status(status).json({
        success: true,
        message,
        payload,
    });
};

export const errorResponse = (res, { status = AllStatusCodes.InternalServerError, message = "Internal Server Error!!!" }) => {
    res.status(status).json({
        success: false,
        message,
    });
};