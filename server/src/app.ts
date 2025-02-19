import cookieParser from "cookie-parser";
import session from "cookie-session";
import express, {
  type Application,
} from "express";
import { Buffer } from "node:buffer";

import { pinoLogger } from "@/middlewares/pino-logger";

import env from "./env";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: "session",
  keys: [env.SESSION_SECRET],
  maxAge: 24 * 60 * 60 * 1000,
  secure: env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "lax",
}));

app.use(cookieParser());
app.use(pinoLogger());
app.use((req, _res, next) => {
  console.error(`Content-Length: ${req.headers["content-length"]}`);
  console.error(
    `Request Body Size: ${req.body ? Buffer.byteLength(JSON.stringify(req.body)) : 0}`,
  );
  next();
});

app.use(errorHandler);

export default app;
