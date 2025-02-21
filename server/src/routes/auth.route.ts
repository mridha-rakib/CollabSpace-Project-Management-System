import { Router } from "express";
import passport from "passport";

const authRoutes = Router();

authRoutes.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"],
}));

export default authRoutes;
