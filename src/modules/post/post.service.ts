import { prisma } from "../../lib/prisma";
import { IPostPayload, IUpdatePostPayload } from "./post.interface";

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
          password: true,
        },
      },
      comments: true,
    },
  });

  return posts;
};

const getAPostByIDFromDB = async (postId: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return updatedPost
};

const getMyPostFromDB = async (authorId: string) => {
  const myPosts = prisma.post.findMany({
    where: {
      authorId
    },
    orderBy: {
      createAt: "desc"
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true
        }
      },
      _count: {
        select: {
          comments: true
        }
      }
    }
  })

  return myPosts
}

const updatePost = async (postId: string, payload: IUpdatePostPayload, authorId: string, isAdmin: boolean) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId
    }
  })


  if(!isAdmin && post.authorId !== authorId){
    throw new Error("You are not the owner of this post")
  }

  const updatePost = await prisma.post.update({
    where: {
      id: postId
    },
    data: payload,
    include: {
      comments: true,
      author: {
        omit: {
          password: true
        }
      },
      _count: {
        select: {
          comments: true
        }
      }
    }
    
  })

  return updatePost
}

export const postService = {
  createPostIntoDB,
  getAllPostsFromDB,
  getAPostByIDFromDB,
  getMyPostFromDB,
  updatePost
};
