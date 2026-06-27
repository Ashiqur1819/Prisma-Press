import { prisma } from "../../lib/prisma";
import { IPostPayload } from "./post.interface";


const createPostIntoDB = async (payload: IPostPayload, authorId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId,
    },
  });

  return result;
};

const getAllPostsFromDB = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        omit: {
            password: true
        }
      },
      comments: true,
    },
  });

  return posts;
};

export const postService = {
  createPostIntoDB,
  getAllPostsFromDB,
};
