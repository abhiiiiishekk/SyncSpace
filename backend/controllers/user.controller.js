import ApiError from "../config/ApiError.js";
import ApiResponse from "../config/ApiResponse.js";
import User from "../models/user.model.js";

const registerUser = async (req, res) => {
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

const findMeController = async (req, res) => {
  try {
    return res.status(201).json(new ApiResponse(200, "User", req.user));
  } catch (error) {
    throw new ApiError(500, `Something went wrong: ${error}`);
  }
};

const sentFriendRequestController = async (req, res) => {
  /**
   * take username from req.body
   * find the corresponding user
   * if exist, push object id into their receivedRequests array
   * push their id into id into logged in user's sentRequests array
   * if everything is successfull, then return response
   */

  try {
    const { _id } = req.user;
    const { username } = req.body;

    if (!username)
      throw new ApiError(401, "Username required to sent friend request");

    const findFriend = await User.findOne({ username });
    if (!findFriend) throw new ApiError(404, "Username not found");

    // checks whether the current user and the intended user is same or not
    if (_id.toString() == findFriend._id.toString())
      throw new ApiError(403, "Can't send friend request to yourself");

    // checks whether the current user is already in the friend list or not
    if (findFriend.friends.includes(_id))
      throw new ApiError(403, "Already in friends list");

    // checks whether the current user is already in the request list or not
    if (findFriend.receivedRequests.includes(_id))
      throw new ApiError(403, "Friend request already send");

    // checks whether the opposite user already has the friend request or not, if has, then he can't sent request
    if (findFriend.sentRequests.includes(_id))
      throw new ApiError(
        403,
        "This user has already sent you a friend request",
      );

    const sentRequest = await User.findByIdAndUpdate(
      _id,
      {
        $push: { sentRequests: findFriend._id },
      },
      { returnDocument: "after" },
    );
    const receiveRequest = await User.findByIdAndUpdate(
      findFriend._id,
      {
        $push: { receivedRequests: _id },
      },
      { returnDocument: "after" },
    );

    if (!sentRequest || !receiveRequest)
      throw new ApiError(400, "Can't send friend request");

    return res
      .status(201)
      .json(new ApiResponse(201, "Request sent successfully", {}));
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while sending friend request: " + error,
    );
  }
};

const acceptFriendRequestController = async (req, res) => {
  /**
   * take user id from params
   * take receivedrequest from user
   * match them and check if it's exists or not
   * if exists, then use $pull to pull out the matching id's from sender's sendRequest and receiver's receivedRequest array, and push them inside friends array
   * if everything succeeded, return response
   */
  const { id } = req.params; // the user who send me request
  if (!id) throw new ApiError(404, "ID not found");

  const { _id, receivedRequests, friends } = req.user; // current logged in user

  if (!(receivedRequests.includes(id)))
    throw new ApiError(403, "ID's didn't matched");

  if(friends.includes(id) ) throw new ApiError(403, "Already in the friend list")

  const sender = await User.findByIdAndUpdate(
    { _id: id },
    {
      $pull: {
        sentRequests: _id,
      },
      $push: {
        friends: _id,
      },
    },
    { returnDocument: "after" },
  ); // remove from sendRequest array and push it insider friends array

  const receiver = await User.findByIdAndUpdate(_id,
    {
      $pull: {
        receivedRequests: id,
      },
      $push: {
        friends: id,
      },
    },
    { returnDocument: "after" },
  ); // remove from receivedRequests array and push it insider friends array

  return res.status(201).json(new ApiResponse(201, "Request Accepted", {}))
};

export {
  registerUser,
  findMeController,
  sentFriendRequestController,
  acceptFriendRequestController,
};
