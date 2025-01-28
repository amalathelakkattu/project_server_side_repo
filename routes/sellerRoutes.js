import e from "express";
import { checkSeller, sellerLogin, sellerLogout, sellerProfile, sellerSignup } from "../controller/sellerController.js";
import { sellerAuth } from "../middlewares/sellerAuth.js";

const router = e.Router();

//signup
router.post("/signup", sellerSignup);

//login
router.post("/login", sellerLogin);

//profile
router.get("/profile", sellerAuth, sellerProfile);

// logout
router.put("/logout", sellerAuth, sellerLogout);

//profile-update
//forgot-password
//change-password
//account-deactivate

//check-user
router.get("/check-mentor", sellerAuth, checkSeller);

export { router as sellerRouter };