import { Request, Response } from "express";
import httpStatus from "http-status";
import { authService } from "./auth.service";
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
  const user = await authService.registerUserIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: user,
  });
});

// Login user
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const loginData = await authService.loginUser(req.body);

  const {accessToken, refreshToken} = loginData;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: loginData,
  });
});

export const authController = {
  registerUser,
  loginUser,
};
