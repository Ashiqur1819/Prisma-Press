import { catchAsync } from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { postService } from "./post.service";
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

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const posts = await postService.getAllPostsFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All posts retrieved successfully",
      data: posts,
    });
  },
);

const getAPostByID = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId

    if(!postId){
        throw new Error("Post ID is required in params")
    }

    const result = await postService.getAPostByIDFromDB(postId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post retrieved successfully.",
        data: result
    })
})

const getMyPosts = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.userId

    const result = await postService.getMyPostFromDB(authorId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My posts retrieved successfully",
        data: result
    })
})

export const postController = {
  createPost,
  getAllPosts,
  getAPostByID,
  getMyPosts
};
