import bcrypt from "bcryptjs";
import ApiError from "../config/ApiError.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import ApiResponse from "../config/ApiResponse.js";

const loginController = async (req, res, next) => {
  /*
   * extract data from req.body
   * validate whether any of the field is empty or not
   * check if the user already existed or not
   * if not, then check the password
   * if true, create token
   * save the token inside cookie
   * return success status
   */
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new ApiError(400, "All fields are required");
  
    const findUser = await User.findOne({
      $or: [{ email }, { username: email }],
    });
    if(!findUser) throw new ApiError(404, "User not found");
  
    const verifyUser = await bcrypt.compare(password, findUser.password);
    if(!verifyUser) throw new ApiError(401, "Password Didn't matched");
  
    const payload = {
      userId: findUser._id
    }
  
    const jwtToken = jwt.sign(payload, process.env.SECRET_KEY)
  
    res.cookie("token", jwtToken)

    return res.status(200).json(new ApiResponse(200, "User found", {...findUser, jwtToken}))
  } catch (error) {
    throw new ApiError(500, `Something went wrong in login controller: ${error}`);
  }
};

export {
  loginController
}