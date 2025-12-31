import { addNewProduct, deleteProductById, getAllProducts, getSingleProductById, updateProductById } from "./product.controller.js";

const ProductController = {
      addNewProduct,
      getAllProducts,
      getSingleProductById,
      updateProductById,
      deleteProductById,
};

export default ProductController;