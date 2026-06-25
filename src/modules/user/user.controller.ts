import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getMyProfileFromDB(req.user?.userId as string);

  console.log(user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile retrieved successfully",
    data: user,
  });
});

export const userController = {
  getMyProfile,
};
