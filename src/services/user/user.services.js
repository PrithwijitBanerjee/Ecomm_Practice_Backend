import UserModel from "../../models/user.models.js";


export const addNewUser = async userData => {
    try {
        const userDoc = await UserModel({
            ...userData,
        });
        return await userDoc?.save();
    } catch (error) {
        throw new Error(error);
    }
};


export const findUserByNameOrEmail = async userData => {
    try {
        const isExistUser = await UserModel.findOne({ $or: [{ name: userData?.name }, { email: userData?.email }] });
        return isExistUser ? true : false;
    } catch (error) {
        throw new Error(error);

    }
};

export const findUserByEmail = async ({ email }) => {
    try {
        const user = await UserModel.findOne({
            email,
        });
        return user;
    } catch (error) {
        throw new Error(error);
    }
};

export const validateUserPassword = async (password, user) => {
    try {
        const isValidPass = new UserModel()?.validatePassword(password, user);
        return isValidPass;
    } catch (error) {
        throw new Error(error);
    }
};

export const storeUserOTP = async ({ id, otp, otpExpires }) => {
    try {
        const user = await UserModel.findByIdAndUpdate(id, {
            otp,
            otpExpires,
        }, {
            new: true,
        });
        return user;
    } catch (error) {
        throw new Error(error);
    }
};

export const clearUserOTP = async id => {
    try {
        return await UserModel.findByIdAndUpdate(id, {
            otp: null,
            otpExpires: null,
        }, {
            new: true,
        });
    } catch (error) {
        throw new Error(error);
    }
}