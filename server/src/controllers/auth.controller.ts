import type { NextFunction, Request, Response } from "express";

import passport from "passport";

import { HTTPSTATUS } from "@/config/http.config";
import env from "@/env";
import { asyncHandler } from "@/middlewares/asyncHandler.middleware";
import { logger } from "@/middlewares/pino-logger";
import { registerUserService } from "@/services/auth.service";
import { registerSchema } from "@/validation/auth.validation";

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(req.user);

    const currentWorkspace = req.user?.currentWorkspace;

    if (!currentWorkspace) {
      return res.redirect(
        `${env.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`,
      );
    }

    return res.redirect(
      `${env.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`,
    );
  },
);

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({
      ...req.body,
    });

    await registerUserService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
    });
  },
);

export const loginController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: Error | null, user: Express.User | false, info: { message: string } | undefined) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: info?.message || "Invalid email or password",
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(HTTPSTATUS.OK).json({
        message: "Logged in successfully",
        user,
      });
    });
  })(req, res, next);
});

export const logOutController = asyncHandler(async (req: Request, res: Response) => {
  req.logOut((err) => {
    if (err) {
      logger.error("Logout error: ", err);

      return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({ error: "Failed log out" });
    }
  });

  req.session = null;
  return res
    .status(HTTPSTATUS.OK)
    .json({ message: "Logged out successfully" });
});
