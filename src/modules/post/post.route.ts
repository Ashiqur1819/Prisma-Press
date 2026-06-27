import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  postController.createPost,
);
router.get("/", postController.getAllPosts);
router.get(
  "/my-posts",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  postController.getMyPosts,
);
router.get("/:postId", postController.getAPostByID);

export const postRouter = router;
