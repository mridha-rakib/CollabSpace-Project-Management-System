import { pinoLogger } from '@/middlewares/pino-logger';
import cookieParser from 'cookie-parser';
import express, {
  type Application
} from 'express';

import session from "cookie-session";
import env from './env';

  const app: Application = express();
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(session({
    name: 'session',
    keys:[env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  }))

  app.use(cookieParser());
  app.use(pinoLogger());
  app.use((req, res, next) => {
    console.error(`Content-Length: ${req.headers['content-length']}`);
    console.error(
      `Request Body Size: ${req.body ? Buffer.byteLength(JSON.stringify(req.body)) : 0}`
    );
    next();
  });
  
  export default app;
  