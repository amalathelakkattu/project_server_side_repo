import e from "express";
import { } from "../controller/paymentController.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = e.Router();

//router.get("/get-cart", userAuth, getCart);



export { router as paymentRoutes };