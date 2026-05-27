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
      [name, username, email, password].some(
        (element) => element?.trim() === "",
      )
    )
      throw new ApiError(400, "All fields are required");

    const foundUser = await User.findOne({ $or: [{ username }, { email }] });
    if (foundUser) throw new ApiError(409, "User already existed");

    const newUser = await User.create({
      name,
      username,
      email,
      password,
    });
    if (!newUser) throw new ApiError(500, "Can't create user");

    return res
      .status(201)
      .json(new ApiResponse(201, "New User created", newUser));
  } catch (error) {
    throw new ApiError(500, `Something went wrong: ${error}`);
  }
};

const findMeController = async (req, res, next) => {
  try {
    return res.status(201).json(new ApiResponse(201, "User", req.user));
  } catch (error) {
    throw new ApiError(500, `Something went wrong: ${error}`);
  }
};

const sendFreindRequestController = async (req, res, next) =>{
  /**
   * take username from req.body
   * find the corresponding user
   * if exist, push object id into their receivedRequests array
   * push their id into id into logged in user's sentRequests array
   * if everything is successfull, then return response
   */

  const {_id} = req.user;
  const {username} = req.body;

  if(!username) throw new ApiError(401, "Username required to sent friend request");

  const findFriend = await User.findOne({username});
  if(!findFriend) throw new ApiError(404, "Username not found");

  const sentRequest = User.findByIdAndUpdate(_id, {
    $push: {sentRequests: findFriend._id}
  });
  const receiveRequest = User.findByIdAndUpdate(findFriend._id, {
    $push: {receivedRequests: _id}
  });
}

export { registerUser, findMeController };
