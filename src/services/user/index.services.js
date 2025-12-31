import { addNewUser, clearUserOTP, findUserByEmail, findUserByNameOrEmail, storeUserOTP, validateUserPassword } from "./user.services.js";

const UserServices = {
      addNewUser,
      findUserByNameOrEmail,
      findUserByEmail,
      validateUserPassword,
      storeUserOTP,
      clearUserOTP,
};

export default UserServices;