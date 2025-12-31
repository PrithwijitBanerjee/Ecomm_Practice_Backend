import express from "express";
import UserController from "../controllers/user/index.controller.js";
import { isLoggedOut } from "../middlewares/auth.middleware.js";
import { otpValidationRules, signInValidationRules, signUpValidationRules } from "../validations/user/user.validationRule.js";
import sanitizeReq from "../middlewares/sanitization.middleware.js";

const UserRouter = express.Router({
    caseSensitive: true,
});


UserRouter
    .use(isLoggedOut)
    .post("/register", signUpValidationRules(), sanitizeReq, UserController.handleUserSignUp)
    .post("/otp", otpValidationRules(), sanitizeReq, UserController.handleUserSignIn)
    .post("/login", signInValidationRules(), sanitizeReq, UserController.verifyUserOTP)
    .get("/refresh-token", UserController.handleRefreshToken);


export default UserRouter;