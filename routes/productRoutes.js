import e from "express";
import { upload } from "../middlewares/multer.js";
import { sellerAuth } from "../middlewares/sellerAuth.js";
import { getProduct,getProductDetails,productsFilter,productsSort} from "../controller/productController.js";
import { createProduct, updateProduct ,deleteProduct } from "../controller/productController.js";


const router = e.Router();

router.post("/create-product", sellerAuth, upload.single("image"), createProduct);
router.put("/update-product",sellerAuth,upload.single('image'),updateProduct);
router.delete("/delete-product",sellerAuth,deleteProduct);
router.get("/get-product", sellerAuth,getProduct);
router.get("/product-details/:productId", sellerAuth,getProductDetails);
router.get("/filter-product",sellerAuth,productsFilter);
router.get("/sort-product",sellerAuth,productsSort);

export { router as productRouter };