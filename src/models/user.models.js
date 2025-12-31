import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongooseUniqueValidator from "mongoose-unique-validator";

const SALT_WORK_FACTOR = 10; // no. of rounds for hashing original password

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User name is required!!!"],
        unique: [true, "User name must be unique!!!"],
    },
    email: {
        type: String,
        required: [true, "Email Id is required!!!"],
        unique: [true, "Email Id must be unique!!!"],
    },
    password: {
        type: String,
        required: [true, "Password is required!!!"],
        set: v => bcrypt.hashSync(v, bcrypt.genSaltSync(SALT_WORK_FACTOR)),
    },
    address: {
        type: String,
        required: [true, "Address is required!!!"],
        minLength: [3, '**user address should be atleast 3 characters'],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        default: null,
    },
    otpExpires: {
        type: String,
        default: null,
    }
});

/** Apply the uniqueValidator plugin to userSchema. **/
userSchema.plugin(mongooseUniqueValidator, { message: '{PATH} already exists' });

// instance method of mongoose ...
userSchema.methods.validatePassword = async (password, userDoc) => {
    return bcrypt.compare(password, userDoc?.password);
};

const UserModel = new mongoose.model("User", userSchema);

export default UserModel;