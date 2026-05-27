import jwt from "jsonwebtoken";
import ApiError from "../config/ApiError.js";
import User from "../models/user.model.js";

const verifyJWTToken = async (err, req, res, next) => {
  const { token } = req?.cookies;
  if (!token) throw new ApiError(404, "Token not found");

  const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

  const user = await User.findById(verifyToken.userId).select(
    "-password",
  );
  if (!user) throw new ApiError(404, "No user found");
  console.log(user);
  req.user = user;
  next();
};

export { verifyJWTToken };
