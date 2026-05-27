import jwt from "jsonwebtoken";
import ApiError from "../config/ApiError.js";
import User from "../models/user.model.js";

const verifyJWTToken = async (req, res, next) => {
  const { jwtToken } = req?.cookies;
  
  if (!jwtToken) throw new ApiError(404, "Token not found! please login again");

  const verifyToken = jwt.verify(jwtToken, process.env.SECRET_KEY);

  const user = await User.findById(verifyToken.userId).select(
    "-password",
  );
  if (!user) throw new ApiError(404, "No user found");
  req.user = user;
  next();
};

export { verifyJWTToken };
