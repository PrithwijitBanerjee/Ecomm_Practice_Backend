import { handleRefreshToken, handleUserSignIn, handleUserSignUp, verifyUserOTP } from "./user.controller.js";

const UserController = {
      handleUserSignUp,
      handleUserSignIn,
      handleRefreshToken,
      verifyUserOTP,
};

export default UserController;