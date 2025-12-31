import jwt from "jsonwebtoken";
import CreateError from "http-errors";
import AllStatusCodes from "../utils/allStatusCodes.js";
import config from "../../config/config.js";

export const isLoggedIn = async (req, res, next) => {
    try {
        const accessToken = req.headers["authorization"];
        if (!accessToken) {
            return next(CreateError(AllStatusCodes.Unauthorized, 'Access token is required, please login !!!'));
        }
        const decoded = await jwt.verify(accessToken, config.app.jwtSecretKey);
        if (!decoded) {
            return next(CreateError(AllStatusCodes.Unauthorized, 'Invalid Access token, please login again !!!'));
        }
        req.decoded = decoded;
        next(); // point to the next level middleware ...
    } catch (error) {
        next(CreateError(AllStatusCodes.InternalServerError, error?.message));
    }
};

export const isLoggedOut = async (req, res, next) => {
    try {
        const accessToken = req.headers["authorization"];
        if (accessToken) {
            // token may be expired ...
            const decoded = await jwt.verify(accessToken, config.app.jwtSecretKey);
            if (decoded) {
                return next(CreateError(AllStatusCodes.BadRequest, `${decoded?.name} already logged in !!!`));
            }
        }
        next(); // point to the next level middleware ...
    } catch (error) {
        next(CreateError(AllStatusCodes.InternalServerError, error?.message));
    }
};
