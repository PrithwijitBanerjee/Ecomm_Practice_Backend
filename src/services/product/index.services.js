import { editProductById, fetchEntireProducts, fetchProductById, removeProductById, saveProduct } from "./product.services.js";

const ProductServices = {
      saveProduct,
      fetchEntireProducts,
      fetchProductById,
      editProductById,
      removeProductById,
};

export default ProductServices;