import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

/**
 * const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.registerUserIntoDB(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to create user",
      error: (error as Error).message,
    });
  }
};
 */

// Register user
const registerUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.registerUserIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: user,
  });
});

// Login user
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const loginData = await userService.loginUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: loginData,
  });
});

export const userController = {
  registerUser,
  loginUser,
};
