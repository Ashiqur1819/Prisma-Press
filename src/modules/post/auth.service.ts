import { prisma } from "../../lib/prisma";
import { IPostPayload } from "./auth.interface";

const createPostIntoDB = async (payload: IPostPayload, authorId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId,
    },
  });

  return result;
};

export const postService = {
  createPostIntoDB,
};
