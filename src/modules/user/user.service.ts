import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { IUserPayload } from "./user.interface";

const registerUserIntoDB = async (payload: IUserPayload) => {
  const { name, email, password, profilePhoto } = payload;

  const isExistingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (isExistingUser) {
    throw new Error("User already exists");
  }

  const hashedPasword = await bcrypt.hash(
    String(password),
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPasword,
    },
  });

  await prisma.profile.create({
    data: {
      userId: createdUser.id,
      profilePhoto,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    omit: { password: true },
    include: {
      profile: true,
    },
  });

  return user;
};

export const userService = {
  registerUserIntoDB,
};
