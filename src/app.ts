import express, { Application, NextFunction, Request, Response } from "express";
import cookiesParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import { authRouter } from "./modules/auth/auth.route";
import { userRouter } from "./modules/user/user.route";
import { postRouter } from "./modules/post/post.route";
import notFound from "./middlewares/notFound";
import httpStatus from "http-status";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { subscriptionRoute } from "./modules/subscription/subscription.route";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/subscription", subscriptionRoute);

app.use(notFound);

app.use(globalErrorHandler);

export default app;
