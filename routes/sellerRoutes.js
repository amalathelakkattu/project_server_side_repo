import e from "express";
import { checkSeller, getSellerProfile, sellerLogin, sellerLogout, sellerSignup, updateSellerProfile } from "../controller/sellerController.js";
import { sellerAuth } from "../middlewares/sellerAuth.js";

const router = e.Router();

//signup
router.post("/signup", sellerSignup);

//login
router.post("/login", sellerLogin);

//profile
router.get("/getprofile", sellerAuth, getSellerProfile);

//profile-update
router.put("/updateprofile", sellerAuth, updateSellerProfile);

// logout
router.put("/logout", sellerAuth, sellerLogout);

//forgot-password


//change-password


//account-deactivate



//check-user
router.get("/check-mentor", sellerAuth, checkSeller);

export { router as sellerRouter };