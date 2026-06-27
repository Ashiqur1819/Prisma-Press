import { catchAsync } from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { postService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;

    const result = await postService.createPostIntoDB(
      req.body,
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post created successfully.",
      data: result,
    });
  },
);

export const postController = {
  createPost,
};
