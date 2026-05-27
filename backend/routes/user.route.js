import { Router } from "express";
import {
  acceptFriendRequestController,
  findMeController,
  registerUser,
  sentFriendRequestController,
} from "../controllers/user.controller.js";
import { loginController } from "../controllers/auth.controller.js";
import { verifyJWTToken } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").get(loginController);
userRouter.route("/findMe").get(verifyJWTToken, findMeController);
userRouter.route("/sentrequest").post(verifyJWTToken, sentFriendRequestController);
userRouter.route("/acceptrequest/:id").post(verifyJWTToken, acceptFriendRequestController);

export default userRouter;
