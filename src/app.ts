import express, { Application, Request, Response } from 'express';
import cookiesParser from 'cookie-parser';
import cors from 'cors';
import config from './config';
import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';

const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.post("/api/users/register", async (req: Request, res: Response) => {
    try {
        const {name, email, password, profilePhoto} = req.body;

    const isExistingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (isExistingUser) {
        throw new Error("User already exists");
    }

    const hashedPasword = await bcrypt.hash(String(password), Number(config.bcrypt_salt_rounds));

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPasword
        }
    });

    await prisma.profile.create({
        data: {
            userId: createdUser.id,
            profilePhoto
        }
    });

    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
            email: createdUser.email || email
        },
        omit: {password: true},
        include: {
            profile: true
        }
    });

    res.status(httpStatus.CREATED).json({
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User created successfully",
        user
    });
    
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: "Failed to create user",
            error: (error as Error).message
        });
    }
});

export default app;