import e from "express";
import { userRouter } from "./userRoutes.js";

const router = e.Router();

router.use("/user", userRouter);


export { router as apiRouter };