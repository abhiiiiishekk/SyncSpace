import { Router } from "express";
import {
  findMeController,
  registerUser,
} from "../controllers/user.controller.js";
import { loginController } from "../controllers/auth.controller.js";
import { verifyJWTToken } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").get(loginController);
userRouter.route("/findMe").get(verifyJWTToken, findMeController);

export default userRouter;
