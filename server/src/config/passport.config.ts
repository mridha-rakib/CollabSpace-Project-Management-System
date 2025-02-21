import type { Request } from "express";

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

import env from "@/env";
import { logger } from "@/middlewares/pino-logger";
import { NotFoundException } from "@/utils/appError";

passport.use(new GoogleStrategy({
  clientID: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  callbackURL: env.GOOGLE_CALLBACK_URL,
  scope: ["profile", "gmail"],
  passReqToCallback: true,
}, async (req: Request, accessToken, refreshToken, profile, done) => {
  try {
    const { email, sub: googleId, picture } = profile._json;
    logger.trace(profile, "profile");
    logger.trace(googleId, "googleId");

    if (!googleId) {
      throw new NotFoundException("Google Id (sub) is missing");
    }
    const user = "";
    done(null, user);
  }
  catch (error) {
    done(error, false);
  }
}));

passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password", session: true }, async (email, password, done) => {
  try {
    const user = "";
    return done(null, user);
  }
  catch (error: any) {
    return done(error, false, { message: error?.message });
  }
}));

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));
