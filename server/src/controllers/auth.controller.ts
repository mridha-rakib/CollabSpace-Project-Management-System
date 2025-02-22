import type { Request, Response } from "express";

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
