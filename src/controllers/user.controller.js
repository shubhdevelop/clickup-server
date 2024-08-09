import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";

const registerUser = asyncHandler(async (req, res, next) => {
  const { fullname, email, username, password } = req.body;
  const user = await User.create({
    fullname,
    email,
    username,
    password,
  });

  try {
    const result = await user.save();
    const newReponse = new ApiResponse(200, result, "SUCCESS");
    res.send(newReponse);
  } catch (error) {
    const errResponse = new ApiError(500, "couldn't create user!", error);
    res.send(errResponse);
  }
});

export { registerUser };
