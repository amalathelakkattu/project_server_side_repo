import e from "express";
import { userSignup , userLogin, userProfile, userLogout, updateProfile, forgotPassword, changePassword, checkUser } from "../controller/userController.js";
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
router.put("/updateprofile", userAuth, updateProfile);

//forgot-password
router.post("/forgotPassword", userAuth,forgotPassword);

//change-password
router.post("/changePassword", userAuth,changePassword);

//account-deactivate


//check-user
router.post("/checkuser", userAuth,checkUser);

export { router as userRouter };