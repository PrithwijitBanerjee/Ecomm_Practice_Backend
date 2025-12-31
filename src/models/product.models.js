import mongoose from "mongoose";
import config from "../../config/config.js";
import mongooseUniqueValidator from "mongoose-unique-validator";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product Name is required!!!"],
        unique: [true, "Product Name must be unique!!!"],
    },
    product_image: {
        type: String,
        default: `${config.app.baseUrl}:${config.app.port}/product_image/product_placeholder_img.webp`,
    },
    product_images: {
        type: [String],
        default: [`${config.app.baseUrl}:${config.app.port}/product_image/product_placeholder_img.webp`],
    },
    price: {
        type: Number,
        default: 0,
    },
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, '**Product Categories is required'],
            ref: "Category",
            default: [],
        }
    ]
}, {
    versionKey: false,
    timestamps: true,
});

/** Apply the uniqueValidator plugin to userSchema. **/
productSchema.plugin(mongooseUniqueValidator, { message: '{PATH} already exists' });

const ProductModel = new mongoose.model("Product", productSchema);

export default ProductModel;