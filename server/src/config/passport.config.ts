import type { Request } from "express";

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

import { ProviderEnum } from "@/enums/account-provider.enum";
import env from "@/env";
import { loginOrCreateAccountService, verifyUserService } from "@/services/auth.service";
import { NotFoundException } from "@/utils/appError";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req: Request, accessToken, refreshToken, profile, done) => {
      try {
        const { email, sub: googleId, picture } = profile._json;

        if (!googleId) {
          throw new NotFoundException("Google ID (sub) is missing");
        }

        const { user } = await loginOrCreateAccountService({
          provider: ProviderEnum.GOOGLE,
          displayName: profile.displayName,
          providerId: googleId,
          picture,
          email,
        });
        done(null, user);
      }
      catch (error) {
        done(error, false);
      }
    },
  ),
);

passport.use(
  new LocalStrategy (
    {
      usernameField: "email",
      passwordField: "password",
      session: true,
    },
    async (email, password, done) => {
      try {
        const user = await verifyUserService({ email, password });
        return done(null, user);
      }
      catch (error: any) {
        return done(error, false, { message: error?.message });
      }
    },
  ),
);

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser(async (user: any, done) => done(null, user));
