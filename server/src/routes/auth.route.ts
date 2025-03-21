import { Router } from "express";
import passport from "passport";

import { googleLoginCallback, loginController, logOutController, registerUserController } from "@/controllers/auth.controller";
import env from "@/env";
import isAuthenticated from "@/middlewares/isAuthenticated.middleware";

const failedUrl = `${env.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRoutes = Router();

authRoutes.post("/register", registerUserController);

authRoutes.post("/login", loginController);

authRoutes.post("/logout", isAuthenticated, logOutController);

authRoutes.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"],
}));

authRoutes.get("/google/callback", passport.authenticate("google", {
  failureRedirect: failedUrl,
}), googleLoginCallback);

export default authRoutes;
