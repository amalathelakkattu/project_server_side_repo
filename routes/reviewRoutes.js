

import e from "express";
import { addReview, deleteReview, getAverageRating, getProductReviews } from "../controller/reviewController.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = e.Router();

router.post("/add-review", userAuth, addReview);
router.get("/get-course-reviews",getProductReviews);
router.delete('/delete-review',userAuth,deleteReview);
router.get('/get-avg-rating',getAverageRating);


export { router as reviewRouter };