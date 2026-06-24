import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { ILoginPayload, IUserPayload } from "./auth.interface";
import jwt from "jsonwebtoken";
import { createToken } from "../../utils/createToken";

// Register user into database
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
      profile: {
        create: {
          profilePhoto,
        },
      },
    },
  });

  // await prisma.profile.create({
  //   data: {
  //     userId: createdUser.id,
  //     profilePhoto,
  //   },
  // });

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

// Login user
const loginUser = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const isPasswordMatch = await bcrypt.compare(String(password), user.password);

  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expiredIn as jwt.SignOptions,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expiredIn as jwt.SignOptions,
  );

  const { password: _, ...data } = user;

  return { data, accessToken, refreshToken };
};

export const userService = {
  registerUserIntoDB,
  loginUser,
};
