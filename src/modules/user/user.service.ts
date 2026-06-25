import { prisma } from "../../lib/prisma";

const getMyProfileFromDB = async (userId: string) => {
    console.log("userId", userId);
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

export const userService = {
  getMyProfileFromDB,
};
