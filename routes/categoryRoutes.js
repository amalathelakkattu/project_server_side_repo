import e from "express";
import {addCategory,updateCategory,getCategory, deleteCategory,checkAdmin } from "../controller/categoryController.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = e.Router();

//signup
router.post("/addcategory", adminAuth,addCategory);

//login
router.put("/updatecategory",adminAuth, updateCategory);

//profile
router.get("/getcategory", adminAuth, getCategory);

//logout
router.delete("/deletecategory", adminAuth, deleteCategory);

//check-user
router.get("/check-admin", adminAuth, checkAdmin);

export { router as categoryRouter };