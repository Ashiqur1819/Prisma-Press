import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { verifyToken } from "../utils/verifyToken";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided" });
    }

    const verifiedToken = verifyToken(
      token,
      config.jwt_access_secret as string,
    );

    if (!verifiedToken.sucess || typeof verifiedToken.decoded === "string") {
      return res.status(401).json({ message: "Unauthorized. Invalid token" });
    }

    const { userId, email, role } = verifiedToken.decoded as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      return res
        .status(403)
        .json({ message: "Forbidden. Insufficient permissions" });
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized. User not found" });
    }

    if (user.activeStatus === "INACTIVE") {
      return res
        .status(403)
        .json({ message: "User is inactive. Please contact support." });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  });
};
