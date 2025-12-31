import mongoose from "mongoose";
import ProductModel from "../../models/product.models.js";
import fs from "node:fs";
import path from "node:path";
import { unlinkFile } from "../../utils/unlinkFile.js";

export const saveProduct = async productData => {
   try {
      const addedProductData = { ...productData };
      if (addedProductData?.product_image?.length === 0) {
         delete addedProductData?.product_image;
      }
      if (addedProductData?.product_images?.length === 0) {
         addedProductData?.product_images;
      }
      const productDoc = new ProductModel({
         ...addedProductData,
      });
      const product = await productDoc.save();
      return product?._doc;
   } catch (error) {
      throw new Error(error);
   }
};

export const fetchEntireProducts = async () => {
   try {
      const products = await ProductModel.aggregate([
         {
            $lookup: {
               from: "categories",
               localField: "categories",
               foreignField: "_id",
               as: "categories",
            }
         },
         {
            $project: {
               "product.categories.parentCategory": 0,
            }
         },
         {
            $sort: {
               "createdAt": -1
            }
         }
      ]);
      return products;
   } catch (error) {
      throw new Error(error);
   }
};

export const fetchProductById = async productId => {
   try {
      const product = await ProductModel.aggregate([
         {
            $match: {
               _id: new mongoose.Types.ObjectId(productId),
            }
         },
         {
            $lookup: {
               from: "categories",
               localField: "categories",
               foreignField: "_id",
               as: "categories",
            }
         }
      ]);
      return product?.[0];
   } catch (error) {
      throw new Error(error);
   }
};

export const editProductById = async (req, id, productData) => {
   try {
      let productRes = null;
      const product = await fetchProductById(id);

      if (!product) {
         // If product doesn't exist, delete uploaded files
         if (req.files?.product_image?.[0]?.filename) {
            unlinkFile(req.files.product_image[0].filename, "product_image");
         }

         if (req.files?.product_images) {
            req.files.product_images.forEach(file => {
               if (file.filename) {
                  unlinkFile(file.filename, "product_images");
               }
            });
         }
         return null; // Product doesn't exist
      }

      // If product exists, handle file cleanup
      if (product) {
         // Clean up old product_image if new one is uploaded
         if (req.files?.product_image?.[0]?.filename && product.product_image) {
            const oldFilename = path.basename(product.product_image);
            if (oldFilename !== "product_placeholder_img.webp") {
               const isExist = fs.existsSync(path.join(process.cwd(), "public", "product_image", oldFilename));
               if (isExist) {
                  unlinkFile(oldFilename, "product_image");
               }
            }
         }

         // Clean up old product_images if new ones are uploaded
         if (req.files?.product_images?.length > 0 && product.product_images?.length > 0) {
            product.product_images.forEach(file => {
               const oldFilename = path.basename(file);
               if (oldFilename !== "product_placeholder_img.webp") {
                  const isExist = fs.existsSync(path.join(process.cwd(), "public", "product_images", oldFilename));
                  if (isExist) {
                     unlinkFile(oldFilename, "product_images");
                  }
               }
            });
         }

         // Prepare update data
         const updateData = { ...productData };

         // Only update image fields if new files were uploaded
         if (!req.files?.product_image?.[0]?.filename) {
            delete updateData.product_image;
         }

         if (!req.files?.product_images || req.files.product_images.length === 0) {
            delete updateData.product_images;
         }

         // Only update categories if user give categories ...
         if (productData?.categories && !productData?.categories?.length === 0) {
            delete updateData.categories;
         }
         productRes = await ProductModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
         );
      }

      return productRes ? productRes._doc : productRes;
   } catch (error) {
      throw new Error(error);
   }
};


export const removeProductById = async productId => {
   try {
      let productRes = null;
      const product = await fetchProductById(productId);
      if (product) {
         if (path.basename(product?.product_image) !== "product_placeholder_img.webp") {
            const originalFileName = path.basename(product?.product_image);
            
            const isExist = fs.existsSync(path.join(process.cwd(), "public", "product_image", originalFileName));
            if (isExist) {
               unlinkFile(product?.product_image, "product_image");
            }
         }
         if (product?.product_images?.length > 0 && path.basename(product?.product_images?.[0]) !== "product_placeholder_img.webp") {
            product?.product_images?.map(file => {
               const originalFileName = path.basename(file);
               const isExist = fs.existsSync(path.join(process.cwd(), "public", "product_images", originalFileName));
               if (isExist) {
                  unlinkFile(file, "product_images");
               }
            });
         }
         productRes = await ProductModel.findByIdAndDelete(productId);
      }
      return productRes ? productRes._doc : productRes;
   } catch (error) {
      throw new Error(error);
   }
};