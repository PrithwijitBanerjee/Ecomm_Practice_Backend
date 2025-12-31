import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category Name is required!!!"],
        unique: true,
    },
    parentCategory: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        default: null, // null for parent category ...
    }
}, {
    timestamps: true,
    versionKey: false,
});

/** Apply the uniqueValidator plugin to userSchema. **/
categorySchema.plugin(mongooseUniqueValidator, { message: '{PATH} already exists' });

const CategoryModel = new mongoose.model("Category", categorySchema);

export default CategoryModel;