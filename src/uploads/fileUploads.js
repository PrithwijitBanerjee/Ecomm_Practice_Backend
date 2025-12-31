import multer from "multer";
import path from "node:path";
import config from "../../config/config.js";
import AllStatusCodes from "../utils/allStatusCodes.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "product_image") {
            cb(null, path.join(process.cwd(), "public", "product_image"));
        }
        if (file.fieldname === "product_images") {
            cb(null, path.join(process.cwd(), "public", "product_images"));
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname);
    if (!config.app.allowedFileTypes.includes(extension.substring(1))) {
        return cb(createError(AllStatusCodes.BadRequest, 'Only *.jpg or, *.jpeg or, *.png or, *.gif files are allowed !!!'), false);
    }
    if (file?.fieldname) {
        return cb(null, true);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: config.app.maxFileSize,
    },
    fileFilter,
});

export default upload;