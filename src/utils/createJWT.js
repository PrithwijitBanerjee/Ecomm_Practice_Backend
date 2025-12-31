import jwt from "jsonwebtoken";
import CreateError from "http-errors";

export const createJWT = (payload, secret_key, expiryTime = "1m") => {
    try {
        if (typeof (payload) !== 'object' || Object.keys(payload).length === 0) {
            throw CreateError(400, 'user Info must be typed object and can not be empty !!!');
        }
        if (!expiryTime.length) {
            throw CreateError(400, 'expiryTime must be non-empty string !!!');
        }
        const token = jwt.sign(payload, secret_key, { expiresIn: expiryTime });
        return token;
    } catch (error) {
        throw error;
    }
};