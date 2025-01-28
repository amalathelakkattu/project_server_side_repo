
import e from "express";
import { addProductToCart, getCart, removeProductFromCart } from "../controller/cartController.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = e.Router();

router.get("/get-cart", userAuth, getCart);
router.post("/add-to-cart",userAuth,addProductToCart);
router.post("/remove-from-cart",userAuth,removeProductFromCart);


export { router as cartRouter };