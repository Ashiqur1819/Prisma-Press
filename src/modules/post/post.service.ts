import { CommentStatus } from "../../../generated/prisma/enums";
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
  // const post = await prisma.post.findUniqueOrThrow({
  //   where: {
  //     id: postId,
  //   },
  // });

  // const updatedPost = await prisma.post.update({
  //   where: {
  //     id: postId,
  //   },
  //   data: {
  //     views: {
  //       increment: 1,
  //     },
  //   },
  //   include: {
  //     author: {
  //       omit: {
  //         password: true,
  //       },
  //     },
  //     comments: true,
  //   },
  // });

  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: "APPROVED",
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;
  });

  return transactionResult;
};

const getMyPostFromDB = async (authorId: string) => {
  const myPosts = prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createAt: "desc",
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return myPosts;
};

const updatePostFromDB = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post");
  }

  const updatePost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return updatePost;
};

const deletePostFromDB = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const getPostStats = async () => {
  const trasactionResult = await prisma.$transaction(async (tx) => {
    // const totalPosts = await tx.post.count()

    // const totalPublishedPost = await tx.post.count({
    //   where: {
    //     status: "PUBLISHED"
    //   }
    // })
    // const totalDraftPosts = await tx.post.count({
    //   where: {
    //     status: "DRAFT"
    //   }
    // })

    // const totalComments = await tx.comment.count()

    // const totalApprovedComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.APPROVED
    //   }
    // })

    // const totalRejectedComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.REJECT
    //   }
    // })

    // const totalPostViewsAggregate = await prisma.post.aggregate({
    //   _sum: {
    //     views: true
    //   }
    // })

    // const totalPostViews = totalPostViewsAggregate._sum.views

    const [
      totalPosts,
      totalPublishedPost,
      totalDraftPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalPostViewsAggregate,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: "PUBLISHED",
        },
      }),
      await tx.post.count({
        where: {
          status: "DRAFT",
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: CommentStatus.REJECT,
        },
      }),
      await prisma.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);
    return {
      totalPosts,
      totalPublishedPost,
      totalDraftPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalPostViews: totalPostViewsAggregate._sum.views,
    };
  });

  return trasactionResult;
};

export const postService = {
  createPostIntoDB,
  getAllPostsFromDB,
  getAPostByIDFromDB,
  getMyPostFromDB,
  updatePostFromDB,
  deletePostFromDB,
  getPostStats,
};
