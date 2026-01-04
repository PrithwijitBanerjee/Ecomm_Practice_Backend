import express from "express";
import UserController from "../controllers/user/index.controller.js";
import { isLoggedOut } from "../middlewares/auth.middleware.js";
import sanitizeReq from "../middlewares/sanitization.middleware.js";
import UserValidation from "../validations/user/index.validationRule.js";

const UserRouter = express.Router({
    caseSensitive: true,
});


UserRouter
    .use(isLoggedOut)
    .post("/register", UserValidation.signUpValidationRules(), sanitizeReq, UserController.handleUserSignUp)
    .post("/otp", UserValidation.otpValidationRules(), sanitizeReq, UserController.handleUserSignIn)
    .post("/login", UserValidation.signInValidationRules(), sanitizeReq, UserController.verifyUserOTP)
    .get("/refresh-token", UserController.handleRefreshToken);


export default UserRouter;