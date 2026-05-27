import { Router } from "express"
import { registerUser } from "../controllers/user.controller.js";
import { loginController } from "../controllers/auth.controller.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser)
userRouter.route("/login").get(loginController)

export default userRouter