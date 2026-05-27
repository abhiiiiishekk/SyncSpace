import ApiError from "../config/ApiError.js";
import ApiResponse from "../config/ApiResponse.js";
import User from "../models/user.model.js";

const registerUser = async (req, res, next) => {
  /*
   * extract data from req.body
   * validate whether any of the field is empty or not
   * check if the user already existed or not
   * if not, then register the new user
   * return success status
   */
  try {
    const { name, username, email, password } = req.body;
  
    if (
      [name, username, email, password].some((element) => element?.trim() === "")
    )
      throw new ApiError(400, "All fields are required");
  
    const foundUser = await User.findOne({ $or: [{ username }, { email }] });
    if(foundUser) throw new ApiError(409, "User already existed");
  
    const newUser = await User.create({
      name,
      username,
      email,
      password
    })
    if(!newUser) throw new ApiError(500, "Can't create user")
  
    return res.status(201).json(new ApiResponse(201, "New User created", newUser))
  } catch (error) {
    throw new ApiError(500, `Something went wrong: ${error}`)
  }
};

export {
  registerUser
}