import e from "express";
import { getOrder ,getOrderById  } from "../controller/orderController.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = e.Router();

router.get("/getorder", userAuth, getOrder);
router.get("/getorderbyId", userAuth, getOrderById);




export { router as orderRouter };