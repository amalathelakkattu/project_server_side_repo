import e from "express";
import { userRouter } from "./userRoutes.js";
import { sellerRouter } from "./sellerRoutes.js";
import { productRouter } from "./productRoutes.js";
import { categoryRouter } from "./categoryRoutes.js";
import { cartRouter } from "./cartRoutes.js";
import { orderRouter } from "./orderRoutes.js";
import { reviewRouter } from "./reviewRoutes.js";
import { paymentRoutes } from "./paymentRoutes.js";


const router = e.Router();

router.use("/user", userRouter);
router.use("/seller", sellerRouter);
router.use("/product", productRouter);
router.use("/category", categoryRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);
router.use("/review", reviewRouter);
router.use("/payment", paymentRoutes);


export { router as apiRouter };