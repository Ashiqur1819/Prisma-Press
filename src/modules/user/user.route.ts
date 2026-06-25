import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { verifyToken } from "../../utils/verifyToken";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

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

router.get(
  "/me",
  (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;

    const veriyfiedToken = verifyToken(
      accessToken,
      config.jwt_access_secret as string,
    );

    if (!veriyfiedToken || typeof veriyfiedToken === "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, email, role } = veriyfiedToken;

    const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];

    if (!requiredRoles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = {
      userId,
      email,
      role,
    };

    next();
  },
  userController.getMyProfile,
);

export const userRouter = router;
