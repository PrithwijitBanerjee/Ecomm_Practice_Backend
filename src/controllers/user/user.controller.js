import CreateError from "http-errors";
import AllStatusCodes from "../../utils/allStatusCodes.js";
import UserServices from "../../services/user/index.services.js";
import { successResponse } from "../../utils/response.js";
import { createJWT } from "../../utils/createJWT.js";
import config from "../../../config/config.js";
import jwt from "jsonwebtoken";
import { generateNewOTP } from "../../utils/generateOTP.js";
import verifyAndSendEmail from "../../utils/email.js";

export const handleUserSignUp = async (req, res, next) => {
    try {
        if (!Object.keys(req.body)?.length) {
            return next(CreateError(AllStatusCodes.BadRequest, "Something went wrong!!!, User is not able to added!!!"));
        }
        const isExistUser = await UserServices.findUserByNameOrEmail(req.body);
        if (isExistUser) {
            return next(CreateError(AllStatusCodes.Conflict, 'User of given email/ phone No. already exists, please sign in !!!'));
        }
        const user = await UserServices.addNewUser(req.body);
        successResponse(res, {
            status: AllStatusCodes.Created,
            message: "User has been registered successfully",
            payload: {
                ...user?._doc,
            },
        });
    } catch (error) {
        next(CreateError(AllStatusCodes.InternalServerError, error?.message));
    }
};

export const handleUserSignIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await UserServices.findUserByEmail({ email });
        if (!user) {
            return next(CreateError(AllStatusCodes.NotFound, "User of given email does not exist!!!, please signup first!!!"));
        }
        const isPassValid = await UserServices.validateUserPassword(password, user);
        if (!isPassValid) {
            return next(CreateError(AllStatusCodes.Unauthorized, 'Login Failed, Invalid emailId/password !!!'));
        }
        if (user?.isBanned) {
            return next(CreateError(AllStatusCodes.Forbidden, 'This user has been already banned, please contact with authority !!!'));
        }

        // generate new OTP for authenticated user
        const { otp, otpExpires } = generateNewOTP(60000);
        const result = await UserServices.storeUserOTP({
            id: user?._doc?._id,
            otp,
            otpExpires,
        });
        if (!result) {
            return next(CreateError(AllStatusCodes.BadRequest, "Failed to generate OTP!!!"));
        }

        const emailData = {
            to: email,
            subject: "ECOMMERCE APP",
            html: `<h2>One Time Password: <b>${otp}</b></h2>`,
        };

        const info = await verifyAndSendEmail(emailData);

        if (!info) {
            return next(CreateError(AllStatusCodes.InternalServerError, "Failed to send verification email!!!"));
        }

        successResponse(res, {
            status: AllStatusCodes.OK,
            message: "OTP has been sent successfully",
            payload: {
                otp,
            },
        });
    } catch (error) {
        next(CreateError(AllStatusCodes.InternalServerError, error?.message));
    }
};


export const verifyUserOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const user = await UserServices.findUserByEmail({ email });
        if (!user) {
            return next(CreateError(AllStatusCodes.NotFound, "User of given email does not exist!!!, please signup first!!!"));
        }
        if (user?.isBanned) {
            return next(CreateError(AllStatusCodes.Forbidden, 'This user has been already banned, please contact with authority !!!'));
        }

        // Check if OTP is expired
        if (new Date() > new Date(user?._doc?.otpExpires)) {
            return next(CreateError(AllStatusCodes.Unauthorized, 'Sorry your OTP has been expired!!! Please request a new one!!!'));
        }

        if (otp !== user?._doc?.otp) {
            return next(CreateError(AllStatusCodes.Unauthorized, 'Invalid OTP!!! Please signin with correct otp!!!'));
        }

        // Clear the OTP fields after successful verification
        await UserServices.clearUserOTP(user?._doc?._id);

        const access_token = createJWT({
            name: user?._doc?.name,
            email: user?._doc?.email,
            address: user?._doc?.address,
            isAdmin: user?._doc?.isAdmin,
            isBanned: user?._doc?.isBanned,
        }, config.app.jwtSecretKey, "7m");

        const refresh_token = createJWT({
            name: user?._doc?.name,
            email: user?._doc?.email,
            address: user?._doc?.address,
            isAdmin: user?._doc?.isAdmin,
            isBanned: user?._doc?.isBanned,
        }, config.app.jwtSecretKey, "7d");

        successResponse(res, {
            status: AllStatusCodes.OK,
            message: "User has been logged in successfully",
            payload: {
                name: user?._doc?.name,
                email: user?._doc?.email,
                address: user?._doc?.address,
                isAdmin: user?._doc?.isAdmin,
                isBanned: user?._doc?.isBanned,
                token: {
                    access_token,
                    refresh_token,
                },
            },
        });

    } catch (error) {
        next(CreateError(AllStatusCodes.InternalServerError, error?.message));
    }

};

export const handleRefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.headers["refreshtoken"];
        if (!refreshToken) {
            return next(CreateError(AllStatusCodes.Unauthorized, 'Refresh Token not found, please login again !!!'));
        }
        const decoded = await jwt.verify(refreshToken, config.app.jwtSecretKey);
        if (!decoded) {
            return next(CreateError(AllStatusCodes.Unauthorized, 'Invalid refresh token !!!'));
        }
        const { name, email, address, isAdmin, isBanned } = decoded;
        const userPayload = {
            name,
            email,
            address,
            isAdmin,
            isBanned,
        };
        const access_token = createJWT(userPayload, config.app.jwtSecretKey, "7m");
        successResponse(res, {
            status: AllStatusCodes.OK,
            message: "Access token has been renewed successfully",
            payload: {
                access_token,
            },
        });

    } catch (error) {
        next(CreateError(AllStatusCodes.InternalServerError, error?.message));
    }
};