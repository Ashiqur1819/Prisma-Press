import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    message: err.message,
    error: err.stack,
  });
};

export default globalErrorHandler;
