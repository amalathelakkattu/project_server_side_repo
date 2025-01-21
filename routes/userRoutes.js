import e from "express";
import { userSignup , userLogin, userProfile, userLogout, updateProfile } from "../controller/userController.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = e.Router();

//signup
router.post("/signup", userSignup);

//login
router.post("/login", userLogin);

//profile
router.get("/profile", userAuth, userProfile);

//logout
router.get("/logout", userAuth, userLogout);

//profile-update
router.patch("/updateprofile", userAuth, updateProfile);
//forgot-password
//change-password
//account-deactivate


//check-user

export { router as userRouter };